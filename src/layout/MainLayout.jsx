import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatWidget/>
    </>
  );
};

export default MainLayout;