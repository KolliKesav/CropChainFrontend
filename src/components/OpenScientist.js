import { useState } from "react";
import React from "react";
import {
  Button,
  Card,
  Typography,
  List,
  Input,
} from "@material-tailwind/react";
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import Layout from "./Layout";
import { ScientistItem } from "./ScientistItem";
import Upload from "../utils/Upload.json";
import Navbar from "./Navbar";

export default function ScientistList() {
  const [sci, setSci] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false); // to control visibility of search box
  const [searchQuery, setSearchQuery] = useState(""); // search input

  const {
    runContractFunction: fetchScientists,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_scientists",
  });

  const fetchScientist = async () => {
    setLoading(true);
    try {
      const result = await fetchScientists();
      if (result) {
        console.log("Fetched scientist data:", result);
        setSci(result);
        setFetched(true);
      } else {
        console.log("No data received");
        setSci([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  
  const filteredSci = sci.filter((item) => {
    const query = searchQuery;
    return item?.includes(query);
  });

  const renderScientist = () =>
    filteredSci.map((item, i) => (
      <div
        key={`sci-${i}`}
        className={`p-2 flex items-center opacity-0 animate-fade-in`}
        style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
      >
        <ScientistItem item={item} />
      </div>
    ));

  return (
    <Layout>
      <Navbar />
      <div className="mt-5px pt-24 overflow-x-hidden bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <div className="flex justify-center font-semibold">
          <Typography variant="h1">Fetch the Scientists</Typography>
        </div>
        <div className="px-10 pt-5 pb-5">
          <Typography variant="paragraph">
            Here, you'll find all the scientists who have been added to the
            blockchain, along with their data such as ID, address, verified
            images, level, and more. Click "Read More" to view detailed
            information about a specific scientist.
            <br />
            <br />
            <strong>Note:</strong> Sometimes, newly added data may take a while
            to appear on the website, as the blockchain transaction needs to be
            confirmed.
          </Typography>
        </div>

        {/* Fetch Button */}
        <Button
          fullWidth
          ripple={true}
          onClick={fetchScientist}
          className="mx-4 my-2"
        >
          Fetch
        </Button>

        {/* Aadhaar-only Search input (only after fetch) */}
        {fetched && (
          <div className="w-3/5 mx-auto mt-4  bg-white">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              label="Search by Wallet address"
              placeholder="Enter Wallet address"
              className="mb-0 pb-0"
            />
          </div>
        )}

        {/* Scientist List */}
        <div className="flex h-full overflow-y-hidden">
          <Card className="mx-auto mt-4 mb-8 w-3/5 rounded-md">
            <List className="my-2 p-0">
              {loading ? (
                <p className="col-span-full text-center text-gray-500">
                  Loading...
                </p>
              ) : filteredSci && filteredSci.length > 0 ? (
                renderScientist()
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  {fetched
                    ? "No matching scientist found."
                    : "No scientist fetched yet"}
                </p>
              )}
            </List>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
