import React from "react";
import Navbar from "../../Components/Navbar/NAvbar";
import { Outlet } from "react-router";

const HomeLayout = () => {
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer></footer>
    </div>
  );
};

export default HomeLayout;
