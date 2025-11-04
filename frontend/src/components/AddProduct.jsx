import React, { useEffect, useState } from "react";
import { getCategories, getPackagesByType, joinProduct } from "../services/apiService";
import { Gift, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthContext } from '../context/AuthContext';

const AddProduct = ({ open, onClose, walletBalance = 0 }) => {
    const [categories, setCategories] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    // const [productData, setProductData] = useState({
    //     product_name: "",
    //     amount: "",
    //     plan_type: ""
    // });
    const [form, setForm] = useState({
        category: "",
        package: "",
        scheme: "",
        pay_from: "0"
    });
    const [errors, setErrors] = useState({});

    // Fetch categories on open
    useEffect(() => {
        if (!open) return;
        setForm({ category: "", package: "", scheme: "", pay_from: "" });
        setPackages([]);
        setErrors({});
        setLoading(true);
        getCategories().then(setCategories).finally(() => setLoading(false));
    }, [open]);

    // Fetch packages on category change
    useEffect(() => {
        if (!form.category) {
            setPackages([]);
            setForm((f) => ({ ...f, package: "" }));
            return;
        }
        setLoading(true);
        getPackagesByType(form.category)
            .then(setPackages)
            .finally(() => setLoading(false));
    }, [form.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
        if (name === "category") setForm((f) => ({ ...f, package: "" }));
    };

    const validate = () => {
        let errs = {};
        if (!form.category) errs.category = "Please select a category.";
        if (!form.package) errs.package = "Please select a package.";
        if (!form.scheme) errs.scheme = "Please select a scheme.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("form.category  : ----", form.category, "form.packages : ----", form.package, "form.schema  : ----", form.scheme, "pay_from", form.pay_from);
        if (!validate()) {
            toast.error("Please fill all fields.");
            return;
        }

        // Find selected package details
        const selectedPackage = packages.find(p => p.id === parseInt(form.package));
        if (!selectedPackage) {
            toast.error("Invalid package selected");
            return;
        }

        // Construct API payload
        const productData = {
            user_id: user?.user_id,
            amount: selectedPackage.product_price,
            product_name: selectedPackage.product_name,
            plan_type: form.scheme.toLowerCase().replace(' ', '_'), // Convert "18 Month" to "18_month"
            pay_from: parseInt(form.pay_from) || 0
        };

        console.log("Submitting product data:", productData);

        
        console.log("productData", productData);
        setLoading(true);

        try {
            const res = await joinProduct(productData);
            if (res.status) {
                toast.success(res.message || "Joined successfully!");
                onClose();
            } else {
                toast.error(res.message || "Something went wrong.");
            }
        } catch {
            toast.error("API Error; Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed top-0 right-0 left-0 w-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4 py-0 overflow-auto h-screen">
            <div className="bg-gradient-to-br from-[#1a2035] to-[#0f1324] relative w-full md:w-lg mx-auto p-6 rounded-2xl shadow-2xl border border-[#2a3245] animate-fade-in-up overflow-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#2a3245] transition-colors duration-200 group"
                    disabled={loading}
                >
                    <X className="w-6 h-6 text-[#8a94b3] group-hover:text-white" />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#2a3245] flex items-center justify-center mb-3">
                        <Gift className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Join a Package</h2>
                    {/* <p className="text-[#8a94b3] text-sm mt-1">Select your preferred investment plan</p> */}
                </div>

                {/* Wallet Balance */}
                <div className="flex items-center justify-between p-4 mb-6 bg-[#1e2436] rounded-xl border border-[#2a3245]">
                    <span className="text-[#8a94b3]">Available Balance:</span>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl text-green-400">₹{walletBalance.toLocaleString()}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Category Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#c1c9e0]">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                className={`w-full px-4 py-3 pr-10 rounded-lg bg-[#1e2436] text-white border ${errors.category ? "border-red-500" : "border-[#2a3245] hover:border-[#3a4565]"
                                    } focus:ring-2 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all appearance-none`}
                                value={form.category}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Select Category</option>
                                {categories.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-[#8a94b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Package Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#c1c9e0]">
                            Package <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="package"
                                className={`w-full px-4 py-3 pr-10 rounded-lg bg-[#1e2436] text-white border ${errors.package ? "border-red-500" : "border-[#2a3245] hover:border-[#3a4565]"
                                    } focus:ring-2 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all appearance-none`}
                                value={form.package}
                                onChange={handleChange}
                                disabled={!form.category || loading}
                            >
                                <option value="">{form.category ? "Select Package" : "Select a category first"}</option>
                                {packages.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.product_name} (₹{p.product_price.toLocaleString()})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-[#8a94b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.package && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.package}
                            </p>
                        )}
                    </div>

                    {/* Scheme Select */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-[#c1c9e0]">
                            Scheme <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="scheme"
                                className={`w-full px-4 py-3 pr-10 rounded-lg bg-[#1e2436] text-white border ${errors.scheme ? "border-red-500" : "border-[#2a3245] hover:border-[#3a4565]"
                                    } focus:ring-2 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all appearance-none`}
                                value={form.scheme}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Select Scheme</option>
                                <option value="Lifetime">Lifetime</option>
                                <option value="18 Month">18 Month</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-[#8a94b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.scheme && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.scheme}
                            </p>
                        )}
                    </div>

                    <input type="hidden" name="pay_from" value="0" />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Join Now"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;