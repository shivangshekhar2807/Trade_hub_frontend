"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BASE_URL } from "@/utils/constant";
import { motion } from "framer-motion";

interface Deal {
    _id: string;
    productId: {
        _id: string;
        contactNo: string;
        originalprice: number;
        sellingPrice: number;
        productImg: string[];
        status: string;
        city: string;
    };
    buyerId: {
        _id: string;
        firstName: string | null;
        lastName: string | null;
        phone: string;
        city: string;
    };
    sellerId: {
        _id: string;
        firstName: string | null;
        lastName: string | null;
        phone: string;
        city: string;
    };
    dealStatus: "pending" | "done";
    createdAt: string;
    updatedAt: string;
}

const MyDeals: React.FC = () => {
    const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(false);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        const fetchDeals = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/user/products/deals/?status=${filter}`, {
                    credentials: "include",
                });
                const data = await res.json();
                setDeals(data.results || []);
                toast.success(`Showing ${filter} deals`);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch deals");
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, [filter]);

    const getStatusText = (deal: Deal) => {
        const productStatus = deal.productId.status;
        const dealStatus = deal.dealStatus;

        if (dealStatus === "pending" && productStatus === "sold")
            return "Product has been sold to someone else ";
        if (dealStatus === "done" && productStatus === "sold")
            return "✅ This product is yours";
        if (dealStatus === "pending")
            return "⏳ Pending confirmation";

        return "";
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-1/6 bg-gray-900 text-white p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-6">My Deals</h2>
                {["all", "pending", "done"].map((type) => (
                    <button
                        key={type}
                        className={`w-full py-2 rounded-md capitalize ${filter === type ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        onClick={() => setFilter(type as "all" | "pending" | "done")}
                    >
                        {type}
                    </button>
                ))}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Deals</h1>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                    <div className="h-10 bg-blue-200 rounded-md mt-3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : deals.length === 0 ? (
                    <div className="text-center text-gray-500">No deals found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal) => {
                            const { productId, sellerId } = deal;
                            return (
                                <div
                                    key={deal._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative w-full h-64">
                                        <Slider {...sliderSettings}>
                                            {productId.productImg.map((imgUrl, index) => (
                                                <div key={index}>
                                                    <img
                                                        src={imgUrl}
                                                        alt="Product"
                                                        className="object-cover w-full h-64"
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {productId.city.toUpperCase()}
                                        </h3>

                                        <div className="text-sm text-gray-600 mb-2">
                                            <p>
                                                <strong>Seller:</strong>{" "}
                                                {sellerId.firstName || "Unknown"}{" "}
                                                {sellerId.lastName || ""}
                                            </p>
                                            <p>
                                                <strong>Phone:</strong> {sellerId.phone}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center text-sm font-semibold">
                                            <span className="text-blue-500">
                                                ₹{productId.sellingPrice}
                                            </span>
                                            <span className="line-through text-gray-500">
                                                ₹{productId.originalprice}
                                            </span>
                                        </div>

                                        <p
                                            className={`mt-4 text-center text-sm font-medium rounded-md py-2 ${deal.dealStatus === "done"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {getStatusText(deal)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyDeals;
