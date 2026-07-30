import { Badge } from "@/components/ui/badge";
import type { MessageSource } from "@/features/chat/types/message";

type SourcePreviewProps = {
  sources: MessageSource[];
};

export function SourcePreview({ sources }: SourcePreviewProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <Badge variant="neutral">Sources préparées</Badge>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li className="border-line bg-canvas rounded-xl border p-3" key={source.url}>
            <a
              className="text-ink font-bold underline decoration-2 underline-offset-4"
              href={source.url}
            >
              {source.title}
            </a>
            <p className="text-muted mt-1 text-sm leading-6">{source.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
