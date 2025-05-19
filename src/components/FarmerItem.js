import {
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Button,
  Dialog,
  CardBody,
  CardHeader,
  Spinner,
} from "@material-tailwind/react";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import BN from "bn.js";
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function FarmerItem({ item }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_farmer",
    params: {
      _user: item,
    },
  });

  function hexToDec(hexValue) {
    if (hexValue) {
      const decimalNumber = new BN(hexValue.substring(2), 16).toString();
      return decimalNumber;
    }
    return "0";
  }

  const handleOpen = async () => {
    setLoading(true);
    await fetch();
    setLoading(false);
    setOpen(!open);
  };

  return (
    <>
      <ListItem className="border-b border-gray-200 py-4 items-center">
        <ListItemPrefix>
          <Avatar
            src="farmer1.png"
            alt="farmer"
            size="md"
            variant="circular"
          />
        </ListItemPrefix>
        <div className="flex flex-col ml-3">
          <Typography variant="h6" color="blue-gray">
            {item}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            Farmer
          </Typography>
        </div>
        <Button
          onClick={handleOpen}
          variant="text"
          className="ml-auto p-2 text-green-500 hover:bg-blue-50"
        >
          <EyeIcon className="h-5 w-5" />
        </Button>
      </ListItem>

      <Dialog open={open} handler={handleOpen} size="lg" className="p-3">
        <Card className="w-full">
          <CardHeader
            floated={false}
            shadow={false}
            className="bg-green-100 flex justify-between items-center p-4"
          >
            <Typography variant="h5" color="blue-gray">
              Farmer Details
            </Typography>
            <Button
              onClick={handleOpen}
              variant="text"
              className="text-red-500 hover:bg-red-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </CardHeader>

          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="flex flex-col gap-2">
              <Typography variant="small" className="font-semibold">
                Address:
              </Typography>
              <Typography>{data?.farmer_add}</Typography>

              <Typography variant="small" className="font-semibold mt-4">
                Stats:
              </Typography>
              <Typography>
                Level: {hexToDec(data?.level?._hex)} <br />
                Authority Points: {hexToDec(data?.auth_points?._hex)} <br />
                Aadhar ID: {hexToDec(data?.adhar_id?._hex)} <br />
                CRC: {hexToDec(data?.correctReportCount?._hex)}
              </Typography>

              <Typography variant="small" className="font-semibold mt-4">
                Images:
              </Typography>
              <Typography>
                Uploaded: {data?.images_upload?.length || 0} <br />
                Verified: {data?.image_VR?.length || 0}
              </Typography>
            </div>

            <div className="flex justify-center items-center">
              <Avatar
                src="farmer1.png"
                alt="farmer"
                size="xxl"
                variant="rounded"
                className="w-40 h-40"
              />
            </div>
          </CardBody>
        </Card>

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
            <Spinner className="h-10 w-10 text-green-500" />
          </div>
        )}
      </Dialog>
    </>
  );
}
