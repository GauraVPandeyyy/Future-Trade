import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, CreditCard } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { joinProduct } from '../services/apiService';

const ReInvest = () => {
    const location = useLocation();
    const { user } = useAuthContext();
    const { amount = 0, totalBal = 0, reInvestType = '' } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [reInvestAmount, setReInvestAmount] = useState(amount);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [planType, setPlanType] = useState("Lifetime"); // Set default value

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks
        if (!user?.user_id) {
            toast.error("User not authenticated");
            return;
        }
        
        if (reInvestAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        
        // if (reInvestAmount > amount) {
        //     toast.error(`Amount cannot exceed ₹${amount.toLocaleString('en-IN')}`);
        //     return;
        // }
        
        if (!planType) {
            toast.error("Please select a plan type");
            return;
        }

        const productData = {
            user_id: user.user_id,
            amount: parseFloat(reInvestAmount), // Ensure it's a number
            product_name: "ReInvest",
            plan_type: planType.toLowerCase().replace(' ', '_'),
            pay_from: reInvestType == 'roi' ? 1 : 2
        };

        setIsSubmitting(true);
        setLoading(true);

        try {
            const res = await joinProduct(productData);
            if (res.status) {
                toast.success(res.message || "ReInvest request submitted successfully!");
                // Redirect to a different page instead of calling onClose which doesn't exist
                navigate('/inv-fund');
            } else {
                toast.error(res.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error(error.response?.data?.message || "API Error; Please try again.");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="p-6 bg-gradient-to-t from-gray-700 to-gray-800 text-white">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back
                    </button>
                    <div className="flex items-center w-full text-center justify-center">
                        <div className="p-2 bg-white/10 rounded-full mr-3">
                            {reInvestType === 'roi' ? <CreditCard size={24} /> : <Wallet size={24} />}
                        </div>
                        <h1 className="text-2xl font-bold">
                            {reInvestType === 'roi' ? 'ROI ReInvest' : 'Capital ReInvest'}
                        </h1>
                    </div>
                </div>

                {/* Balance Display */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Available Balance:</span>
                        <span className="text-2xl font-bold text-green-400">
                            ₹{totalBal.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* ReInvest Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {reInvestType === 'roi' ? 'ROI Amount' : 'Capital Amount'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={reInvestAmount}
                                        onChange={(e) => setReInvestAmount(e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Enter amount"
                                        min="0"
                                        max={amount}
                                        required
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <span className="text-gray-400">₹</span>
                                    </div>
                                </div>
                                <p className="text-xs text-red-500 mt-2">
                                    Maximum ReInvest: ₹{amount.toLocaleString('en-IN')}
                                </p>
                            </div>

                            {/* Plan Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Plan Type
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-green-400/30 focus:border-green-400 outline-none transition-all appearance-none"
                                        value={planType}
                                        onChange={(e) => setPlanType(e.target.value)}
                                        disabled={loading}
                                        required
                                    >
                                        <option value="Lifetime">Lifetime</option>
                                        <option value="18 Month">18 Month</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className={`w-full text-lg py-3 bg-gradient-to-r mx-auto from-green-600 to-green-400 text-white rounded-lg font-bold shadow-lg transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center ${isSubmitting ? 'animate-pulse' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Re-Invest'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReInvest;