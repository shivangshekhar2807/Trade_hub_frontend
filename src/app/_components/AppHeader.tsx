"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/constant";
import { Wallet, X, IndianRupee } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/utils/redux/userSlice";

declare global {
    interface Window {
        Razorpay: any;
    }
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

                const data = await res.json();
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
    }, [pathname, refresh])

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
                       
                        <div className="flex items-center gap-3">
                         
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
                            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
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
