export const promptSuggestions = [
  "Présente-moi le parcours Data d'Abdoul",
  "Quels sont ses projets IA ?",
  "Quelles technologies maîtrise-t-il ?",
  "Explique son expérience chez Orange",
] as const;

type PromptSuggestionsProps = {
  onSelect: (prompt: string) => void;
};

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div>
      <p className="text-muted text-sm font-semibold">Exemples de questions</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {promptSuggestions.map((prompt) => (
          <li key={prompt}>
            <button
              className="border-line bg-canvas text-ink hover:border-accent hover:text-accent-strong min-h-10 rounded-full border px-4 py-2 text-left text-sm font-semibold transition"
              type="button"
              onClick={() => onSelect(prompt)}
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
