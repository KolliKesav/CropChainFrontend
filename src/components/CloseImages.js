import React, { useState, useEffect } from "react";
import CloseCard from "./CloseCard";
import Layout from "./Layout";
import { Button, Typography } from "@material-tailwind/react";
import Upload from "../utils/Upload.json";
import { useWeb3Contract } from "react-moralis";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import OpenCard from "./OpenCard";

export default function CloseImages() {
  const [img, setImg] = useState([]);
  const {role}=useUser();

  const renderImages = () => {
    return img.map((item, i) => (
      <div key={`a-${i}`} className="opacity-0 animate-fade-in p-2 md:p-4">

        {role==="Farmer"?<OpenCard item={item} />:<CloseCard item={item} />}
      </div>
    ));
  };

  const {
    runContractFunction: fetch,
    data,
    isFetching,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_close_images",
  });

  useEffect(() => {
    if (data && typeof data === "string") {
      console.log("Updated data received:", data);
      const urls = data.split("$$$"); 
      setImg(urls);
    }
  }, [data]);

  const fetchClose = async () => {
    await fetch();
  };

  return (
    <>
      <Navbar />
      <Layout>
         <div className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen overflow-x-hidden">
          <div className="flex justify-center pt-24">
            <Typography variant="h1" className="pb-5">
              Fetch All Close Images
            </Typography>
          </div>
          <div className="px-10 pb-10">
            <Typography variant="paragraph" color="blue-gray">
              Images uploaded by farmers are classified into three groups: OPEN, CLOSE, and FINAL. An image initially reviewed only by the AI will appear in the OPEN section. Once a scientist submits their review, the image moves to the CLOSE section. In this stage, other scientists, known as verifiers, are required to vote either “OK” or “Not OK” based on both the AI’s assessment and the scientist’s review. If the image receives sufficient approvals, it is promoted to the FINAL section, marking it as fully verified.
            </Typography>
          </div>
          <div>
            <Button
              fullWidth
              ripple={true}
              onClick={fetchClose}
              className="mx-4 my-2"
            >
              Fetch
            </Button>

            <div className="h-[calc(100vh-3rem)] overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {isFetching ? (
                <p className="col-span-full text-center text-gray-500">Loading...</p>
              ) : img && img.length > 0 ? (
                renderImages()
              ) : (
                <p className="col-span-full text-center text-gray-500">No images fetched yet</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
       <ToastContainer />
    </>
  );
}
