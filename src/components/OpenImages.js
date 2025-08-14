import React, { useState, useEffect } from "react";
import OpenCard from "./OpenCard";
import Layout from "./Layout";
import Upload from "../utils/Upload.json";
import { useWeb3Contract } from "react-moralis";
import { Button, Typography } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import { useUser } from "../context/UserContext";


export default function OpenImages() {
  const [img, setImg] = useState([]);
  const {role}=useUser();

  const { runContractFunction: fetch, data, isFetching } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_open_images",
  });

  useEffect(() => {
    if (data && typeof data === "string") {
      const urls = data.split("$$$").filter(Boolean);
      setImg(urls);
    }
  }, [data]);

  const fetchOpen = async () => {
    await fetch();
  };


  const removeImageFromList = (url) => {
    setImg((prev) => prev.filter((item) => item !== url));
  };

  const renderImages = () => {
   
      console.log(role);
    return img.map((item, i) => (
      <div key={`a-${i}`} className="opacity-0 animate-fade-in p-2 md:p-4">
        <OpenCard item={item}  />
      </div>
    ));

  };

  return (
    <>
      <Navbar />
      <Layout>
        <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen overflow-x-hidden">
          <div className="flex justify-center pt-24">
            <Typography variant="h1" className="pb-5">
              Fetch All Open Images
            </Typography>
          </div>

          <div className="px-10 pb-10">
            <Typography variant="paragraph" color="blue-gray">
              Images uploaded by farmers are categorized into three sections:
              OPEN, CLOSE, and FINAL. Newly uploaded images that have only been
              reviewed by the AI remain in the OPEN section. Only verified
              scientists are authorized to review these images. Any attempt by
              unauthorized users to review them will result in a reverted
              transaction.
            </Typography>
          </div>

          <Button
            fullWidth
            ripple={true}
            onClick={fetchOpen}
            className="mx-4 my-2"
          >
            Fetch
          </Button>

          <div className="h-[calc(100vh-3rem)] overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {isFetching ? (
              <p className="col-span-full text-center text-gray-500">
                Loading...
              </p>
            ) : img && img.length > 0 ? (
              renderImages()
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No images fetched
              </p>
            )}
          </div>
        </div>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
