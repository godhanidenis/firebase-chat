"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Chat, User } from "@/types/chat";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddEditUserModal from "./AddEditUserModal";
import SearchIcon from "@mui/icons-material/Search";
// import { DocumentData, QuerySnapshot, collection, getDocs, query } from "firebase/firestore/lite";
import { db } from "@/firebase";
import { Avatar, Box, Modal, Typography } from "@mui/material";
import { stringAvatar } from "@/utils";
import { FormSelectField } from "./core/CustomFormFields";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
// import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore/lite";
import { onSnapshot, collection, getDocs, query, getDoc, doc, setDoc } from "firebase/firestore";
import moment from "moment";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

const storage = getStorage();

const uploadModelStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// SearchBar Component
const SearchBar = ({ setSearchText }: any) => {
  return (
    <div className="flex justify-between items-center relative my-6">
      <span className="text-gray-400 absolute left-2">
        <SearchIcon />
      </span>
      <input
        type="text"
        className="w-full px-10 h-10 bg-[#F7F7F8] outline-none text-xs text-gray-400 rounded-[5px]"
        placeholder="Search or start new chat"
        onChange={(e: any) => setSearchText(e.target.value)}
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
        <div key={message.id} onClick={() => onChatSelect(message?.chatId ?? "")}>
          <MessageItem message={message} />
        </div>
      ))}
    </div>
  );
};
interface ChatsListProps {
  chats: Chat[];
  searchText: any;
  users: any;
  selectedClientId: any;
  selectedBusinessId: any;
  onChatSelect: (chatId: string) => void;
}

