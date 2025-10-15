"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BASE_URL } from "@/utils/constant";
import { motion } from "framer-motion";

interface Review {
    _id: string;
    productId: {
        _id: string;
        contactNo: string;
        originalprice: number;
        sellingPrice: number;
        productImg: string[];
        status: string;
        city: string;
        productType: string;
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
    createdAt: string;
    updatedAt: string;
}

const MyReview: React.FC = () => {
    const [filter, setFilter] = useState<"all" | "electronics" | "fashion" | "daily">("all");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [refresh,setRefresh]=useState(0)

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/user/Product/deal/Review`, {
                    credentials: "include",
                });
                const data = await res.json();
                setReviews(data.results || []);
                toast.success(`Showing ${filter} reviews`);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [refresh]);

    const handleSell = async(productId: string,dealId:string,buyerId:string) => {
        toast.loading("Processing your sale...", { id: "sell-toast" });

        try {
            const res = await fetch(`${BASE_URL}/user/Product/deal/Review`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
               
                body: JSON.stringify({ productId, dealId, buyerId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to process sale");
            }
            setRefresh(Math.random());
            toast.success("🎉 Product sold successfully!", { id: "sell-toast" });
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Something went wrong while selling", { id: "sell-toast" });
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-1/6 bg-gray-900 text-white p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-6">My Reviews</h2>
                {["all", "electronics", "fashion", "daily"].map((type) => (
                    <button
                        key={type}
                        className={`w-full py-2 rounded-md capitalize ${filter === type ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        onClick={() => setFilter(type as "all" | "electronics" | "fashion" | "daily")}
                    >
                        {type}
                    </button>
                ))}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Reviews</h1>

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
                ) : reviews.length === 0 ? (
                    <div className="text-center text-gray-500">No reviews found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => {
                            const { productId, buyerId,_id } = review;
                            return (
                                <div
                                    key={review._id}
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
                                        <div className="flex justify-between">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {productId.productType?.toUpperCase() || "PRODUCT"}
                                            </h3>
                                            <h3 className="text-sm text-gray-600">{buyerId.city}</h3>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-2">
                                            <p>
                                                <strong>Buyer:</strong>{" "}
                                                {buyerId.firstName || "Unknown"}{" "}
                                                {buyerId.lastName || ""}
                                            </p>
                                            <p>
                                                <strong>Phone:</strong> {buyerId.phone}
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

                                        {productId.status !== "sold" && (<button
                                            onClick={() => handleSell(productId._id, _id, buyerId._id)}
                                            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                                        >
                                            Sell
                                        </button>
                                        )}
                                        {productId.status == "sold" &&   ( <p
                                            className={`mt-4 text-center text-sm font-medium rounded-md py-2 ${productId.status == "sold"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                           You sold this product to someone else!!!
                                        </p>
                                         )}
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

export default MyReview;
