// "use client";
// import React, { useState } from "react";

// interface Notification {
//     id: string;
//     text: string;
// }

// const ViewNotification: React.FC = () => {
//     // Static sample notifications (you’ll replace with your API data)
//     const notifications: Notification[] = [
//         { id: "1", text: "Your product deal has been approved." },
//         { id: "2", text: "You have a new buyer request." },
//         { id: "3", text: "Your wallet was recharged successfully." },
//         { id: "4", text: "System maintenance scheduled for tonight." },
//     ];

//     // State to store selected notification IDs
//     const [selectedIds, setSelectedIds] = useState<string[]>([]);

//     const handleCheckboxChange = (id: string) => {
//         setSelectedIds((prev) =>
//             prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
//             <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//                     Notifications
//                 </h2>

//                 {notifications.length === 0 ? (
//                     <p className="text-gray-500 text-center">No notifications found.</p>
//                 ) : (
//                     <ul className="space-y-4">
//                         {notifications.map((notif) => (
//                             <li
//                                 key={notif.id}
//                                 className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//                             >
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedIds.includes(notif.id)}
//                                     onChange={() => handleCheckboxChange(notif.id)}
//                                     className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
//                                 />
//                                 <span className="text-gray-700">{notif.text}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 )}

               
//                 {selectedIds.length > 0 && (
//                     <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
//                         Selected IDs: {selectedIds.join(", ")}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ViewNotification;







// "use client";
// import { BASE_URL } from "@/utils/constant";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

//  interface NewNotification {
//     _id: string;

//     product: {
//         _id: string;
//         contactNo: string;
//         originalprice: number;
//         sellingPrice: number;
//         productImg: string[];
//         city: string;
//         status: string;
//     };

//     buyer: {
//         _id: string;
//         firstName: string;
//         lastName: string;
//         phone: string;
//         city: string;
//     };

//     seller: {
//         _id: string;
//         firstName: string;
//         lastName: string;
//         phone: string;
//         city: string;
//     };

//     readNotification: boolean;
//     notification: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
// }



// const ViewNotification: React.FC = () => {
//     // Sample static notifications (replace with API later)
//     // const notifications: Notification[] = [
//     //     { id: "1", text: "Your product deal has been approved." },
//     //     { id: "2", text: "You have a new buyer request." },
//     //     { id: "3", text: "Your wallet was recharged successfully." },
//     //     { id: "4", text: "System maintenance scheduled for tonight." },
//     //     { id: "5", text: "A new message was received from the admin team." },
//     //     { id: "6", text: "Your listing 'Apple Watch' has been sold." },
//     // ];

//     const [newNotification, setNewNotification] = useState < NewNotification>([]);

//     const [selectedIds, setSelectedIds] = useState<string[]>([]);

//     const user=useSelector((state:any)=>state.user)

//     useEffect(() => {
//         const fetchNotification = async () => {
//             try {
//                 const noti = await fetch(`${BASE_URL}/user/notification`, { credentials: 'include' })
                
//                                 if (!noti.ok) {
//                                     throw new Error("Could not fetch notification")
//                                 }
                
                               
//                 const notiData = await noti.json();
//                 setNewNotification(notiData.results)
//             }
//             catch (err: any) {
//                 console.log(err.message)
//             }
//         }
//     },[])

//     const handleCheckboxChange = (id: string) => {
//         setSelectedIds((prev) =>
//             prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//         );
//     };

//     return (
//         <div className="min-h-screen w-full bg-gray-100 flex flex-col">
//             {/* Header */}
         

//             {/* Notifications List */}
//             <main className="flex-1 overflow-y-auto p-6">
//                 {newNotification?.length === 0 ? (
//                     <p className="text-gray-500 text-center mt-20">
//                         No notifications found.
//                     </p>
//                 ) : (
//                     <div className="space-y-4 max-w-3xl mx-auto">
//                             {newNotification.map((notif) => (
//                             <div
//                                 key={notif.id}
//                                 className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
//                             >
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedIds.includes(notif.id)}
//                                     onChange={() => handleCheckboxChange(notif.id)}
//                                     className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
//                                 />
//                                 <p className="text-gray-800">{notif.text}</p>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </main>

           
//         </div>
//     );
// };

// export default ViewNotification;






"use client";

import { BASE_URL } from "@/utils/constant";
import { setRefresh } from "@/utils/redux/refreshSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// 🧩 Interface (matches your API structure)
interface NewNotification {
    _id: string;
    product: {
        _id: string;
        contactNo: string;
        originalprice: number;
        sellingPrice: number;
        productImg: string[];
        city: string;
        status: string;
    };
    buyer: {
        _id: string;
        firstName: string;
        lastName: string;
        phone: string;
        city: string;
    };
    seller: {
        _id: string;
        firstName: string;
        lastName: string;
        phone: string;
        city: string;
    };
    readNotification: boolean;
    notification: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const ViewNotification: React.FC = () => {
    const [newNotification, setNewNotification] = useState<NewNotification[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const noti = await fetch(`${BASE_URL}/user/notification`, {
                    credentials: "include",
                });

                if (!noti.ok) {
                    throw new Error("Could not fetch notifications");
                }

                const notiData = await noti.json();
                setNewNotification(notiData.results);
            } catch (err: any) {
                console.log(err.message);
            }
        };

        fetchNotification();
    }, []);

    const handleCheckboxChange = async(id: string) => {
        // setSelectedIds((prev) =>
        //     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        // );
        // const notification = newNotification.filter((item) => item._id != id);
       
        // setNewNotification(notification);

        try {
            // Update checkbox selection in UI
            setSelectedIds((prev) =>
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );

            // 🔥 Make PATCH request
            const response = await fetch(`${BASE_URL}/user/notification/${id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
               
            });

            if (!response.ok) {
                throw new Error("Failed to update notification");
            }

            // Remove notification from list instantly
            setNewNotification((prev) => prev.filter((item) => item._id !== id));
            dispatch(setRefresh());

        } catch (err: any) {
            console.error("Error updating notification:", err.message);
        }

    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col">
            {/* Header */}
            <header className=" text-gray-900 py-4 px-6 shadow-md">
                <h1 className="text-2xl font-semibold text-center">
                    🔔 Notifications
                </h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {newNotification.length === 0 ? (
                    <p className="text-gray-500 text-center mt-20">
                        No notifications found.
                    </p>
                ) : (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        {newNotification.map((notif) => (
                            <div
                                key={notif._id}
                                className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(notif._id)}
                                    onChange={() => handleCheckboxChange(notif._id)}
                                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <div>
                                    <p className="text-gray-800 font-medium">{notif.notification}</p>

                                    <div className="mt-2 text-sm text-gray-500 flex flex-wrap items-center gap-2">
                                        <span>
                                            🕒{" "}
                                            {new Date(notif.createdAt).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </span>
                                        {!notif.readNotification && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                Unread
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

           
        </div>
    );
};

export default ViewNotification;

