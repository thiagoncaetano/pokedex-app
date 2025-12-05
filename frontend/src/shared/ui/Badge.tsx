interface BadgeProps {
  text: string;
  color: string;
  className?: string;
}

export function Badge({ text, color, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-xs sm:text-sm font-semibold text-white shadow-sm ${className ?? ''}`}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  );
}
