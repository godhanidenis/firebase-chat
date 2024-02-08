"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Chat } from "@/types/chat";

// SearchBar Component
const SearchBar = () => {
  return (
    <div className="flex justify-between items-center relative my-6">
      <span className="text-gray-400 absolute left-4">
        {/* <SearchIcon fontSize="small" /> */}
      </span>
      <input
        type="text"
        className="w-full px-10 h-10 bg-[#F7F7F8] outline-none text-xs text-gray-400 rounded-[5px]"
        placeholder="Suchen"
      />
    </div>
  );
};

// MessageList.tsx

interface MessageListProps {
  messages: Chat[];
  onChatSelect: (chatId: string) => void;
}

// MessageList Component
const MessageList = ({ messages, onChatSelect }: MessageListProps) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-240px)] scrollbar-none">
      {messages.map((message) => (
        <div
          key={message.id}
          onClick={() => onChatSelect(message?.chatId ?? "")}
        >
          <MessageItem message={message} />
        </div>
      ))}
    </div>
  );
};

interface MessageItemProps {
  message: Chat;
}

// MessageItem Component
const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-white border-b">
      <div className="flex items-center">
        {/* Additional elements like role avatar can be added here */}
        {/* <p className="text-sm font-medium mr-2">{message.role}</p> */}
        <p className="text-xs text-gray-500">{message?.content}</p>
      </div>
      <div>
        <span className="text-xs text-gray-400">
          {message?.created_at?.toDateString()}
        </span>
      </div>
    </div>
  );
};

interface ChatHeaderProps {
  chatTitle: string;
  chatSubtitle: string;
}

// ChatHeader Component
const ChatHeader = ({ chatTitle, chatSubtitle }: ChatHeaderProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div>
          <p className="text-base">{chatTitle}</p>
          <p className="text-xs text-[#808080]">{chatSubtitle}</p>
        </div>
      </div>
    </div>
  );
};

interface ChatBodyProps {
  messages: Chat[];
}

// ChatBody Component
const ChatBody = ({ messages }: ChatBodyProps) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-240px)] scrollbar-none my-3">
      {messages.map((message, index) => (
        <div key={index} className={`flex justify-start`}>
          <span className="text-white bg-[#5B93FF] p-2 rounded-[5px] rounded-bl-none max-w-[350px] mb-2">
            <span className="text-xs">{message?.content}</span>
            <span className="text-[10px] flex justify-end opacity-80">
              {message?.created_at?.toDateString()}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

// ChatInput Component
const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  //state variables
  const [message, setMessage] = useState("");

  //handler for send message
  const handleSend = () => {
    if (message.trim()) {
      // Prevent sending empty messages
      onSendMessage(message);
      setMessage("");
    }
  };

  //handler for key press
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Check for Enter key without Shift
      event.preventDefault(); // Prevent default to avoid new line in input
      handleSend();
    }
  };

  return (
    <div className="flex justify-between items-center relative">
      <span className="text-gray-400 absolute left-4">
        {/* <GoPaperclip /> */}
      </span>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress} // Add key press handler
        className="w-full pl-10 pr-16 h-14 bg-[#F7F7F8] outline-none text-xs text-gray-400 rounded-[10px]"
        placeholder="Type a message..."
      />
      <span onClick={handleSend} className="text-[#605BFF] absolute right-4">
        {/* <RiSendPlaneFill /> */}
      </span>
    </div>
  );
};

// LeftPanel.tsx
interface LeftPanelProps {
  messages: Chat[];
  onChatSelect: (chatId: string) => void;
}

// LeftPanel Component
const LeftPanel: React.FC<LeftPanelProps> = ({ messages, onChatSelect }) => {
  return (
    <div className="w-1/3 h-[calc(100vh-65px)] bg-white rounded-xl p-5">
      <h2 className="text-base font-semibold">Mitteilungen</h2>
      <SearchBar />
      <MessageList messages={messages} onChatSelect={onChatSelect} />
    </div>
  );
};

interface ChatDetails {
  title: string;
  subtitle: string;
}

interface RightPanelProps {
  chatDetails: ChatDetails;
  messages: Chat[];
  onSendMessage: (message: string) => void;
}

// RightPanel.tsx
const RightPanel = ({
  chatDetails,
  messages,
  onSendMessage,
}: RightPanelProps) => {
  return (
    <div className="w-2/3 h-[calc(100vh-65px)] bg-white rounded-xl p-10">
      <ChatHeader
        chatTitle={chatDetails.title}
        chatSubtitle={chatDetails.subtitle}
      />
      <ChatBody messages={messages} />
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

// Define the grouped messages interface
interface GroupedMessages {
  [chatId: string]: Chat;
}

// MessagesPage.tsx
const Chat = () => {
  // State variables
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Chat[]>([
    {
      id: "1",
      chatId: "1",
      content: "Hello, how can I help you?",
      created_at: new Date(),
      sender: "Agent",
    },
    {
      id: "2",
      chatId: "2",
      content: "I have a question about my order.",
      created_at: new Date(),
      sender: "User",
    },
    // ...more messages...
  ]);
  const [chatDetails, setChatDetails] = useState<ChatDetails>({
    title: "Chat Title", // Example chat title
    subtitle: "Chat Subtitle", // Example chat subtitle
  });

  // Handler for selecting a chat
  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    // Update chatDetails logic goes here
    // Example:
    const newChatDetails = {
      title: "New Chat Title", // Replace with dynamic data
      subtitle: "New Chat Subtitle",
    };
    setChatDetails(newChatDetails);
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => message.chatId === selectedChatId);
  }, [messages, selectedChatId]);

  // Assuming messages are already sorted by timestamp
  const lastMessages: Chat[] = useMemo(() => {
    const groupedMessages = messages.reduce((acc: GroupedMessages, message) => {
      acc[message.chatId] = message;
      return acc;
    }, {});

    return Object.values(groupedMessages);
  }, [messages]);

  // Handler for sending a message
  const handleSendMessage = async (messageContent: string) => {};

  return (
    <div className="p-8 w-full flex gap-6">
      <LeftPanel messages={lastMessages} onChatSelect={handleChatSelect} />
      <RightPanel
        chatDetails={chatDetails}
        messages={filteredMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
