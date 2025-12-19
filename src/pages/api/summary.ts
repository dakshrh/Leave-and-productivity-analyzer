import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

function getProductivityLabel(avgHours: number) {
  if (avgHours >= 8) return "Excellent";
  if (avgHours >= 6) return "Good";
  if (avgHours >= 4) return "Average";
  return "Poor";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { employeeId, month, year } = req.query;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const monthIndex = Number(month) - 1;
    const startDate = new Date(Number(year), monthIndex, 1);
    const endDate = new Date(Number(year), monthIndex + 1, 0);

    const employee = await prisma.employee.findUnique({
      where: { id: String(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        employeeId: String(employeeId),
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalDays = endDate.getDate();
    const workingDays = attendance.length;
    const leaveDays = totalDays - workingDays;

    const totalWorkedHours = attendance.reduce(
      (sum, a) => sum + a.workedHours,
      0
    );

    const averageHoursPerDay =
      workingDays > 0
        ? Number((totalWorkedHours / workingDays).toFixed(2))
        : 0;

    const productivityPercentage = Math.min(
      100,
      Math.round((averageHoursPerDay / 8) * 100)
    );

    const productivityLabel = getProductivityLabel(averageHoursPerDay);

    const monthName = startDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    return res.status(200).json({
      employee: employee.name,
      month: monthName,
      totalDays,
      workingDays,
      leaveDays,
      totalWorkedHours,
      averageHoursPerDay,
      productivityPercentage,
      productivityLabel, // ✅ STEP C
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
}
