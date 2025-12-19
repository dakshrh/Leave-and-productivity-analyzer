interface SummaryCardProps {
  employee: string;
  month: string;
  totalDays: number;
  workingDays: number;
  leaveDays: number;
  totalWorkedHours: number;
  averageHoursPerDay: number;
  productivityPercentage: number;
  productivityLabel: string;
}

export default function SummaryCard({
  employee,
  month,
  totalDays,
  workingDays,
  leaveDays,
  totalWorkedHours,
  averageHoursPerDay,
  productivityPercentage,
  productivityLabel,
}: SummaryCardProps) {
  const colorMap: Record<string, string> = {
    Excellent: "text-green-500",
    Good: "text-blue-500",
    Average: "text-yellow-500",
    Poor: "text-red-500",
  };

  return (
    <div className="border rounded-xl p-6 text-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">{employee}</h2>
      <p className="text-gray-400 mb-4">{month}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>📅 Total Days: <b>{totalDays}</b></div>
        <div>🧑‍💼 Working Days: <b>{workingDays}</b></div>
        <div>🛌 Leave Days: <b>{leaveDays}</b></div>
        <div>⏱ Total Hours: <b>{totalWorkedHours}</b></div>
        <div>📊 Avg Hours/Day: <b>{averageHoursPerDay}</b></div>
        <div>
          🚀 Productivity:{" "}
          <b className={colorMap[productivityLabel]}>
            {productivityPercentage}% ({productivityLabel})
          </b>
        </div>
      </div>
    </div>
  );
}
