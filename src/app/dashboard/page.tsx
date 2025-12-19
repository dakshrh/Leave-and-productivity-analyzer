"use client";

import { useEffect, useState } from "react";
import SummaryCard from "@/components/summarycard";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function fetchSummary() {
      const res = await fetch(
        "/api/summary?employeeId=69458daab44fd15961a3a1de&month=12&year=2025"
      );
      const data = await res.json();
      setSummary(data);
    }
    fetchSummary();
  }, []);

  if (!summary) {
    return <p className="text-center text-white">Loading...</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <SummaryCard {...summary} />
    </main>
  );
}
