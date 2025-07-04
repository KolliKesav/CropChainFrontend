import React from "react";
import OpenCard from "./OpenCard";
import { AIreviewed } from "../utils/AIrviewed";
import Layout from "./Layout";
import { useState,useEffect } from "react";
import Upload from "../utils/Upload.json";
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import { Button, Typography } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

export default function OpenImages() {
  const [img, setImg] = useState([]);

  

  const {
    runContractFunction: fetch,
    data,
    isFetching,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_images",
  });
    useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("Updated data received:", data);
      setImg(data);
    }
  }, [data]);

  const fetchOpen = async () => {
    await fetch();
  };

  const renderImages = () => {
    return img.map((item, i) => (
      <>
        <div key={`a-${i}`} className={`opacity-0 animate-fade-in p-2 md:p-4`}>
          <OpenCard item={item} />
        </div>
      </>
    ));
  };

  return (
    <>
    <Navbar />
      <Layout>
        <div className="overflow-x-hidden">
          <div className="flex justify-center pt-24">
            <Typography variant="h1" className="pb-5">
              {" "}
              Fetch All Open Images{" "}
            </Typography>
          </div>

          <div className="px-10 pb-10 ">
            <Typography variant="paragraph" color="blue-gray">
              The images uploaded by the farmer are classified in to 3 groups
              i.e OPEN , CLOSE and FINAL. THe image which is just reviewed by
              the ai will still be in the opne image section. These can only be
              reviewed by the scientists , even if some other one tries to
              review it the transaction gets reverted.
            </Typography>
          </div>
          <Button
            fullWidth
            ripple={true}
            onClick={fetchOpen}
            className="mx-4 my-2"
          >
            {" "}
            Fetch{" "}
          </Button>
          <div className=" h-[calc(100vh-3rem)] overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {isFetching ? (
             <p className="col-span-full text-center text-gray-500">Loading...</p>
            ) : img && img.length > 0 ? (
              renderImages()
            ) : (
               <p className="col-span-full text-center text-gray-500">No images fetched </p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
