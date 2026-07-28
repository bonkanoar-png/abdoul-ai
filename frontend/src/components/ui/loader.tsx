type LoaderProps = {
  label?: string;
  className?: string;
};

export function Loader({ label = "Chargement en cours", className = "" }: LoaderProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} role="status">
      <span
        className="border-line border-t-primary size-5 animate-spin rounded-full border-2"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
