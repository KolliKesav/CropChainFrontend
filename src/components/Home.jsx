import React from "react";
import img from "../assets/hero.svg";
import Button from "../layout/Button";
import { Link } from "react-scroll";
import {useUser} from "../context/UserContext";

const Home = () => {
  const { role } = useUser(); // fetch role from context
  return (
    <section className={`${role?"px-24 min-h-screen flex items-center justify-center":"min-h-screen flex items-center justify-center"}`}>
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-10 ">
        {/* Left: Text */}
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h2 className="text-5xl font-semibold leading-tight">
            Knowledge with{" "}
            <span className="text-brightGreen">CropChain</span>
          </h2>
          <p className="text-lightText mt-5">
            AgriChain opens the door to a revolutionary approach to agricultural
            management. Our platform leverages blockchain technology to create a
            decentralized ecosystem for plant disease detection and solution
            verification. Explore our comprehensive suite of tools tailored to
            farmers, scientists, and administrators, empowering you to make
            informed decisions and drive sustainable agriculture forward.
          </p>
          <div className="mt-6">
            <Link to="contact" spy={true} smooth={true} duration={500}>
              <Button title="Contact Us" />
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src={img}
            alt="Illustration"
            className="w-full h-auto max-w-md md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
