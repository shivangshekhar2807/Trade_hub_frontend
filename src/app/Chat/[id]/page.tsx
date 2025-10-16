// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { Send, MoreVertical } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { createSocketConnection } from "@/utils/socket";
// import { useSelector } from "react-redux";

// interface Message {
//     id: string;
//     senderId: string;
//     receiverId: string;
//     text: string;
//     timestamp: string;
// }

// interface User{
//     firstName: string,
//     photoUrl:string
// }

// const Chat: React.FC = () => {
//     const [messages, setMessages] = useState<Message[]>([
//         {
//             id: "1",
//             senderId: "shivang",
//             receiverId: "messi",
//             text: "Hey! How are you?",
//             timestamp: "10:30 AM",
//         },
//         {
//             id: "2",
//             senderId: "messi",
//             receiverId: "shivang",
//             text: "I'm good! What about you?",
//             timestamp: "10:31 AM",
//         },
//         {
//             id: "3",
//             senderId: "shivang",
//             receiverId: "messi",
//             text: "Doing great, just wanted to talk about the product deal!",
//             timestamp: "10:33 AM",
//         },
//         {
//             id: "4",
//             senderId: "messi",
//             receiverId: "shivang",
//             text: "Sure! I’m all ears 😊",
//             timestamp: "10:34 AM",
//         },
//     ]);

//     const [input, setInput] = useState("");
//     const chatEndRef = useRef<HTMLDivElement | null>(null);
//     const router = useRouter();
//     const user = useSelector((state: any)=>state.user)

//     const { id } = useParams();

//     console.log("iddddd",id)

//     // ✅ Replace with your actual logged-in user’s ID
//     const currentUserId = "shivang";

//     useEffect(() => {
//         if (!id) { return }
//         const arr = id.toString().split('_');
//         console.log(arr);

//         const seller = arr[2];
//         const buyer = arr[2];

//         const socket = createSocketConnection();
//         socket.emit("joinChat", {id})


//         socket.on("messageRecieved", ({ newMessage, firstName }) => {
//             console.log(newMessage, firstName)
//         })
        
//         return () => {
//             console.log("Socket Disconnected")
//             socket.disconnect();
//         }
//     }, [id]);

//     const handleSend = () => {
//         if (!input.trim()) return;
//         const socket = createSocketConnection();

//         const newMessage: Message = {
//             id: Math.random().toString(),
//             senderId: currentUserId,
//             receiverId: "messi",
//             text: input,
//             timestamp: new Date().toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//             }),


//         };

//         socket.emit("sendMessage", { newMessage, firstName: user.firstName,id })

//         setMessages((prev) => [...prev, newMessage]);
//         setInput("");
//     };

//     // 👇 Auto-scroll to the latest message
//     useEffect(() => {
//         chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     return (
//         <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
//             {/* 🧭 Header */}
//             <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100 rounded-t-xl">
//                 <div>
//                     <h2 className="text-lg font-semibold text-gray-800">
//                         <button onClick={()=>router.back()}>back</button>
//                         {user.firstName}</h2>
//                     <p className="text-sm text-green-500">Online</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                     <img
//                         src={user.photoUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
//                         alt="User"
//                         className="w-10 h-10 rounded-full border border-gray-300"
//                     />
//                     <MoreVertical className="text-gray-600 cursor-pointer" />
//                 </div>
//             </div>

//             {/* 💬 Chat Window */}
//             <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
//                 {messages.map((msg) => {
//                     const isSender = msg.senderId === currentUserId;
//                     return (
//                         <div
//                             key={msg.id}
//                             className={`flex ${isSender ? "justify-end" : "justify-start"
//                                 } items-end`}
//                         >
//                             {/* Receiver Avatar */}
//                             {!isSender && (
//                                 <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
//                                     alt="Receiver"
//                                     className="w-8 h-8 rounded-full mr-2"
//                                 />
//                             )}

//                             {/* Message Bubble */}
//                             <div
//                                 className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow ${isSender
//                                         ? "bg-blue-600 text-white rounded-br-none"
//                                         : "bg-gray-200 text-gray-800 rounded-bl-none"
//                                     }`}
//                             >
//                                 <p>{msg.text}</p>
//                                 <p
//                                     className={`text-[10px] mt-1 text-right ${isSender ? "text-blue-100" : "text-gray-500"
//                                         }`}
//                                 >
//                                     {msg.timestamp}
//                                 </p>
//                             </div>

