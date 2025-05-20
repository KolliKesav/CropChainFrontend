import { useState,useEffect } from "react";
import React from "react";
import { Button, Card, Typography, List } from "@material-tailwind/react";
import Layout from "./Layout";
import { FarmerItem } from "./FarmerItem";
import Upload from "../utils/Upload.json";
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import Navbar from "./Navbar";

export default function FarmerList() {
  const [far, setFar] = useState("");

  const {
    runContractFunction: fetch,
    data,
    isFetching,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_farmers",
  });

 useEffect(() => {
    if (data) {
      console.log("Data fetched:", data);
      setFar(data);
    }
  }, [data]);

  const fetchFarmer = async () => {
    try {
      await fetch();
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  const renderFarmers = () =>
    far.map((item, i) => (
      <div
        key={`farmer-${i}`}
        className="p-2 flex items-center opacity-0 animate-fade-in"
        style={{
          animationDelay: `${i * 100}ms`,
          animationFillMode: "forwards",
        }}
      >
        <FarmerItem item={item} />
      </div>
    ));
  return (
    <>
    <Navbar/>
    <Layout>
      <div className="overflow-x-hidden">
        <div className="flex justify-center pt-24 ">
          <Typography variant="h1" className="pb-10">
            Fetch the Farmers
          </Typography>
        </div>
        <div className="px-10 pt-5 pb-10">
          <Typography variant="paragraph">
            Here you will get all the Farmers who are added to chain and theri
            data like ID,Address,Images verified , his level etc.. you can click
            on the read more to get these data about that particualr scientist.
            WORD OF CAUTION - some times the added chain data needs some time to
            reflect on the website as the transaction needs to be verified.
          </Typography>
        </div>
        <Button
          fullWidth
          ripple={true}
          onClick={fetchFarmer}
          className="mx-4 my-2"
        >
          {" "}
          Fetch{" "}
        </Button>

        <div className="flex h-full overflow-y-hidden">
          <Card className="mx-auto mt-8 mb-2 w-3/5  rounded-md">
            <List className="my-2 p-0">
              {isFetching ? (
                <p className="col-span-full text-center text-gray-500">Loading...</p>
              ) : far && far.length > 0 ? (
                renderFarmers()
              ) : (
               <p className="col-span-full text-center text-gray-500"> No farmers fetched yet</p>
              )}
            </List>
          </Card>
        </div>
      </div>
    </Layout>
    </>
  );
}
