"use client";
import { useState } from "react";
import Head from "next/head";

import MainNavbar from "@/components/MainNavbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>EduManage - School Management System</title>
        <meta
          name="description"
          content="Modern school management solution"
        />
      </Head>

      <MainNavbar isLogin={isLogin} toggleModal={toggleModal} />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />

      <AuthModal showModal={showModal} toggleModal={toggleModal} />
    </div>
  );
}
