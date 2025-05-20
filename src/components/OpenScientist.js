import { useState, useEffect } from "react";
import React from "react";
import { Button, Card, Typography, List } from "@material-tailwind/react";
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import Layout from "./Layout";
import { ScientistItem } from "./ScientistItem";
import Upload from "../utils/Upload.json";
import Navbar from "./Navbar";

export default function ScientistList() {
  const [sci, setSci] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    runContractFunction: fetchScientists,
    data,
    error,
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
        console.log(result);
        setSci(result);
      } else {
        console.log("No data received");
        setSci([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  const renderScientist = () =>
    sci.map((item, i) => (
      <div
      key={`sci-${i}`}
      className={`p-2 flex items-center opacity-0 animate-fade-in`}
      style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
    >
        <ScientistItem item={item} />
      </div>
    ));

  return (
    <Layout>
      <Navbar />
      <div className="mt-5px pt-24 overflow-x-hidden">
        <div className="flex justify-center font-semibold">
          <Typography variant="h1">FETCH SCIENTIST</Typography>
        </div>
        <div className="px-10 pt-5 pb-10">
          <Typography variant="paragraph">
            Here you will get all the scientists who are added to chain and their
            data like ID, Address, Images verified, his level, etc. You can
            click on the read more to get these data about that particular
            scientist. WORD OF CAUTION - sometimes the added chain data needs
            some time to reflect on the website as the transaction needs to be
            verified.
          </Typography>
        </div>
        <Button
          fullWidth
          ripple={true}
          onClick={fetchScientist}
          className="mx-4 my-2"
        >
          Fetch
        </Button>

        <div className="flex h-full overflow-y-hidden">
          <Card className="mx-auto mt-8 mb-2 w-3/5 rounded-md">
            <List className="my-2 p-0">
              {loading ? (
                <p className="col-span-full text-center text-gray-500">Loading...</p>
              ) : sci && sci.length > 0 ? (
                renderScientist()
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No scientist fetched yet
                </p>
              )}
            </List>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
