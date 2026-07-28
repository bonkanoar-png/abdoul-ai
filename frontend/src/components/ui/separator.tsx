type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Separator({ orientation = "horizontal", className = "" }: SeparatorProps) {
  return (
    <div
      className={`bg-line shrink-0 ${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
