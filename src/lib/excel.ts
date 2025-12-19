function excelTimeToHHMM(value: any): string | null {
  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  if (typeof value === "string") return value;

  return null;
}

export function normalizeExcelData(rows: any[][]) {
  return rows.map((row) => {
    const excelDate = row[1];

    let parsedDate: Date | null = null;

    if (typeof excelDate === "number") {
      parsedDate = new Date(
        Math.round((excelDate - 25569) * 86400 * 1000)
      );
    } else if (excelDate instanceof Date) {
      parsedDate = excelDate;
    } else if (typeof excelDate === "string") {
      parsedDate = new Date(excelDate);
    }

    return {
      employee: row[0]?.toString().trim(),
      date: parsedDate,
      inTime: excelTimeToHHMM(row[2]),
      outTime: excelTimeToHHMM(row[3]),
    };
  });
}
