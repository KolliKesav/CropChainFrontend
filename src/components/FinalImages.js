import React, { useState,useEffect } from "react";
import Layout from "./Layout";
import Upload from "../utils/Upload.json";
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import { Button, Typography } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import FinalCard from "./FinalCard";
import Navbar from "./Navbar";

export default function FinalImages() {
  const [img, setImg] = useState([]);

  const {
    runContractFunction: fetch,
    data,
    isFetching,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_final_images",
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("Updated data received:", data);
      setImg(data);
    }
  }, [data]);

  const fetchFinal = async () => {
    await fetch();
  };

  const renderImages = () => {
     return img.map((item, i) => (
       <>
         <div key={`a-${i}`}   className={` opacity-0 animate-fade-in p-2 md:p-4`}>
           <FinalCard item={item} />
         </div>
       </>
     ));
   };

  return (
    <>
      <Navbar />
      <Layout>
        <div className="flex justify-center pt-24">
          <Typography variant="h1" className="pb-5 text-center">
            Fetch The Images
          </Typography>
        </div>

        <div className="px-10 pb-10 text-justify">
          <Typography variant="paragraph" color="blue-gray">
            The images which are completed being reviewed by AI, scientists, and
            other reviewers are shown here. <strong>WORK OF CAUTION</strong> –
            Please trust the solutions where a minimum of 5–6 users have verified
            the image.
          </Typography>
        </div>

        <div className="px-6 pb-4">
          <Button fullWidth ripple={true} onClick={fetchFinal} className="my-2">
            Fetch
          </Button>
        </div>

        
          <div className=" h-[calc(100vh-3rem)] overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {isFetching ? (
              <p className="col-span-full text-center text-gray-500">Loading...</p>
            ) : img && img.length > 0 ? (
              renderImages()
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No images fetched yet
              </p>
            )}
          
        </div>
      </Layout>
    </>
  );
}
