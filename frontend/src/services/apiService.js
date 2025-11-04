import axios from 'axios';
import { toast } from 'react-toastify';
// https://newadmin.gamedemo.tech/api
const API_BASE_URL = "https://future-trade.onrender.com/api/auth";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});


export const getTeam = async (userId) => {
  try {
    const response = await api.get(`/downline/${userId}`);
    return response.data;
  } catch (error) {
    console.error("User Details failed:", error);
    throw error;
  }
}

export const getTransaction = async (userId)=>{
  try {
    const response = await api.get(`/user/transactionHistory/${userId}`);
    console.log("user transaction History", response.data);
    return response.data;
  } catch (error) {
    console.error("User Transaction History fetch failed:", error);
    throw error;
  }
}

export const getCaptcha = async () => {
  try {
    const response = await api.get("/gaurav-captcha");
    return response.data;
  } catch (error) {
    console.error("Error fetching captcha:", error);
    throw error;
  }
};


export const registerUser = async (userData) => {
  try {
    const response = await api.post('register', userData);
    console.log("Register", response);
    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('login', credentials);
    console.log(response.data);
    console.log(response.data.user);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("User Details failed:", error);
    throw error;
  }
}

export const updateUserProfile = async (updatedData) => {
  try {
    console.log("Sending data...", updatedData);
    const response = await api.post("/update-profile", updatedData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Update Profile failed:", error.response?.data || error);
    throw error;
  }
}

export const changePassword = async (updatePassword) => {
  try {
    console.log("Sending data...", updatePassword);
    const response = await api.post("/change-password", updatePassword); // Removed extra space
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("change-password failed:", error.response?.data || error);
    throw error;
  }
}

export const bankDetails = async (bankData) => {
  try {
    const response = await api.post('/add-bank-details', bankData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Bank details Updates failed:", error);
    throw error;
  }
}






// side bar data

export const getHomeData = async (userId) => {
  try {
    const response = await api.get(`/user-dashboard/${userId}`);
    // console.log("Home data" ,response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user-dashboard :", error);
    toast.error("Error fetching user-dashboard:", error);
    throw error;
  }
}

export const getInvestmentSummary = async (userId) => {
  try {
    const response = await api.get(`/investment-summary/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Investment summary fetch failed:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get("/products");
    console.log("categories", response.data)
    return response.data.types;
  } catch (error) {
    console.error("Product fetch failed:", error);
    throw error;
  }
}

export const getPackagesByType = async (id) => {
  try {
    const response = await api.get(`products-by-type?type=${id}`);
    return response.data.products;
  } catch (error) {
    console.error("Product by type fetch failed:", error);
    throw error;
  }
}

export const joinProduct = async (productData) => {
  try {
    console.log("Sending product data:", productData);
    const response = await api.post("/invest", productData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Join product failed:", error.response?.data || error);
    throw error;
  }
};



// apiService.js

export const getIndiaStates = async () => {
  try {
    const response = await api.get("/get-india-states");
    console.log("get-india-states", response.data);
    return response.data;
  } catch (error) {
    console.error("India states fetch failed:", error);
    throw error;
  }
};

export const getDistrictsByState = async (state) => {
  try {
    const response = await api.post('/districts', { state });
    return response.data;
  } catch (error) {
    console.error("Districts by state fetch failed:", error);
    throw error;
  }
};


export const submitKyc = async (kycData) => {
  try {
    console.log("Sending KYC data:", {
      ...kycData,
      aadhaar_front: kycData.aadhaar_front ? kycData.aadhaar_front.substring(0, 50) + '...' : null,
      aadhaar_back: kycData.aadhaar_back ? kycData.aadhaar_back.substring(0, 50) + '...' : null,
      pan_front: kycData.pan_front ? kycData.pan_front.substring(0, 50) + '...' : null
    });

    const response = await api.post('/submit-kyc', kycData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log("KYC Response:", response.data);

    if (response.data.status === true) {
      console.log("submitted successfully");
      return response.data;
    } else {
      // Handle backend validation errors
      throw {
        message: response.data.message || 'KYC submission failed',
        errors: response.data.errors || {}
      };
    }
  } catch (error) {
    console.error("KYC API Error:", error);

    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      throw {
        message: errorData.message || 'KYC submission failed',
        errors: errorData.errors || {},
        status: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      // Something else went wrong
      throw new Error(error.message || 'Error setting up the request');
    }
  }
};

export const getWalletData = async (userId)=>{
  try {
    const response = await api.get(`/user/salary-bonus-cashback/${userId}`);
    console.log("salary-bonus-cashback", response.data);
    return response.data;
  } catch (error) {
    console.error("India states fetch failed:", error);
    throw error;
  }
}

// profile API

export const getPolicy = async () => {
  try {
    const response = await api.get("/privacy_policy");
    return response.data;
  } catch (error) {
    console.error("Error fetching Privacy Policy :", error);
    throw error;
  }
}

export const getAboutUs = async () => {
  try {
    const response = await api.get("/about-us");
    // console.log("response aboutus",response)
    return response.data;
  } catch (error) {
    console.error("Error fetching about-us :", error);
    throw error;
  }
};

export const getTerms = async () => {
  try {
    const response = await api.get("/terms");
    return response.data;
  } catch (error) {
    console.error("Error fetching terms :", error);
    throw error;
  }
};