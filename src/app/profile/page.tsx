"use client";
import { BASE_URL } from "@/utils/constant";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const UserProfile: React.FC = () => {
    // Individual states for each field
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [photoUrl, setPhotoUrl] = useState(
        ""
    );
    const [city, setCity] = useState("");
    const [refresh,setRefresh]=useState<number>(0)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BASE_URL}/profile`, { credentials: "include" })
                
                if (!res.ok) {
                    throw new Error("Failed to fetch profile")
                }

                const data = await res.json();
                const profile = data.data;
                setFirstName(profile.firstName)
                setLastName(profile.lastName)
                setPhone(profile.phone)
                setPhotoUrl(profile.photoUrl)
                setCity(profile.city)
            }
            catch (err:any) {
                console.log(err.message)
               
            }
        }
        fetchProfile();
    }, [refresh])

    const handleUpdate = async(e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated User Data:", {
            firstName,
            lastName,
            phone,
            photoUrl,
            city,
        });

        try {
            const res = await fetch(`${BASE_URL}/profile/edit`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // for cookies
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone,
                    photoUrl,
                    city,
                }),
                
            })
            if (!res.ok) {
                throw new Error("failed to update proifile")
            }
            setRefresh(Math.random());
            toast.success("Profile updated successfully!");
        }
        catch (err:any) {
            console.log(err.message)
            toast.error("Failed to update profile. Please try again.");
        }
        // you can make an API call here to update user data
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Left Side — Form */}
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Edit Profile
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block mb-1 text-gray-300"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lastName"
                                className="block mb-1 text-gray-300"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName ||""}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block mb-1 text-gray-300">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone ||""}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="photoUrl" className="block mb-1 text-gray-300">
                                Photo URL
                            </label>
                            <input
                                type="text"
                                id="photoUrl"
                                value={photoUrl||""}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="block mb-1 text-gray-300">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={city ||""}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                        >
                            Update Profile
                        </button>
                    </form>
                </div>

                {/* Right Side — Profile Preview */}
                <div className="bg-gray-700 p-8 flex flex-col justify-center items-center text-center">
                    <img
                        src={photoUrl || "https://via.placeholder.com/150"}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                    />
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {firstName} {lastName}
                    </h3>
                    <p className="text-gray-300 mb-1">📞 {phone}</p>
                    <p className="text-gray-300 mb-1">🏙️ {city}</p>
                    {/* <p className="text-gray-400 mt-2 text-sm italic">
                        {photoUrl ? "Profile photo loaded" : "No photo URL provided"}
                    </p> */}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
