import { Card } from "@/components/ui/card";

const conversations = [
  { id: "data", title: "Parcours Data", date: "Aujourd’hui" },
  { id: "projects", title: "Projets IA", date: "Démonstration" },
  { id: "skills", title: "Compétences techniques", date: "Démonstration" },
] as const;

export function ConversationList() {
  return (
    <aside aria-labelledby="conversation-history-title">
      <Card className="h-full">
        <h2
          className="text-ink text-xl font-bold tracking-[-0.03em]"
          id="conversation-history-title"
        >
          Conversations
        </h2>
        <p className="text-muted mt-2 text-sm">Historique de démonstration, non sauvegardé.</p>
        <ul className="mt-6 space-y-3">
          {conversations.map((conversation) => (
            <li className="border-line rounded-xl border p-3" key={conversation.id}>
              <p className="text-ink font-semibold">{conversation.title}</p>
              <p className="text-muted mt-1 text-xs">{conversation.date}</p>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
