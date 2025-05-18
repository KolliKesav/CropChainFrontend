import React from "react";
import Navbar from "../components/Navbar";
import Home from "../components/Home";
import Courses from "../components/Courses";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import About from "../components/About";
import { TimeLine } from "../components/TimeLine";
import { MultiLevelSidebar } from "../components/MultiLevelSidebar";
import { useUser } from "../context/UserContext"; // assuming this gives you role/info

export default function HomePage() {
  const { role } = useUser(); // fetch role from context

  return (
    <div className=" bg-gray-50 min-h-screen overflow-x-hidden flex">
      {/* Conditionally show sidebar */}
      <div className="fixed">{role && <MultiLevelSidebar />}</div>

      {/* Main content - add ml-64 only if sidebar is shown */}
      <div><main className={`${role ? "ml-56" : ""}`}>
        <Navbar />

        <div id="home">
          <Home />
        </div>

        <div id="about">
          <About />
        </div>

        <div className="my-20px">
          <TimeLine />
        </div>

        <div id="courses">
          <Courses />
        </div>

        <div id="contact">
          <Contact />
        </div>

        <Footer />
      </main>
      </div>
    </div>
  );
}
