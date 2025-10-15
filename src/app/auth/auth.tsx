"use client";
import { BASE_URL } from "@/utils/constant";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);


    // Login form state
    const [loginEmail, setLoginEmail] = useState("shivang@gmail.com");
    const [loginPassword, setLoginPassword] = useState("Ss@621311");

    // Signup form state
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupFirstName, setSignupFirstName] = useState("");
    const [signupPhone, setSignupPhone] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleLoginSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!loginEmail || !loginPassword) {
                throw new Error("Please enter all credentials")
            }
            
            const res = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // for cookies
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            })

            if (res.status != 200) {
                throw new Error("Invalid credentials")
            }

         

            const data = await res.json();
          

          router.push('/')

        }
        catch (err: any) {
            console.log(err.message)
            setError(err.message)
        }
       
    };

    const handleSignupSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const signupData = {
            email: signupEmail,
            password: signupPassword,
            firstName: signupFirstName,
            phone: signupPhone,
        };

        console.log("Signup Data:", signupData);

        try {
            const res = await fetch(`${BASE_URL}/signUp`, {
                method: "POST",
                credentials:"include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            if (!res.ok) throw new Error("Signup failed");

            const data = await res.json();
           
            router.push('/')
           
        } catch (err:any) {
            console.error("Signup Failed:", err);
            setError(err.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md text-gray-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                <div className="flex justify-center mb-6 gap-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 font-semibold rounded-md transition ${isLogin
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 font-semibold rounded-md transition ${!isLogin
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="loginEmail" className="block mb-1 text-gray-300">Email</label>
                            <input
                                type="email"
                                id="loginEmail"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="loginPassword" className="block mb-1 text-gray-300">Password</label>
                            <input
                                type="password"
                                id="loginPassword"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {error !== "" && (<p className="m-2 p-2 bg-amber-800">{error}</p>)}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="signupFirstName" className="block mb-1 text-gray-300">First Name</label>
                            <input
                                type="text"
                                id="signupFirstName"
                                value={signupFirstName}
                                onChange={(e) => setSignupFirstName(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="signupEmail" className="block mb-1 text-gray-300">Email</label>
                            <input
                                type="email"
                                id="signupEmail"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="signupPassword" className="block mb-1 text-gray-300">Password</label>
                            <input
                                type="password"
                                id="signupPassword"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="signupPhone" className="block mb-1 text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                id="signupPhone"
                                value={signupPhone}
                                onChange={(e) => setSignupPhone(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            </div>
                            {error !== "" && (<p className="m-2 p-2 bg-amber-800">{error}</p>)}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            Sign Up
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
