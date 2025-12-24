import React from "react";
import Navbar from "../../Components/Navbar/NAvbar";
import { Outlet } from "react-router";
import Footer from "../../Components/Footer/Footer";

const HomeLayout = () => {
  return (
    <div>
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default HomeLayout;
