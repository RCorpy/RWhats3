import { MessageStatus } from "../stores/messageStore";

export function createTempMessage(chatId: string, content: string) {
  return {
    id: `${Date.now()}`,
    chatId,
    senderId: "me",
    content: content.trim(),
    timestamp: Date.now(),
    status: MessageStatus.SENT,
  };
}
