interface ChatCreation {
  content: string;
  chatId: string;
  sender: string;
}

interface ChatUpdate extends ChatCreation {}

interface Chat extends ChatUpdate {
  id: string;
  created_at?: Date;
  updated_at?: Date;
}

interface ManyChats {
  items: Chat[];
  count: number;
  total: number;
  skip: number;
}

export type { Chat, ManyChats, ChatUpdate, ChatCreation };
