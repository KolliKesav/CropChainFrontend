import React, { useState,useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";



const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [login, setLogin] = useState(false);
  
  const navigate = useNavigate();
 const { walletAddress,role,logout,loading } = useUser();
 
 useEffect(() => {
  console.log(loading);
  if(role && walletAddress){
   setLogin(true);
   
  }
  else{
    setLogin(false);
   
  }

 },[role, walletAddress]);



  const handleChange = () => {
    setMenu(!menu);
  };

  return (
    <div>
     
<div className="fixed top-0 left-0 w-full flex flex-row justify-between py-4 px-5 md:px-8 md:px-32 bg-white z-[1000] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
<div>
    <Link
      to="/"
      className="flex items-center gap-5 font-semibold text-2xl p-1 cursor-pointer"
    >
      <img src="/logo.png" alt="Logo" className="h-10 w-10" />
      <span>Crop Chain</span>
    </Link>
  </div>

  <nav className="hidden md:flex items-center gap-5 font-medium p-1 text-lg ml-auto">
    <Link
      to="/home"
      className="hover:text-[#539165] transition-all cursor-pointer"
    >
      Home
    </Link>
    <Link
      to="/login"
      className="hover:text-[#539165] transition-all cursor-pointer"
       onClick={() => {
     if (login) {
      logout();        
      navigate("/login"); 
    }
  }}
    >
      {login?("Logout"):("Login")}
    </Link>
  


          {/* <Link
            to="./scientist"
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            Scientist
          </Link>
          <Link
            to="./kvkmanager"
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            Manager
          </Link> */}
        </nav>

        <div className="flex md:hidden" onClick={handleChange}>
          <div className=" p-2">
            <AiOutlineMenu size={22} />
          </div>
        </div>
      </div>
      // {/* <div
      //   className={` ${
      //     menu ? "translate-x-0" : "-translate-x-full"
      //   } md:hidden flex flex-col absolute bg-[#ffffff] left-0 top-20 font-medium text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300 `}
      // >
      //   <Link
      //     to="home"
      //     spy={true}
      //     smooth={true}
      //     duration={500}
      //     className="hover:text-[#539165] transition-all cursor-pointer"
      //   >
      //     Home
      //   </Link>
      //   <Link
      //     to="about"
      //     spy={true}
      //     smooth={true}
      //     duration={500}
      //     className="hover:text-[#539165] transition-all cursor-pointer"
      //   >
      //     About
      //   </Link>
      //   <Link
      //     to="courses"
      //     spy={true}
      //     smooth={true}
      //     duration={500}
      //     className="hover:text-[#539165] transition-all cursor-pointer"
      //   >
      //     Courses
      //   </Link>
      //   <Link
      //     to="reviews"
      //     spy={true}
      //     smooth={true}
      //     duration={500}
      //     className="hover:text-[#539165] transition-all cursor-pointer"
      //   >
      //     Reviews
      //   </Link>
      //   <Link
      //     to="contact"
      //     spy={true}
      //     smooth={true}
      //     duration={500}
      //     className="hover:text-[#539165] transition-all cursor-pointer"
      //   >
      //     Contact
      //   </Link>
      // </div> */}

    </div>
  );
};

export default Navbar;
