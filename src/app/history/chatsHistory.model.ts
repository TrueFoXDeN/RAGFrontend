export interface ChatHistoryModel {
  chat_id: string;
  summary: string;
  created_on: Date;
}

export interface ChatHistoryCollectionModel {
  chats: ChatHistoryModel[];
}
