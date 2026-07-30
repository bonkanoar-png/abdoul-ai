import { SourcePreview } from "@/features/chat/components/SourcePreview";
import type { Message } from "@/features/chat/types/message";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      aria-label={isUser ? "Message utilisateur" : "Message assistant"}
    >
      <div
        className={`max-w-[88%] rounded-3xl px-5 py-4 sm:max-w-[78%] ${
          isUser ? "bg-ink text-canvas rounded-br-md" : "bg-secondary text-ink rounded-bl-md"
        }`}
      >
        <p className="leading-7 whitespace-pre-wrap">{message.content}</p>
        {message.sources?.length ? <SourcePreview sources={message.sources} /> : null}
      </div>
    </article>
  );
}
