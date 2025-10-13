"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BASE_URL } from "@/utils/constant";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Product {
    _id: string;
    userId: string;
    contactNo: string;
    about: string;
    originalprice: number;
    sellingPrice: number;
    purchaseDate: string;
    totalUsed: number;
    productImg: string[];
    productType: string;
    status: string;
    city: string;
}

const MyProducts: React.FC = () => {
    const [filter, setFilter] = useState<"sold" | "unsold" | "all">("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Example: Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Replace with your API URL
                const res = await fetch(`${BASE_URL}/user/products/?status=${filter}`,{credentials:"include"});
                const data = await res.json();
                setProducts(data.results);
                // console.log(data)
                toast.success(`Showing ${filter} products`);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filter]);

    const handleEdit = (id: string) => {
        // toast(`Edit clicked for product ${id}`);
       router.push(`/myProducts/${id}`)
    };

    // Carousel settings
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-1/6 bg-gray-900 text-white p-6 space-y-4">
                <h2 className="text-2xl font-semibold mb-6">Filters</h2>
                <button
                    className={`w-full py-2 rounded-md ${filter === "all" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>
                <button
                    className={`w-full py-2 rounded-md ${filter === "sold" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => setFilter("sold")}
                >
                    Sold
                </button>
                <button
                    className={`w-full py-2 rounded-md ${filter === "unsold" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => setFilter("unsold")}
                >
                    Unsold
                </button>
                <button
                    className={`w-full py-2 rounded-md bg-gray-700 hover:bg-gray-600"
                        }`}
                    onClick={() => router.push('/addProduct')}
                >
                    +Add Product
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-100">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">My Products</h1>

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
                                                   <div className="flex justify-between items-center mt-4">
                                                       <div className="h-4 bg-gray-300 rounded w-1/4" />
                                                       <div className="h-4 bg-gray-300 rounded w-1/4" />
                                                   </div>
                                                   <div className="h-10 bg-blue-200 rounded-md mt-3" />
                                               </div>
                                           </motion.div>
                                       ))}
                                   </div>
                               ) : products.length === 0 ? ( 
                    <div className="text-center text-gray-500">No products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative w-full h-64">
                                    <Slider {...sliderSettings}>
                                        {product.productImg.map((imgUrl, index) => (
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
                                        {product.productType.toUpperCase()}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {product.about.length > 80
                                            ? product.about.slice(0, 80) + "..."
                                            : product.about}
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
                                        <span>City: {product.city}</span>
                                        <span>Status: {product.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span>₹{product.sellingPrice}</span>
                                        <span className="line-through text-gray-500">
                                            ₹{product.originalprice}
                                        </span>
                                    </div>

                                    {product.status == "unsold" && (<button
                                        onClick={() => handleEdit(product._id)}
                                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyProducts;
