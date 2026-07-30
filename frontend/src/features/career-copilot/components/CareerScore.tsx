import { Card } from "@/components/ui/card";

type CareerScoreProps = {
  score: number;
  label: string;
};

export function CareerScore({ score, label }: CareerScoreProps) {
  return (
    <Card
      className="flex flex-col justify-center"
      role="status"
      aria-label={`Score carrière ${score} sur 100`}
    >
      <p className="text-accent-strong text-sm font-bold tracking-[0.16em] uppercase">
        Score global simulé
      </p>
      <p className="text-ink mt-4 text-5xl font-bold tracking-[-0.05em]">
        {score}
        <span className="text-muted text-2xl">/100</span>
      </p>
      <p className="text-muted mt-3 text-lg font-semibold">{label}</p>
      <div
        className="bg-secondary mt-6 h-3 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
      >
        <div className="bg-accent h-full rounded-full" style={{ width: `${score}%` }} />
      </div>
    </Card>
  );
}
