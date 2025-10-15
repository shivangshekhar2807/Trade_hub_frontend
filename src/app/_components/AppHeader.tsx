"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/constant";
import { Wallet, X, IndianRupee, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/utils/redux/userSlice";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface WeekEndOffer{

    weekEndOffer: boolean,
    weekEndOfferText:string

}

const AppHeader: React.FC = () => {

    const pathname = usePathname();
    const router = useRouter();
    const [wallet, setWallet] = useState(0);
    const [showWalletPopup, setShowWalletPopup] = useState(false); 
    const [rechargeAmount, setRechargeAmount] = useState("");
    const [userImage, setUserImage] = useState("");
    const [userName, setUserName] = useState("");
    const [refresh, setRefresh] = useState(0);

    const [showNotification, setShowNotification] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [totalNotification, setTotalNotification] = useState(0);
    const [weekEndOffer, setWeenEndOffer] = useState<WeekEndOffer>({
        weekEndOffer: false,
        weekEndOfferText: ""
    });
    const [showWeekEndOffer,setShowWeekEndOffer]=useState(false)
    const notifRef = useRef<HTMLDivElement>(null);


    const refreshIcon=useSelector((state:any)=>state.refresh)

    const dispatch = useDispatch();

    console.log(pathname)

    useEffect(() => {
        if (pathname == "/auth") {
            return;
        }
        const fetchballance = async () => {
            try {
                const res = await fetch(`${BASE_URL}/profile`, { credentials: 'include' })
                
                if (!res.ok) {
                    throw new Error("Could not fetch profile")
                }

                const noti = await fetch(`${BASE_URL}/user/notification`, { credentials: 'include' })

                if (!noti.ok) {
                    throw new Error("Could not fetch notification")
                }

                const data = await res.json();
                const notiData = await noti.json();
                if (notiData.count > 0) {
                    setHasNewNotification(true)
                    setTotalNotification(notiData.count)
                }
                setWeenEndOffer(data.data)
                setWallet(data.data.walletbalance)
                setUserImage(data.data.photoUrl)
                setUserName(data.data.firstName)
                dispatch(setUser(data.data));
                console.log(data)
            }
            catch (err:any) {
                console.log(err.message)
            }
        }

        fetchballance();
    }, [pathname, refresh, refreshIcon])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotification(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // ✅ Load Razorpay script once
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlelogout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/logout`, {
                method: "POST", credentials: "include"
                
             })
            
            if (res.status == 201) {
                dispatch(clearUser());
                router.push("/auth")
            }
        }
        catch (err:any) {
            console.log(err.message)
        }
    }



    const handleRecharge = async() => {
        if (!rechargeAmount || Number(rechargeAmount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/payment/create/orderId`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                   amount: rechargeAmount
                })
            })

            if (!res.ok) {
                throw new Error("order id not created")
            }

            const data = await res.json();
            console.log(data)

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded. Please refresh and try again.");
                return;
            }

            const { amount, id, currency, notes } = data.data;
            const {keyId}=data

            const options = {
                key: keyId,
                amount: amount,
                currency: currency,
                name: notes.firstName,

                order_id: id,

                prefill: {
                    name: notes.firstName 
                  
                },
                theme: {
                    color: "#F37254",
                },
                handler: function (response: any) {
                   
                    setShowWalletPopup(false);
                    setRechargeAmount("");
                    setRefresh(Math.random());
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        }
        catch (err:any) {
            console.log(err.message)
        }

       
    };

    return (
        <>
        <header className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo / Brand */}
                    <div className="text-2xl font-bold">
                        <Link href="/">Trade Hub</Link>
                    </div>

                 
                    {pathname !== "/auth" && (<nav className="space-x-6 flex items-center">
                       
                            <div className="flex items-center gap-3 relative" ref={notifRef}>
                          
                                
                               
                                {/* <div
                                    onClick={() => setShowNotification(!showNotification)}
                                    className="relative cursor-pointer p-2 rounded-full hover:bg-gray-700 transition"
                                >
                                    
                                    <Bell className="w-6 h-6 text-white" />
                                    {hasNewNotification && (
                                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                    )}

                                   


                                </div> */}

                                {/* 🏷️ Weekend Offer Section */}
                              

                                <div className="flex items-center gap-2 relative">
                                   
                                    {/* {weekEndOffer.weekEndOffer && (<span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md border border-white">
                                        WEEKEND OFFER
                                    </span>
                                    )} */}


                                    <div className="relative">
                                        {weekEndOffer.weekEndOffer && (
                                            <>
                                              

                                                <span
                                                    onClick={() => setShowWeekEndOffer(true)}
                                                    className="text-[11px] font-bold text-yellow-300 px-3 py-1 rounded-full border border-yellow-400 shadow-[0_0_10px_rgba(255,255,0,0.6)] cursor-pointer transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,255,0,0.9)] hover:text-yellow-200 animate-pulse"
                                                >
                                                    ⚡ OFFER ⚡
                                                </span>

                                                {/* 📦 Weekend Offer Popup */}
                                                {showWeekEndOffer && (
                                                    // <div className="absolute top-7 left-0 bg-white shadow-lg rounded-lg p-4 w-56 text-gray-800 animate-fade-in z-50">
                                                    //     <button
                                                    //         onClick={() => setShowWeekEndOffer(false)}
                                                    //         className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                                    //     >
                                                    //         <X className="w-5 h-5" />
                                                    //     </button>
                                                    //     <p className="text-sm mb-3 text-center font-medium">
                                                    //         {weekEndOffer.weekEndOfferText ||
                                                    //             "Exclusive weekend deals available now! 🎉"}
                                                    //     </p>
                                                       
                                                    // </div>

                                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border border-yellow-400 shadow-[0_0_25px_rgba(255,255,0,0.4)] rounded-xl p-5 w-64 text-yellow-300 animate-fade-in z-50 transform transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,255,0,0.7)]">
                                                        {/* ❌ Close Button */}
                                                        <button
                                                            onClick={() => setShowWeekEndOffer(false)}
                                                            className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-100 transition-transform hover:scale-110"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>

                                                        {/* 💬 Message */}
                                                        <div className="flex flex-col items-center text-center space-y-3">
                                                            <p className="text-sm font-semibold tracking-wide leading-relaxed">
                                                                {weekEndOffer.weekEndOfferText || "⚡ Exclusive Weekend Deals Await! 🎉"}
                                                            </p>

                                                            {/* 🌟 Divider Glow Line */}
                                                            <div className="w-10 h-[2px] bg-yellow-400 shadow-[0_0_10px_rgba(255,255,0,0.6)] mx-auto"></div>

                                                            {/* 🎁 CTA Button (optional) */}
                                                            <button
                                                                onClick={() => setShowWalletPopup(true)}
                                                                className="mt-2 px-4 py-1.5 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-[0_0_10px_rgba(255,255,0,0.6)] hover:shadow-[0_0_15px_rgba(255,255,0,0.9)] hover:scale-105 transition-transform duration-200"
                                                            >
                                                                Grab Offer
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>


                                   
                                    <div
                                        onClick={() => setShowNotification(!showNotification)}
                                        className="relative cursor-pointer p-2 rounded-full hover:bg-gray-700 transition"
                                    >
                                        <Bell className="w-6 h-6 text-white" />
                                        {hasNewNotification && (
                                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                        )}
                                    </div>
                                </div>


                               

                                {/* 📩 Notification Popup */}
                                {showNotification && (
                                    <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg p-4 w-56 text-gray-800 animate-fade-in z-50">
                                        {hasNewNotification && (<p className="text-sm mb-3 text-center font-medium">
                                            You have {totalNotification} buyers to buy your product. Kindly Check!!
                                        </p>
                                        )}
                                        {!hasNewNotification && (<p className="text-sm mb-3 text-center font-medium">
                                            You dont have any notification!!
                                        </p>
                                        )}
                                        {hasNewNotification && (<button
                                            onClick={() => {
                                               
                                                setShowNotification(false);
                                                router.push('/notifications')
                                            }}
                                            className="w-full py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                                        >
                                            View
                                        </button>
                                        )}
                                    </div>
                                )}
                         
                            <div
                                onClick={() => setShowWalletPopup(true)}
                                className="flex items-center bg-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-600 transition"
                            >
                                <Wallet className="w-5 h-5 text-yellow-400 mr-2" />
                                <span className="text-sm font-semibold text-white">
                                    ₹{wallet}
                                </span>
                            </div>

                            <Link
                                href="/profile"
                                className={`transition-colors ${pathname === "/profile"
                                        ? "text-blue-500 font-semibold underline underline-offset-4"
                                        : "hover:text-blue-400"
                                    }`}
                            >
                                Profile
                            </Link>

                          
                           
                        </div>
                      
                       
                        <Link
                            href="/myProducts"
                            className={`transition-colors ${pathname === "/myProducts"
                                    ? "text-blue-500 font-semibold underline underline-offset-4"
                                    : "hover:text-blue-400"
                                }`}
                        >
                            My Products
                        </Link>
                        <Link
                            href="/buyProducts"
                            className={`transition-colors ${pathname === "/buyProducts"
                                    ? "text-blue-500 font-semibold underline underline-offset-4"
                                    : "hover:text-blue-400"
                                }`}
                        >
                            Buy Cart
                        </Link>
                        <Link
                            href="/sellProducts"
                            className={`transition-colors ${pathname === "/sellProducts"
                                    ? "text-blue-500 font-semibold underline underline-offset-4"
                                    : "hover:text-blue-400"
                                }`}
                        >
                            Sell Cart
                        </Link>
                        <button
                            onClick={handlelogout}
                            className="hover:text-blue-400 transition-colors cursor-default"
                        >
                            Logout
                            </button>
                            
                            {/* ✅ New user profile section */}
                            <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-600 transition">
                                <img
                                    src={userImage || "/images/default-avatar.png"} // fallback image
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full border border-gray-500"
                                />
                                <span className="text-sm font-medium text-white">{userName || "User"}</span>
                            </div>
                    </nav>
                    )}
                </div>
            </div>
        </header>

            {/* WALLET POPUP */}
            {showWalletPopup && (
                <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 relative animate-fade-in">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowWalletPopup(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                            💰 Wallet
                        </h2>

                        {/* Balance */}
                        <div className="text-center mb-6">
                            <p className="text-gray-600 text-sm">Current Balance</p>
                            <p className="text-4xl font-bold text-green-600 mt-1">
                                ₹{wallet}
                            </p>
                        </div>

                        {/* Recharge Input */}
                        <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">
                                Enter Recharge Amount
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <IndianRupee className="text-gray-500 w-5 h-5 mr-1" />
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={rechargeAmount}
                                    onChange={(e) => setRechargeAmount(e.target.value)}
                                    className="w-full outline-none text-gray-700 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleRecharge}
                            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all "
                        >
                            Recharge Now
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AppHeader;
