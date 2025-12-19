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
import PrivateRoute from "../Components/PrivateRoute/PrivateRoute";
import MyDonations from "../Components/MyDonations/MyDonations";
import AcceptedRequests from "../Components/AcceptedRequests/AcceptedRequests";
import ManageUsers from "../Components/ManageUsers/ManageUsers";
import ManageRequests from "../Components/ManageRequests/ManageRequests";
import ManageDonations from "../Components/ManageDonations/ManageDonations";
import Reports from "../Components/Reports/Reports";

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
        element: (
          <PrivateRoute>
            <Request></Request>
          </PrivateRoute>
        ),
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
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
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
      {
        path: "/dashboard/my-donations",
        Component: MyDonations,
      },
      {
        path: "/dashboard/accepted-requests",
        Component: AcceptedRequests,
      },
      {
        path: "/dashboard/manage-users",
        Component: ManageUsers,
      },
      {
        path: "/dashboard/manage-requests",
        Component: ManageRequests,
      },
      {
        path: "/dashboard/manage-donations",
        Component: ManageDonations,
      },
      {
        path: "/dashboard/reports",
        Component: Reports,
      },
    ],
  },
]);

export default router;
