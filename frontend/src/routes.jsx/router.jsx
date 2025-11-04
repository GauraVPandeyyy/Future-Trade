import App from "../App";
import Home from "../pages/Home";
import InvFund from "../pages/InvFund";
import Promotion from "../pages/Promotion";
import Wallet from "../pages/Wallet";
import Kyc from "../pages/Kyc";
import DownloadApk from "../pages/DownloadApk";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ReferAndEarn from "../components/ReferAndEarn";
import Salary from "../components/Salary";
import Profile from "../pages/Profile";
import TeamTree from "../components/profile/TeamTree";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Withdrawal from "../components/Withdrawal";
import BankDetails from "../components/profile/BankDetails";
import Policy from "../components/profile/Policy";
import TermConditions from "../components/profile/TermConditions";
import AboutUs from "../components/profile/AboutUs";
import ReInvest from "../components/ReInvest";
import ChangePassword from "../components/profile/ChangePassword";
import TransactionHistory from "../components/TransactionHistory";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([

  // Public Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },


  // Protected Routes
  {
    path: "/",
    element: <ProtectedRoute />, // Dashboard aur uske bachhe ab protected hain
    children: [

      {
        path: "/",
        element: <Dashboard />,
        children: [
          {
            index: true,
            // path: "home",
            element: <Home />
          },
          {
            path: "inv-fund",
            element: <InvFund />
          },
          {
            path: "promotion",
            element: <Promotion />,
            children: [
              {
                index: true,
                element: <ReferAndEarn />,
              },
              {
                path: "salary",
                element: <Salary />,
              }
            ]
          },
          {
            path: "wallet",
            element: <Wallet />
          },
          {
            path: "kyc",
            element: <Kyc />
          },
          {
            path: "download",
            element: <DownloadApk />
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "bank-details",
            element: < BankDetails />
          }, {
            path: "team",
            element: < TeamTree />
          },
          {
            path: "withdrawal",
            element: <Withdrawal />
          },
          {
            path: "reInvest",
            element: <ReInvest />
          },
          {
            path: "policy",
            element: <Policy />
          },
          {
            path: "term_conditions",
            element: <TermConditions />
          },
          {
            path: "about-us",
            element: <AboutUs />
          },
          {
            path: "change-password",
            element: <ChangePassword />
          },
          {
            path: "transaction-history",
            element: <TransactionHistory />
          },
        ],
      },
    ],
  },
  {
    path:"*",
    element: <NotFound />
  }
]);

export default router;