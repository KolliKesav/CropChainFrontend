import { useState, useEffect } from "react";
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
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import Layout from "./Layout";
import { ScientistItem } from "./ScientistItem";
import Upload from "../utils/Upload.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

export default function ScientistList() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);
  const [address, setAddress] = useState("");
  const [id, setId] = useState("");
  const [aadharId, setAadharId] = useState("");
  const [sci, setSci] = useState([]);

  const {
    runContractFunction: fetchScientists,
    data,
    isFetching,
  } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "get_scientists",
  });

  const fetchScientist = async () => {
    await fetchScientists();
  };

  useEffect(() => {
    if (data) {
      console.log("Data fetched:", data);
      setSci(data);
    }
  }, [data]);

  const { runContractFunction: addScientist } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "add_scientist",
    params: {
      _scientist: address,
      _adhar_id: aadharId,
      _scientist_id: id,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addScientist({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => console.log(error),
    });
  };

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    toast.success("Scientist added successfully");
    // clear inputs
    setAddress("");
    setId("");
    setAadharId("");
    fetchScientist();
  }

  const renderScientist = () =>
    sci.map((item, index) => (
      <div className="p-2" key={index}>
        <ScientistItem item={item} />
      </div>
    ));

  return (
    <>
      <Navbar />
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
          <div className="max-w-5xl mx-auto pt-20">
            {/* Register Scientist Header */}
            <Card className="bg-white  shadow-md p-3">
              <div className="flex flex-col items-center">
                <Typography variant="h1" className="pt-8 pb-5">
                  Register a new Scientist
                </Typography>
                <Button onClick={toggleOpen} className="mb-4">
                  {open ? "Close Form" : "Add Scientist"}
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
              <Card className="bg-white rounded-xl shadow-md p-6  mx-auto">
                <form
                  className="mt-2 w-80 max-w-screen-lg sm:w-96 mx-auto"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-2">
                      Address
                    </Typography>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      size="lg"
                      placeholder="0x..."
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{ className: "before:content-none after:content-none" }}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-2">
                      Scientist ID
                    </Typography>
                    <Input
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      size="lg"
                      placeholder="Unique ID"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{ className: "before:content-none after:content-none" }}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-2">
                      Aadhaar Number
                    </Typography>
                    <Input
                      value={aadharId}
                      onChange={(e) => setAadharId(e.target.value)}
                      type="text"
                      size="lg"
                      placeholder="XXXX-XXXX-XXXX"
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{ className: "before:content-none after:content-none" }}
                    />
                  </div>
                  <Checkbox
                    label={
                      <Typography variant="small" color="gray" className="flex items-center font-normal">
                        I agree to the
                        <a href="#" className="font-medium transition-colors hover:text-gray-900">
                          &nbsp;Terms and Conditions
                        </a>
                      </Typography>
                    }
                    containerProps={{ className: "-ml-2.5" }}
                  />
                  <Button type="submit" className="mt-6" fullWidth>
                    Add Scientist
                  </Button>
                </form>
              </Card>
            </Collapse>

            {/* Info Card */}
            <Card className="bg-white rounded-xl mt-8 mb-8 shadow-md p-6">
              <Typography variant="paragraph">
                Kvk Manager, also referred to as the admin of this permissioned blockchain, is solely responsible for managing access and modifying chain data.
He authorizes users by adding their wallet address and Aadhaar number.
              </Typography>
            </Card>

            {/* Fetch Scientist Section
            <Card className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-center">
                <Typography variant="h1">FETCH SCIENTIST</Typography>
              </div>
              <Typography variant="paragraph" className="py-4">
                Click below to load all registered scientists from the blockchain.
              </Typography>
              <Button
                fullWidth
                ripple={true}
                onClick={fetchScientist}
                className="mx-4 my-2"
              >
                Fetch
              </Button>

            
              <List className="my-2 p-0">
                 <Card className="bg-white rounded-xl shadow-md p-6">
                {isFetching ? <p>Loading...</p> : sci.length > 0 ? renderScientist() : <p>No scientists fetched yet</p>}
                 </Card>
              </List>
               
              </Card> */}
          </div>
          <ToastContainer />
        </div>
      </Layout>
    </>
  );
}
