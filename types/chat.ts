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

// Assuming you have a type/interface for user data
interface User {
  // Define the structure of a user
  // For example:
  id: string;
  name?: string;
  // Add more properties if needed
}

export type { Chat, ManyChats, ChatUpdate, ChatCreation, User };
