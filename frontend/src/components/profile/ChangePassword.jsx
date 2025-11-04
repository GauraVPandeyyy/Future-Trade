import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { changePassword } from "../../services/apiService";
import { KeyRound, Save } from "lucide-react";

const ChangePassword = () => {
  const { user } = useAuthContext();
  const [passwordData, setPasswordData] = useState({
    current_pass: "",
    new_pass: "",
    confirm_pass: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePass = async (e) => {
    e.preventDefault();

    if (passwordData.new_pass !== passwordData.confirm_pass) {
      toast.info("Please enter the same new password in both fields.");
      return;
    }

    if (
      !passwordData.current_pass ||
      !passwordData.new_pass ||
      !passwordData.confirm_pass
    ) {
      toast.error("All fields are required.");
      return;
    }

    const updatedData = {
      user_id: user.user_id,
      current_password: passwordData.current_pass,
      new_password: passwordData.new_pass,
      confirm_password: passwordData.confirm_pass,
    };

    try {
      setIsLoading(true);
      const response = await changePassword(updatedData);
      if (response.status) {
        toast.success("Password changed successfully!");
        setPasswordData({ current_pass: "", new_pass: "", confirm_pass: "" });
      } else {
        toast.error(response.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <KeyRound size={28} className="text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdatePass} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="current_pass"
              value={passwordData.current_pass}
              onChange={handleInputChange}
              placeholder="Enter Current Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="new_pass"
              value={passwordData.new_pass}
              onChange={handleInputChange}
              placeholder="Enter New Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_pass"
              value={passwordData.confirm_pass}
              onChange={handleInputChange}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Save size={18} className="mr-2" /> Change Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
