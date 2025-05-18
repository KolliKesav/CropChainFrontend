import {
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import console from "console-browserify";
import { useWeb3Contract, useMoralis } from "react-moralis";
import Upload from "../utils/Upload.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import BN from "bn.js";

export default function FinalCard({ item }) {
  const [open, setOpen] = useState(false);

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_final_output",
    params: {
      _url: item,
    },
  });

  function hexToDec(hexValue) {
    if (hexValue) {
      const decimalNumber = new BN(hexValue.substring(2), 16).toString();
      return decimalNumber;
    }
  }

  const handleButtonClick = async () => {
    await fetch();
    console.log("Fetching in process ");
    if (data) {
      console.log(data);
    }
  };

  const handleOpen = async () => {
    handleButtonClick();
    setOpen(!open);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 ">
      <div color="blue-gray" className="h-44">
        <img src={item} alt={`Image `} className=" w-full h-full object-cover rounded " />
      </div>
     
      <CardFooter className="pt-5">
        <Button onClick={handleOpen} variant="gradient" fullWidth>
          Open
        </Button>

     <Dialog open={open} handler={handleOpen} size="xl" className="overflow-y-auto">
  <Card className="max-h-[90vh] overflow-hidden">
    {/* Header */}
    <DialogHeader className="bg-blue-200 text-gray-800">
      Image Details
    </DialogHeader>

    {/* Scrollable Body */}
    <DialogBody className="overflow-y-auto max-h-[70vh] p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Image (Fixed Height) */}
        <div className="w-full md:w-1/2 flex justify-center items-start">
          <img
            src={item}
            alt="Uploaded"
            className="max-h-[400px] w-auto object-contain border border-gray-300 shadow"
          />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 overflow-y-auto">
          {data ? (
            <>
              <p className=" font-bold">Owner Address:</p>
              <p className="mb-4 break-words text-gray-700">{data.owner}</p>

              <p className=" font-bold">Stats:</p>
              <div className="text-gray-700 mb-2">
                <p ><strong className="font-bold">AI Solution:</strong> {data.AI_sol}</p>
                <p><strong className="font-bold">Reviewer Solution:</strong> {data.reviewer_sol}</p>
                <p><strong className="font-bold">Reviewer:</strong> {data.reviewer}</p>
                <p><strong className="font-bold">Verification Count:</strong> {hexToDec(data.verificationCount?._hex)}</p>
                <p><strong className="font-bold">OK:</strong> {hexToDec(data.true_count?._hex)}</p>
                <p><strong className="font-bold">NOT OK:</strong> {hexToDec(data.false_count?._hex)}</p>
              </div>

              <p className=" font-bold mt-4">Verified Image URL:</p>
              <p className="text-gray-700 break-words">{item}</p>
            </>
          ) : (
            <div className="text-center text-gray-500">Loading...</div>
          )}
        </div>
      </div>
    </DialogBody>

    {/* Footer */}
    <DialogFooter className="justify-end">
      <Button variant="outlined" color="blue-gray" onClick={handleOpen}>
        Close
      </Button>
    </DialogFooter>
  </Card>
</Dialog>






      </CardFooter>
      <ToastContainer />
    </Card>
  );
}