const ChatsList = ({ chats, searchText, users, selectedClientId, selectedBusinessId, onChatSelect }: ChatsListProps) => {
  console.log("usersChats", users);

  const filteredData = chats?.filter(
    (option: any) =>
      (selectedClientId === option?.clintUserInfo?.id
        ? option?.businessUserInfo?.name?.toLowerCase().includes(searchText.toLowerCase()) || option?.businessUserInfo?.phone.includes(searchText)
        : option?.clintUserInfo?.name?.toLowerCase().includes(searchText.toLowerCase()) || option?.clintUserInfo?.phone.includes(searchText)) ||
      option?.messages?.some((message: any) => message?.messageContent?.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="overflow-y-auto max-h-[400px] scrollbar-none">
      {filteredData?.map((chats: any) => {
        // const FindName = users?.find((item: any) => item?.id === chats.businessId)?.name;
        const lastMessage = chats?.messages?.length > 0 && chats?.messages[chats?.messages?.length - 1];
        console.log("chats-=-", lastMessage?.messageContent);

        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        const checkISUrl = urlPattern.test(lastMessage?.messageContent);

        if (selectedClientId === chats?.clintUserInfo?.id) {
          const findUserOnlineOrOffline = users?.find((item: any) => item?.id === chats?.businessUserInfo?.id);
          return (
            <div key={chats.id} onClick={() => onChatSelect(chats)} className="cursor-pointer">
              <div className="flex items-center justify-between py-3 px-4 bg-white border-b">
                <div className="flex items-center gap-3 w-full">
                  <Avatar {...stringAvatar(`${chats.businessUserInfo.name} D`)} />
                  <div>
                    <p className="text-xs text-gray-500">{chats.businessUserInfo.name}</p>
                    <p className="text-xs text-gray-500">{checkISUrl ? "photo" : lastMessage?.messageContent}</p>
                  </div>
                  <p className={`text-xs ml-auto text-gray-500 ${findUserOnlineOrOffline?.is_online ? " text-green-500" : "text-gray-500"}`}>
                    {findUserOnlineOrOffline?.is_online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          );
        } else if (selectedBusinessId === chats?.businessUserInfo?.id) {
          if (chats?.messages?.length > 0) {
            const findUserOnlineOrOffline = users?.find((item: any) => item?.id === chats?.clintUserInfo?.id);
            return (
              <div key={chats.id} onClick={() => onChatSelect(chats)} className="cursor-pointer">
                <div className="flex items-center justify-between py-3 px-4 bg-white border-b">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar {...stringAvatar(`${chats.clintUserInfo.name} D`)} />
                    <div>
                      <p className="text-xs text-gray-500">{chats.clintUserInfo.name}</p>
                      <p className="text-xs text-gray-500">{checkISUrl ? "photo" : lastMessage?.messageContent}</p>
                    </div>
                    <p className={`text-xs ml-auto text-gray-500 ${findUserOnlineOrOffline?.is_online ? " text-green-500" : "text-gray-500"}`}>
                      {findUserOnlineOrOffline?.is_online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        }
      })}
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
        <Avatar {...stringAvatar("Kent Dodds")} />
        {/* Additional elements like role avatar can be added here */}
        {/* <p className="text-sm font-medium mr-2">{message.role}</p> */}
        {/* <p className="text-xs text-gray-500">{message?.content}</p> */}
      </div>
      {/* <div>
        <span className="text-xs text-gray-400">
          {message?.created_at?.toDateString()}
        </span>
      </div> */}
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
          {/* <p className="text-base">{chatTitle}</p>
          <p className="text-base">{chatSubtitle}</p> */}
          <p className="text-lg font-semibold text-[#000]">{chatTitle}</p>
          {/* <p className="text-xs text-[#808080]">{chatSubtitle}</p> */}
        </div>
      </div>
    </div>
  );
};

interface ChatBodyProps {
  messages: Chat[];
  selectedUserType: any;
  selectedBusinessId: any;
  selectedClientId: any;
}

// ChatBody Component
const ChatBody = ({ messages, selectedUserType, selectedClientId, selectedBusinessId }: ChatBodyProps) => {
  console.log("messages/*/*", messages);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="overflow-y-auto h-[calc(100vh-240px)] scrollbar-none my-3">
      {messages?.map((message: any, index) => {
        const milliseconds = message?.time.seconds * 1000 + message?.time.nanoseconds / 1000000;
        const messageTime = new Date(milliseconds);
        const time = moment(messageTime);

        // const momentDate = moment(time);
        // const finalDate = momentDate.fromNow();
        // console.log("finalDate/*/*/", finalDate);

        // Regular expression to match URLs
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        const checkISUrl = urlPattern.test(message?.messageContent);

        return (
          <div
            key={index}
            className={`flex justify-start ${
              (selectedUserType === "user" && selectedClientId === message?.senderID) ||
              (selectedUserType !== "user" && selectedBusinessId === message?.senderID)
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <span
              className={`text-white p-2 rounded-[5px] rounded-bl-none max-w-[350px] mb-2 ${
                (selectedUserType === "user" && selectedClientId === message?.senderID) ||
                (selectedUserType !== "user" && selectedBusinessId === message?.senderID)
                  ? "bg-[#5B93FF]"
                  : "bg-[green]"
              }`}
            >
              {checkISUrl ? (
                <img src={message?.messageContent} style={{ width: "100px", height: "100px" }} />
              ) : (
                <span className="text-xs">{message?.messageContent}</span>
              )}

              <span className="text-[10px] flex justify-end opacity-80">
                {time.format("h:mm a")} {""}
                {/* {messageTime.toDateString()} */}
              </span>
            </span>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface ChatInputProps {
  onSendMessage: any;
  handleUpload: any;
  setDocument: any;
  uploading: any;
  uploadLink: any;
  handleSendUploadMessage: any;
}

// ChatInput Component
const ChatInput = ({ onSendMessage, handleSendUploadMessage, handleUpload, setDocument, uploading, uploadLink }: ChatInputProps) => {
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

  // const [document, setDocument] = useState<any>(null);
  // const [uploading, setUploading] = useState(false);
  // const [uploadLink, setUploadLink] = useState("");

  // Function to handle document selection
  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setDocument(selectedFile);
  };

  // const handleUpload = async () => {
  //   if (!document) return;

  //   setUploading(true);

  //   const storageRef = ref(storage, `uploads/${document.name}`);
  //   const uploadTask = uploadBytesResumable(storageRef, document);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       // Handle progress
  //     },
  //     (error) => {
  //       // Handle errors
  //       console.error("Error uploading document: ", error);
  //     },
  //     () => {
  //       // Upload completed successfully
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         // Pass the download URL to the parent component
  //         console.log("downloadURL", downloadURL);
  //         setUploadLink(downloadURL);
  //         setUploading(false);
  //       });
  //     }
  //   );
  // };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex justify-between items-center gap-3 relative w-full">
      <div className="w-[70%]">
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
      <div className="w-[30%]">
        <button className="bg-black py-1 px-3 rounded-md" onClick={handleOpen}>
          upload
        </button>
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={uploadModelStyle}>
          <div>
            <input type="file" className="bg-black w-full mb-4" onChange={handleFileChange} />
            <button className="bg-black py-1 px-3 rounded-md mb-4" onClick={() => handleUpload()}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {uploadLink && (
            <button
              onClick={() => {
                handleSendUploadMessage();
                handleClose();
              }}
              className="bg-green-500 py-1 px-3 rounded-md"
            >
              Send
            </button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

// LeftPanel.tsx
interface LeftPanelProps {
  onChatSelect: (chatId: string) => void;
  handleOpenModal: () => void;
  users: any;
  allChats: any;
  setSelectedClientId: any;
  selectedClientId: any;
  setSelectedBusinessId: any;
  selectedBusinessId: any;
  selectedUserType: any;
  setSelectedUserType: any;
}

// LeftPanel Component
const LeftPanel: React.FC<LeftPanelProps> = ({
  onChatSelect,
  handleOpenModal,
  users,
  allChats,
  selectedClientId,
  setSelectedClientId,
  selectedBusinessId,
  setSelectedBusinessId,
  selectedUserType,
  setSelectedUserType,
}) => {
  const filterOnlyUserList = users && users?.filter((item: any) => item?.type === "user");

  const filterOnlyBusinessList = users && users?.filter((item: any) => item?.type === "business");
  const [searchText, setSearchText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    getValues,
    control,
    clearErrors,
  } = useForm({
    defaultValues: {
      type: "",
      userList: "",
      businessList: "",
    },
  });

  const onChangeBusiness = async (business_Id: any) => {
    setSelectedBusinessId(business_Id);
    setValue("businessList", business_Id);

    const FindBusiness = filterOnlyBusinessList?.find((item: any) => item?.id === business_Id);
    const FindClient = filterOnlyUserList?.find((item: any) => item?.id === selectedClientId);

    console.log("FindBusiness", FindBusiness, FindClient);

    // const payload = {
    //   type: selectedUserType,
    //   clintId: selectedClientId,
    //   businessId: business_Id,
    //   created_at: new Date(),
    // };
    const payload = {
      type: selectedUserType,
      clintUserInfo: { id: selectedClientId, name: FindClient?.name, phone: FindClient?.phone },
      businessUserInfo: { id: business_Id, name: FindBusiness?.name, phone: FindBusiness?.phone },
      created_at: new Date(),
    };
    const ID = uuidv4();
    console.log("payload ID:", payload, ID);

    if (selectedUserType === "user") {
      if (allChats?.some((item: any) => item.businessUserInfo.id === business_Id && item.clintUserInfo.id === selectedClientId)) {
        alert("Alerady Chat added!");
      } else {
        await setDoc(doc(db, "chats", ID), payload);
        alert("Chat add sucessfully");
      }
    }
  };
  const onChangeUser = async (user_Id: any) => {
    setSelectedClientId(user_Id);
    setValue("userList", user_Id);
  };

  return (
    <div className="w-1/3 h-[calc(100vh-65px)] bg-white rounded-xl p-5">
      <div className="flex justify-between">
        <span className="font-semibold text-[20px] text-[black]">Firebase Chat</span>
        <PersonAddAltIcon sx={{ color: "black" }} onClick={handleOpenModal} className="hover:cursor-pointer" />
      </div>
      <div className="flex flex-col gap-1 mb-5 mt-3">
        <span className="text-[16px] font-semibold text-[#000000]">Type</span>
        <FormSelectField
          name="type"
          control={control}
          onChange={(e: any) => {
            setSelectedUserType(e.target.value);
            setValue("type", e.target.value);
            setValue("userList", "");
            setValue("businessList", "");
          }}
          options={[
            { value: "business", label: "Business" },
            { value: "user", label: "User" },
          ]}
        />
      </div>

      {selectedUserType === "user" && (
        <div className="flex flex-col gap-1 mb-5 mt-3">
          <span className="text-[16px] font-semibold text-[#000000]">User List</span>
          <FormSelectField
            name="userList"
            control={control}
            onChange={(e: any) => {
              console.log("eee", e.target.value);

              onChangeUser(e.target.value);
            }}
            options={filterOnlyUserList?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </div>
      )}

      {selectedUserType && (
        <div className="flex flex-col gap-1 mb-5 mt-3">
          <span className="text-[16px] font-semibold text-[#000000]">Business List</span>
          <FormSelectField
            name="businessList"
            control={control}
            onChange={(e: any) => {
              console.log("eee", e.target.value);
              onChangeBusiness(e.target.value);
            }}
            options={filterOnlyBusinessList?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </div>
      )}
      <SearchBar setSearchText={setSearchText} />
      {/* <MessageList messages={messages} onChatSelect={onChatSelect} /> */}
      {/* {selectedUserType === "user" && ( */}
      <ChatsList
        chats={allChats}
        searchText={searchText}
        users={users}
        selectedClientId={selectedClientId}
        selectedBusinessId={selectedBusinessId}
        onChatSelect={onChatSelect}
      />
      {/* )} */}
    </div>
  );
};

interface ChatDetails {
  title: string;
  subtitle: string;
}

interface RightPanelProps {
  selectedUserType: any;
  chatDetails: any;
  messages: Chat[];
  onSendMessage: any;
  selectedBusinessId: any;
  selectedClientId: any;
  handleUpload: any;
  setDocument: any;
  uploading: any;
  uploadLink: any;
  handleSendUploadMessage: any;
}

// RightPanel.tsx
const RightPanel = ({
  selectedUserType,
  selectedBusinessId,
  selectedClientId,
  chatDetails,
  messages,
  onSendMessage,
  handleUpload,
  setDocument,
  uploading,
  uploadLink,
  handleSendUploadMessage,
}: RightPanelProps) => {
  const chatTitle = selectedUserType === "user" ? chatDetails?.businessUserInfo?.name : chatDetails?.clintUserInfo?.name;
  return (
    <div className="w-2/3 h-[calc(100vh-65px)] bg-white rounded-xl p-5">
      <ChatHeader chatTitle={chatTitle} chatSubtitle={chatTitle} />
      <ChatBody messages={messages} selectedUserType={selectedUserType} selectedBusinessId={selectedBusinessId} selectedClientId={selectedClientId} />
      <ChatInput
        onSendMessage={onSendMessage}
        handleSendUploadMessage={handleSendUploadMessage}
        handleUpload={handleUpload}
        setDocument={setDocument}
        uploading={uploading}
        uploadLink={uploadLink}
      />
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
  const [userModal, setuserModal] = useState<boolean>(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  console.log("messages////", messages);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedBusinessId, setSelectedBusinessId] = useState("");

  const [chatDetails, setChatDetails] = useState<any>({});
  const [selectedUserType, setSelectedUserType] = useState("");

  const handleOpenUserModal = () => setuserModal(true);

  const handleCloseUserModal = () => setuserModal(false);

  // Handler for selecting a chat
  const handleChatSelect = async (chats: any) => {
    console.log("chats*/*/", chats);
    setChatDetails(chats);
  };

  useEffect(() => {
    if (!chatDetails?.id) return;
    const messagesLive = onSnapshot(doc(db, "chats", chatDetails?.id), (doc: any) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      } else {
        console.log("No such document!");
      }
    });

    return () => messagesLive();
  }, [chatDetails?.id]);

  // const filteredMessages = useMemo(() => {
  //   return messages?.filter((message) => message.chatId === selectedChatId);
  // }, [messages, selectedChatId]);

  // Assuming messages are already sorted by timestamp
  // const lastMessages: Chat[] = useMemo(() => {
  //   const groupedMessages = messages?.reduce((acc: GroupedMessages, message) => {
  //     acc[message.chatId] = message;
  //     return acc;
  //   }, {});

  //   return Object.values(groupedMessages);
  // }, [messages]);

  // Handler for sending a message
  const handleSendMessage = async (messageContent: any) => {
    console.log("chatDetails", chatDetails);

    const messageData: any = {
      senderID: selectedUserType === "user" ? chatDetails?.clintUserInfo?.id : chatDetails?.businessUserInfo?.id,
      senderName: selectedUserType === "user" ? chatDetails?.clintUserInfo?.name : chatDetails?.businessUserInfo?.name,
      messageContent: messageContent,
      time: new Date(),
    };

    if (chatDetails?.clintUserInfo?.id && chatDetails) {
      try {
        const docRef = doc(db, "chats", chatDetails?.id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          const MeargeData = data?.messages ? [...data?.messages, messageData] : [messageData];

          await setDoc(docRef, { ["messages"]: MeargeData }, { merge: true });
          // setMessages(MeargeData);
          console.log("Document successfully updated!");
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const [document, setDocument] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadLink, setUploadLink] = useState("");

  const handleUpload = async () => {
    if (!document) return;

    if (chatDetails?.clintUserInfo?.id || chatDetails?.businessUserInfo?.id) {
      setUploading(true);

      const storageRef = ref(storage, `uploads/${document.name}`);
      const uploadTask = uploadBytesResumable(storageRef, document);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          // Handle errors
          console.error("Error uploading document: ", error);
        },
        () => {
          // Upload completed successfully
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Pass the download URL to the parent component
            console.log("downloadURL", downloadURL);
            setUploadLink(downloadURL);
            setUploading(false);
          });
        }
      );
    }
  };

  const handleSendUploadMessage = () => {
    handleSendMessage(uploadLink);
  };

  const [users, setUsers] = useState<User[]>([]);
  const [allChats, setAllChats] = useState<User[]>([]);

  useEffect(() => {
    const fetchChats = () => {
      const chatsRef = collection(db, "chats");
      const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
        const updatedChats: any = [];
        querySnapshot.forEach((doc) => {
          updatedChats.push({ id: doc.id, ...doc.data() });
        });
        setAllChats(updatedChats);
      });
      return () => unsubscribe();
    };
    fetchChats();
  }, []); // Empty dependency array means it will only run once on component mount

  useEffect(() => {
    // async function fetchUsers() {
    //   const usersRef = collection(db, "users");
    //   const q = query(usersRef);
    //   const querySnapshot = await getDocs(q);
    //   const usersList: User[] = querySnapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    //   setUsers(usersList);
    // }
    // fetchUsers();

    const fetchUsers = () => {
      const usersRef = collection(db, "users");
      const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
        const updatedUsers: any = [];
        querySnapshot.forEach((doc) => {
          updatedUsers.push({ id: doc.id, ...doc.data() });
        });
        setUsers(updatedUsers);
      });
      return () => unsubscribe();
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("users:", users);
  }, [users]);

  const [isTabActive, setIsTabActive] = useState(true);

  const updateUserStatus = async () => {
    const userID = selectedUserType === "user" ? selectedClientId : selectedBusinessId;

    if (userID) {
      const docRef = doc(db, "users", userID);

      const userLive = onSnapshot(doc(db, "users", userID), (doc: any) => {
        if (doc.exists()) {
          setDoc(docRef, { ["is_online"]: isTabActive }, { merge: true });
        } else {
          console.log("No such document!");
        }
      });

      return () => userLive();
    }
  };

  useEffect(() => {
    updateUserStatus();
  }, [isTabActive, selectedClientId, selectedBusinessId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsTabActive(false);
    };

    const handleUnload = () => {
      setIsTabActive(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <div className="p-8 w-full flex gap-6">
      <LeftPanel
        // messages={lastMessages}
        onChatSelect={handleChatSelect}
        handleOpenModal={handleOpenUserModal}
        users={users}
        // fatchChats={fatchChats}
        allChats={allChats}
        selectedUserType={selectedUserType}
        setSelectedClientId={setSelectedClientId}
        setSelectedUserType={setSelectedUserType}
        selectedClientId={selectedClientId}
        selectedBusinessId={selectedBusinessId}
        setSelectedBusinessId={setSelectedBusinessId}
      />
      {/* <RightPanel chatDetails={chatDetails} messages={filteredMessages} onSendMessage={handleSendMessage} /> */}
      <RightPanel
        chatDetails={chatDetails}
        messages={messages}
        selectedUserType={selectedUserType}
        selectedBusinessId={selectedBusinessId}
        selectedClientId={selectedClientId}
        onSendMessage={handleSendMessage}
        handleUpload={handleUpload}
        setDocument={setDocument}
        uploading={uploading}
        uploadLink={uploadLink}
        handleSendUploadMessage={handleSendUploadMessage}
      />
      <AddEditUserModal open={userModal} handleCloseModal={handleCloseUserModal} />
    </div>
  );
};

export default Chat;
