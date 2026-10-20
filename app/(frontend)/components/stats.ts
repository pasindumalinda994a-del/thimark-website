export type Stat = {
  id: string;
  label: string;
  value: number;
  pad?: number;
  suffix?: string;
  unit?: string;
};

export const STATS: Stat[] = [
  {
    id: "factory",
    label: "Modern Factory",
    value: 29500,
    unit: "sq. ft.",
  },
  { id: "employees", label: "Employees", value: 95 },
  { id: "engineers", label: "Qualified Engineers", value: 7 },
  { id: "projects", label: "Projects Completed", value: 120, suffix: "+" },
];

export function formatStat(value: number, pad?: number) {
  const rounded = Math.round(value);
  if (pad) return String(rounded).padStart(pad, "0");
  return rounded.toLocaleString("en-US");
}
