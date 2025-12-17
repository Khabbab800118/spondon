import React from "react";
import Navbar from "../../Components/Navbar/NAvbar";
import { Outlet, useNavigation } from "react-router";
import Loading from "../../Components/Loading/Loading";

const AuthLayout = () => {
  const { state } = useNavigation();
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        {state === "loading" ? <Loading></Loading> : <Outlet></Outlet>}
      </main>
    </div>
  );
};

export default AuthLayout;
