"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BASE_URL } from "@/utils/constant";

interface Product {
    about: string;
    originalprice: number;
    sellingPrice: number;
    purchaseDate: string;
    totalUsed: number;
    productImg: string[];
    productType: string;
}

const AddProduct: React.FC = () => {
    const router = useRouter();

    // Individual editable states
    const [about, setAbout] = useState("");
    const [sellingPrice, setSellingPrice] = useState<number>(0);
    const [originalprice, setOriginalprice] = useState<number>(0);
    const [purchaseDate, setPurchaseDate] = useState("");
    const [totalUsed, setTotalUsed] = useState<number>(0);
    const [productType, setProductType] = useState("");
    const [productImg, setProductImg] = useState<string[]>([""]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newProduct: Product = {
                about,
                sellingPrice,
                originalprice,
                purchaseDate,
                totalUsed,
                productType,
                productImg,
            };

            const res = await fetch(`${BASE_URL}/user/product`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!res.ok) throw new Error("Failed to add product");

            toast.success("Product added successfully!");
            router.push("/myProducts");
        } catch (err) {
            toast.error("Failed to add product");
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const updated = [...productImg];
        updated[index] = value;
        setProductImg(updated);
    };

    const addNewImageField = () => {
        setProductImg([...productImg, ""]);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="flex min-h-screen bg-gray-100 p-8">
            {/* Left Side: Form */}
            <div className="w-1/2 bg-white rounded-lg shadow-md p-6 mr-4">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-2xl font-bold text-gray-700 hover:text-blue-600 mr-3 transition"
                        title="Go Back"
                    >
                        &lt;
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Add Product
                    </h2>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-gray-800 font-semibold">
                            About
                        </label>
                        <textarea
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-800 font-semibold">
                                Selling Price (₹)
                            </label>
                            <input
                                type="number"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(Number(e.target.value))}
                                className="w-full border border-gray-400 p-2 rounded-md text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-800 font-semibold">
                                Original Price (₹)
                            </label>
                            <input
                                type="number"
                                value={originalprice}
                                onChange={(e) => setOriginalprice(Number(e.target.value))}
                                className="w-full border border-gray-400 p-2 rounded-md text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-800 font-semibold">
                                Purchase Date
                            </label>
                            <input
                                type="date"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                className="w-full border border-gray-400 p-2 rounded-md text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-800 font-semibold">
                                Total Used (in Days)
                            </label>
                            <input
                                type="number"
                                value={totalUsed}
                                onChange={(e) => setTotalUsed(Number(e.target.value))}
                                className="w-full border border-gray-400 p-2 rounded-md text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-800 font-semibold">
                            Product Type
                        </label>
                        <input
                            type="text"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                            className="w-full border border-gray-400 p-2 rounded-md text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-800 font-semibold">
                            Product Images (URLs)
                        </label>
                        {productImg.map((url, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`Image URL ${index + 1}`}
                                value={url}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                className="w-full border border-gray-400 p-2 rounded-md mb-2 text-gray-900"
                            />
                        ))}
                        <button
                            type="button"
                            onClick={addNewImageField}
                            className="text-blue-600 font-semibold mt-1"
                        >
                            + Add another image
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
                    >
                        Add Product
                    </button>
                </form>
            </div>

            {/* Right Side: Preview Card */}
            <div className="w-1/2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Preview</h2>

                <div className="bg-gray-50 rounded-lg overflow-hidden shadow">
                    {productImg.length > 0 && productImg[0] && (
                        <Slider {...sliderSettings}>
                            {productImg.map((imgUrl, index) => (
                                <div key={index}>
                                    <img
                                        src={imgUrl || "paste img"}
                                        alt="Product"
                                        className="object-cover w-full h-64"
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}

                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {productType.toUpperCase() || "PRODUCT TYPE"}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">{about}</p>

                        <div className="flex justify-between text-sm font-semibold">
                            <span className="text-green-600">₹{sellingPrice}</span>
                            <span className="line-through text-gray-500">
                                ₹{originalprice}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-700 mt-3">
                            <span>
                                Purchased: {purchaseDate ? new Date(purchaseDate).toLocaleDateString() : "N/A"}
                            </span>
                            <span>Used: {totalUsed} months</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
