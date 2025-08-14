import { useState } from "react";
import React from "react";
import {
  Collapse,
  Button,
  Card,
  Input,
  Checkbox,
  Typography,
  List,
} from "@material-tailwind/react";
import Layout from "./Layout";
import { FarmerItem } from "./FarmerItem";
import Upload from "../utils/Upload.json";
import { toast, ToastContainer } from "react-toastify";
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

export default function FarmerList() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const [far, setFar] = useState([]);
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");

  const renderFarmers = () => {
    return far.map((item, i) => (
      <div key={`a-${i}`} className="p-2">
        <FarmerItem item={item} />
      </div>
    ));
  };

  const { runContractFunction: fetchFarmers, data, isFetching } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_farmers",
  });

  const fetchFarmer = async () => {
    await fetchFarmers();
    if (isFetching) console.log("Fetching farmer data...");
    if (data) {
      console.log("Fetched farmers:", data);
      setFar(data);
    }
  };

  const { runContractFunction: addFarmer } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "add_farmer",
    params: { _farmer: address, _adhar_id: aadhar },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addFarmer({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => {
        console.log("Add farmer error:", error);
        toast.error("Failed to add farmer. Please check inputs.");
      },
    });
  };

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    toast.success("Farmer added successfully");
    setAddress("");
    setAadhar("");
    fetchFarmer(); // Refresh list
  }

  return (
    <>
      <Navbar />
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
          <div className="max-w-5xl mx-auto  pt-20">
            {/* Register Farmer Header */}
            <Card className="bg-white rounded-xl shadow-md p-6 py-0">
              <div className="flex flex-col items-center">
                <Typography variant="h1" className="pt-8 pb-5">
                  Register a new Farmer
                </Typography>
                <Button onClick={toggleOpen} className="mb-4">
                  {open ? "Close Form" : "Add Farmer"}
                </Button>
              </div>
            </Card>

            {/* Collapsible Form Card */}
            <Collapse
              open={open}
              animate={{
                mount: { opacity: 1, height: "auto" },
                unmount: { opacity: 0, height: 0 },
              }}
            >
              <Card className="bg-white rounded-xl shadow-md p-6 ">
                <form
                  className="mt-2 w-80 max-w-screen-lg sm:w-96 mx-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4 flex flex-col gap-6">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-2"
                    >
                      Wallet Address
                    </Typography>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      size="lg"
                      placeholder="0x..."
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="-mb-2"
                    >
                      Aadhaar Number
                    </Typography>
                    <Input
                      value={aadhar}
                      onChange={(e) => setAadhar(e.target.value)}
                      size="lg"
                      placeholder="XXXX-XXXX-XXXX"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                    />
                  </div>
                  <Checkbox
                    label={
                      <Typography
                        variant="small"
                        color="gray"
                        className="flex items-center font-normal"
                      >
                        I agree to the
                        <a
                          href="#"
                          className="font-medium transition-colors hover:text-gray-900"
                        >
                          &nbsp;Terms and Conditions
                        </a>
                      </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                  />
                  <Button type="submit" className="mt-6" fullWidth>
                    Add Farmer
                  </Button>
                </form>
              </Card>
            </Collapse>

            {/* Info Card */}
            <Card className="bg-white rounded-xl shadow-md mt-8 mb-8 p-6">
              <Typography variant="paragraph">
                Kvk Manager is responsible for onboarding farmers onto the
                blockchain system. Each farmer's data is tied to their wallet
                address and Aadhaar for secure tracking. Only trusted farmers
                should be added as they will participate in decentralized crop
                reporting.
              </Typography>
            </Card>

            {/* Fetch Farmer Section
            <Card className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-center">
                <Typography variant="h1">FETCH FARMERS</Typography>
              </div>
              <Typography variant="paragraph" className="py-4">
                This section displays all registered farmers with their details.
                Click the button below to fetch the list from the blockchain.
              </Typography>
              <Button
                fullWidth
                ripple={true}
                onClick={fetchFarmer}
                className="mx-4 my-2"
              >
                Fetch
              </Button>

              Farmer List Section
              <Card className="bg-white rounded-xl shadow-md p-6">
                <List className="my-2 p-0">
                  {isFetching ? (
                    <p>Loading...</p>
                  ) : far && far.length > 0 ? (
                    renderFarmers()
                  ) : (
                    <p>No farmers fetched yet</p>
                  )}
                </List>
              </Card>
            </Card> */}
          </div>

          <ToastContainer />
        </div>
      </Layout>
    </>
  );
}