//                             {/* Sender Avatar */}
//                             {isSender && (
//                                 <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
//                                     alt="Sender"
//                                     className="w-8 h-8 rounded-full ml-2"
//                                 />
//                             )}
//                         </div>
//                     );
//                 })}
//                 <div ref={chatEndRef} />
//             </div>

//             {/* 📝 Input Section */}
//             <div className="flex items-center p-3 border-t bg-white rounded-b-xl">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type a message..."
//                     className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 />
//                 <button
//                     onClick={handleSend}
//                     className="ml-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
//                 >
//                     <Send className="w-5 h-5" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Chat;






"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, MoreVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createSocketConnection } from "@/utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/utils/constant";

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
   
    ]);



    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const user = useSelector((state: any) => state.user);

    const { id } = useParams();

    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [otherUserId, setOtherUserId] = useState<string>("");
    const [firstName, setFirstName] = useState("");
    const [photoUrl,setPhotoUrl]=useState("")

    useEffect(() => {
        if (!id || !user?._id) return;

        const arr = id.toString().split("_");
       
        const buyerId = arr[2];
        const sellerId = arr[3];

        const combinedId = `${buyerId}_${sellerId}`;

        let profile:any;

      
        if (user._id === buyerId) {
            setCurrentUserId(buyerId);
            setOtherUserId(sellerId);
            profile = sellerId
        } else if (user._id === sellerId) {
            setCurrentUserId(sellerId);
            setOtherUserId(buyerId);
            profile=buyerId
        }

        const fetchData = async () => {
            try {
                const resProfile = await fetch(`${BASE_URL}/profile/${profile}`,{credentials:"include"});
                if (!resProfile.ok) {
                    throw new Error("Error fetching profile:")
                }
                
                const dataProfile = await resProfile.json();
                setFirstName(dataProfile.datat.firstName)
                setPhotoUrl(dataProfile.datat.photoUrl)
                console.log("data", dataProfile)
                
                const resChats = await fetch(`${BASE_URL}/user/chats/${combinedId}`, { credentials: "include" })
                
                if (!resChats.ok) {
                    throw new Error("Error in fetching chats")
                }
                const dataChats = await resChats.json();
                setMessages(dataChats.results.messages)
                console.log(dataChats.results)
            } catch (error:any) {
                console.error("Error fetching profile:");
            }
        };

        fetchData(); 


       
        const socket = createSocketConnection();
        socket.emit("joinChat", { id, name: user.firstName });

        socket.on("messageRecieved", ({ newMessage, firstName }) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.disconnect();
        };
    }, [id, user?._id]);

    const handleSend = () => {
        if (!input.trim() || !currentUserId || !otherUserId) return;

        const socket = createSocketConnection();

        const newMessage: Message = {
            id: Math.random().toString(),
            senderId: currentUserId,
            receiverId: otherUserId,
            text: input,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        socket.emit("sendMessage", {
            newMessage,
            firstName: user.firstName,
            id,
        });

        // setMessages((prev) => [...prev, newMessage]);
        setInput("");
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100 rounded-t-xl">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <button
                            onClick={() => router.back()}
                            className="text-blue-600 hover:underline"
                        >
                            Back
                        </button>
                        {firstName}
                    </h2>
                    {/* <p className="text-sm text-green-500">Online</p> */}
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src={
                            photoUrl ||
                            "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        }
                        alt="User"
                        className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <MoreVertical className="text-gray-600 cursor-pointer" />
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50">
                {messages.map((msg) => {
                    const isSender = msg.senderId === currentUserId;
                    return (
                        <div
                            key={Math.random()}
                            className={`flex ${isSender ? "justify-end" : "justify-start"
                                } items-end`}
                        >
                            {/* Receiver Avatar */}
                            {!isSender && (
                                <img
                                    src={photoUrl|| "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                                    alt="Receiver"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow ${isSender
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                <p>{msg?.text}</p>
                                <p
                                    className={`text-[10px] mt-1 text-right ${isSender ? "text-blue-100" : "text-gray-500"
                                        }`}
                                >
                                    {msg?.timestamp}
                                </p>
                            </div>

                            {/* Sender Avatar */}
                            {isSender && (
                                <img
                                    src={user?.photoUrl|| "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                                    alt="Sender"
                                    className="w-8 h-8 rounded-full ml-2"
                                />
                            )}
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Input Section */}
            <div className="flex items-center p-3 border-t bg-white rounded-b-xl">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="ml-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Chat;
