import React, { useState,useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@material-tailwind/react";
import UploadImage from "../components/UploadImage";
import { Typography } from "@material-tailwind/react";
import { FarmerTab } from "../components/FarmerTab";
import { ButtonGroup } from "@material-tailwind/react";
import { CardSkeleton } from "../components/CardSkeleton";
import Upload from "../utils/Upload.json";
import DisplayCard from "../components/DisplayCard";
import Navbar from "../components/Navbar";
import {
  useWeb3Contract,
  useMoralis,
} from "react-moralis";
import FinalCard from "../components/FinalCard";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OpenCard from "../components/OpenCard";

export default function Farmer() {
  const [img, setImg] = useState("");
  const { account } = useMoralis();
  const [meth, setMeth] = useState("");

  

  const {
    runContractFunction: fetch,
    data,
    isFetching,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: meth,
    params: {
      _user: account,
    },
  });

  const fetchImg = async () => {
    await fetch();
  };
  useEffect(() => {
  const fetchData = async () => {
    if (!meth) return;
    await fetch();
  };
  fetchData();
}, [meth]);

  useEffect(()=>{
     if (data&&Array.isArray(data)) {
      setImg(data);
    }
  },[data])

  return (
    <div className="">
      <Navbar />

      <Layout headerType="farmer"  >
        
        <section className=" py-5 px-4 md:px-14 pt-20 bg-gradient-to-br from-blue-50 to-green-50" >
        <div className="bg-gradient-to-r from-green-100 via-blue-100 to-teal-100 rounded-xl p-4 shadow-md mb-6">
  <h1 className="text-gray-700 text-3xl font-extrabold tracking-wide uppercase text-center">
     Dashboard
  </h1>
</div>


<div className="bg-white rounded-xl shadow-md max-w-8xl mx-auto my-10 p-6">  
          <div className="text-center">

            <Typography variant="h1" className="text-4xl font-bold mb-6">
              Instructions
            </Typography>
            
          </div>

          <div className="mt-6">
            <FarmerTab />
          </div>
          </div>

          <div className="bg-white rounded-xl shadow-md max-w-8xl mx-auto my-10 p-6">
            <div className="text-center mb-10">
              <Typography variant="h2" className="text-3xl font-semibold">
                Upload the Image
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="  max-w-3xl mx-auto mt-8">
              Please upload your image using the stepper form below. Follow all steps carefully
              to ensure your transaction gets submitted correctly. You will receive
              notifications throughout the process. Be patient as some steps take longer to complete.
              Ensure you have enough Test ETH in your MetaMask. If not, get it from{' '}
              <a
                className="text-blue-600 underline"
                target="_blank"
                href="https://www.alchemy.com/faucets/ethereum-sepolia"
              >
                Sepolia Faucet
              </a>.
            </Typography>
            </div>
            <UploadImage />

            <Typography variant="paragraph" color="blue-gray" className="mt-8">
              We use IPFS for decentralized image storage. Uploads might take some time or fail
              occasionally. If unsuccessful, try again later. Learn more about IPFS at{' '}
              <a
                className="text-blue-600 underline"
                target="_blank"
                href="https://ipfs.tech/"
              >
                https://ipfs.tech/
              </a>.
            </Typography>
          </div>

          <div className="mt-16">
            <div className="bg-white rounded-xl shadow-md max-w-8xl mx-auto my-10 p-6">
            <div className="text-center mb-6">
              <Typography variant="h2" className="text-3xl font-semibold">
                Fetch Your Images
              </Typography>
            </div>

            <Typography variant="paragraph" color="blue-gray" className="text-center max-w-3xl mx-auto mb-10">
              Uploaded images are grouped into OPEN, CLOSE, and FINAL:
              <ul className="list-disc list-inside text-left mt-4">
                <li>OPEN: Reviewed by AI</li>
                <li>CLOSE: Reviewed by Scientist</li>
                <li>FINAL: Verified and Approved</li>
              </ul>
              Click the respective buttons to fetch your images.
            </Typography>

            <div className="flex justify-center mb-10">
              <ButtonGroup fullWidth variant="outlined">
                <Button
                  onClick={() => {
                    setMeth("display_open");
                    fetchImg();
                  }}
                >
                  Uploaded
                </Button>
                <Button
                  onClick={() => {
                    setMeth("display_close");
                    fetchImg();
                  }}
                >
                  Being Reviewed
                </Button>
                <Button
                  onClick={() => {
                    setMeth("display_final");
                    fetchImg();
                  }}
                >
                  Final
                </Button>
              </ButtonGroup>
            </div>

            <div className="min-h-[300px]">
              {img && img.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <AnimatePresence mode="wait">
    {img.map((item, i) => (
      <motion.div
        key={`${meth}-${i}`}
        className="p-2 md:p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {meth === "display_final" ? (
          <FinalCard item={item} />
        ) : (
          <OpenCard item={item} />
        )}
      </motion.div>
    ))}
  </AnimatePresence>
</div>

              ) : (
                <div className="text-center">
                  <Typography>No images fetched yet</Typography>
                  <div className="flex justify-center gap-6 mt-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                </div>
                
              )}
              
            </div>
           </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}