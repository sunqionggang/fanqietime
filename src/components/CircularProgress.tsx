import { cn } from "@/lib/utils";

export function CircularProgress({ percent, color }: { percent: number; color: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color.replace('bg-', 'stroke-')}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        className="transition-all duration-1000 ease-linear"
      />
    </svg>
  );
}
