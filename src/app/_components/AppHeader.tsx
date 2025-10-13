"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/constant";

const AppHeader: React.FC = () => {

    const pathname = usePathname();
    const router = useRouter();

    console.log(pathname)

    const handlelogout = async () => {
        try {
            const res = await fetch(`${BASE_URL}/logout`, {
                method: "POST", credentials: "include"
                
             })
            
            if (res.status == 201) {
                router.push("/auth")
            }
        }
        catch (err:any) {
            console.log(err.message)
        }
    }

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo / Brand */}
                    <div className="text-2xl font-bold">
                        <Link href="/">Trade Hub</Link>
                    </div>

                 
                    {pathname !== "/auth" && (<nav className="space-x-6">
                        <Link
                            href="/profile"
                            className={`transition-colors ${pathname === "/profile"
                                    ? "text-blue-500 font-semibold underline underline-offset-4"
                                    : "hover:text-blue-400"
                                }`}
                        >
                            Profile
                        </Link>
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
                    </nav>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
