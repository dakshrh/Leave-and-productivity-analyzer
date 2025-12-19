import type { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import { IncomingForm, File } from "formidable";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import { normalizeExcelData } from "@/lib/excel";
import { calculateWorkedHours } from "@/lib/calculations";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1️⃣ Parse multipart form
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
    });

    const files = await new Promise<Record<string, File[] | undefined>>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve(files as Record<string, File[] | undefined>);
        });
      }
    );

    const uploadedFile = files.file?.[0];

    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 2️⃣ Read Excel buffer
    const buffer = fs.readFileSync(uploadedFile.filepath);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 3️⃣ Read sheet as array-of-arrays
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
    });

    // Skip header row
    const rows = normalizeExcelData(rawRows.slice(1));

    const attendanceRecords: any[] = [];

    // 4️⃣ Process rows
    for (const row of rows) {
      if (!row.employee || !(row.date instanceof Date)) continue;

      let employee = await prisma.employee.findFirst({
        where: { name: row.employee },
      });

      if (!employee) {
        employee = await prisma.employee.create({
          data: { name: row.employee },
        });
      }

      // ✅ ALWAYS a valid number (never NaN)
      const workedHours = Number(
        calculateWorkedHours(row.inTime, row.outTime)
      );

      attendanceRecords.push({
        employeeId: employee.id,
        date: row.date,
        inTime: row.inTime,
        outTime: row.outTime,
        workedHours,
        isLeave: workedHours === 0,
      });
    }

    // 5️⃣ Insert into DB
    if (attendanceRecords.length > 0) {
      await prisma.attendance.createMany({
        data: attendanceRecords,
      });
    }

    return res.status(200).json({
      message: "Attendance data saved successfully",
      recordsInserted: attendanceRecords.length,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({
      error: "Failed to process Excel file",
    });
  }
}
