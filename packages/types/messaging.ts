export interface ConversationParticipant {
  userId: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
}
