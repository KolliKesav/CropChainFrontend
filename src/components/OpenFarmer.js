import { useState, useEffect } from "react";
import React from "react";
import {
  Button,
  Card,
  Typography,
  List,
  Input,
} from "@material-tailwind/react";
import Layout from "./Layout";
import { FarmerItem } from "./FarmerItem";
import Upload from "../utils/Upload.json";
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import Navbar from "./Navbar";

export default function FarmerList() {
  const [far, setFar] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const {
    runContractFunction: fetch,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_farmers",
  });

  const fetchFarmer = async () => {
    setLoading(true);
    try {
      const result = await fetch();
      if (result) {
        console.log("Fetched farmer data:", result);
        setFar(result);
        setFetched(true);
      } else {
        console.log("No data received");
        setFar([]);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
    setLoading(false);
  };

  // Filter based on search input
  const filteredFarmers = far.filter((item) => {
    const query = searchQuery.toLowerCase();
    return item?.toLowerCase().includes(query);
  });

  const renderFarmers = () =>
    filteredFarmers.map((item, i) => (
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
      <Navbar />
      <Layout>
        <div className=" bg-gradient-to-br from-blue-50 to-green-50 min-h-screen overflow-x-hidden ">
          <div className="flex justify-center pt-24">
            <Typography variant="h1" className="pb-5">
              Fetch the Farmers
            </Typography>
          </div>
          <div className="px-10 pt-5 pb-10">
            <Typography variant="paragraph">
              Here, you'll find all the farmers who have been added to the
              blockchain, along with their details such as ID, address,
              verified images, level, and more.
              <br />
              Click "Read More" to view complete information about a specific
              farmer.
              <br />
              <strong>Note:</strong> Sometimes, newly added data may take a few
              moments to reflect on the website, as the transaction must first
              be confirmed on the blockchain.
            </Typography>
          </div>

          {/* Fetch Button */}
          <Button
            fullWidth
            ripple={true}
            onClick={fetchFarmer}
            className="mx-4 my-2"
          >
            Fetch
          </Button>

          {/* Search Box (after fetch) */}
          {fetched && (
            <div className="w-3/5 mx-auto mt-4 bg-white">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                label="Search by Wallet address"
                placeholder="Enter Wallet address"
                className="mb-4"
              />
            </div>
          )}

          {/* Farmer List */}
          <div className="flex h-full overflow-y-hidden">
            <Card className="mx-auto mt-4 mb-8 w-3/5 rounded-md">
              <List className="my-2 p-0">
                {loading ? (
                  <p className="col-span-full text-center text-gray-500">
                    Loading...
                  </p>
                ) : filteredFarmers && filteredFarmers.length > 0 ? (
                  renderFarmers()
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    {fetched
                      ? "No matching farmer found."
                      : "No farmers fetched yet"}
                  </p>
                )}
              </List>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
