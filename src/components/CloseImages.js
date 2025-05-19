import React from "react";
import CloseCard from "./CloseCard";
import Layout from "./Layout";
import { Button, Typography } from "@material-tailwind/react";
import Upload from "../utils/Upload.json";
import { useWeb3Contract } from "react-moralis";
import console from "console-browserify";
import { useState } from "react";
import Navbar from "./Navbar";

export default function CloseImages() {
  const [img, setImg] = useState([]);

  const renderImages = () => {
    return img.map((item, i) => (
      <>
        <div key={`a-${i}`} className="p-2 md:p-4">
          <CloseCard item={item} />
        </div>
      </>
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

  const fetchFinal = async () => {
    await fetch();
    if (isFetching) {
      console.log("its fetching");
    }
    if (data) {
      console.log(data);
      setImg(data);
    }
  };

  return (
    <>
    <Navbar/>
      <Layout >
       <div className="overflow-x-hidden">
        <div className="flex justify-center pt-24 ">
          <Typography variant="h1" className="pb-5">
            {" "}
            Fetch All Close Images{" "}
          </Typography>
        </div>
        <div className="px-10 pb-10 ">
          <Typography variant="paragraph" color="blue-gray">
            The images uploaded by the farmer are classified into 3 groups i.e
            OPEN , CLOSE and FINAL. The image which is just reviewed by the AI
            will be in the open image section and the ones which are reviewed by
            scientists will be in CloseImage section .The scientists(Verifiers) need to vote
            for the choice ok or not ok with the image reviewed by AI and a Scientist.
          </Typography>
        </div>
        <div>
          <Button
            fullWidth
            ripple={true}
            onClick={fetchFinal}
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
              <p className="col-span-full text-center text-gray-500">No images fetched yet</p>
            )}
          </div>
        </div>
        </div>
      </Layout>
    </>
  );
}
