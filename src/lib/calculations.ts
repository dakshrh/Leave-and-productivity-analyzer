export function calculateWorkedHours(
  inTime: string | null,
  outTime: string | null
): number {
  if (!inTime || !outTime) return 0;

  const [inH, inM] = inTime.split(":").map(Number);
  const [outH, outM] = outTime.split(":").map(Number);

  if (
    [inH, inM, outH, outM].some((v) => Number.isNaN(v))
  ) {
    return 0;
  }

  const inMinutes = inH * 60 + inM;
  const outMinutes = outH * 60 + outM;

  const diff = outMinutes - inMinutes;

  return diff > 0 ? diff / 60 : 0;
}
