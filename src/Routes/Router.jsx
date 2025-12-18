import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
import Home from "../Pages/Home/Home";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Profile from "../Pages/Profile/Profile";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome/DashboardHome";
import DashboardRequests from "../Pages/Dashboard/DashboardRequests/DashboardRequests";
import SentRequests from "../Components/SentRequests/SentRequests";
import AllActiveDonors from "../Components/AllActiveDonors/AllActiveDonors";
import Request from "../Components/Request/Request";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/all-active-donors",
        Component: AllActiveDonors,
      },
      {
        path: "/request",
        Component: Request,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        path: "/auth/login",
        Component: Login,
      },
      {
        path: "/auth/register",
        Component: Register,
      },
      //   {
      //     path: "/auth/forgotPassword",
      //     Component: ForgotPassword,
      //   },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "/dashboard/profile",
        Component: Profile,
      },
      {
        path: "/dashboard/requests",
        Component: DashboardRequests,
      },
      {
        path: "/dashboard/sent-requests",
        Component: SentRequests,
      },
    ],
  },
]);

export default router;
