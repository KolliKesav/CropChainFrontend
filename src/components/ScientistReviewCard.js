import {
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import console from "console-browserify";
import { useWeb3Contract, useMoralis } from "react-moralis";
import Upload from "../utils/Upload.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function ScientistReviewCard({ item }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState();

  const handleOpen = async () => {
    handleButtonClick();
    setOpen(!open);
  };

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_close_output",
    params: {
      _url: item,
    },
  });

  const { runContractFunction: verifySolution } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "verify_image",
    params: {
      _url: item,
      _choice: choice,
    },
  });

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    toast("voted");
  }

  const handleVerify = async () => {
    await verifySolution({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => console.log(error),
    });
  };

  const handleButtonClick = async () => {
    await fetch();
    console.log("Fetching in process ");
    if (data) {
      console.log(data);
    }
  };

  const handleVote = async (vote) => {
    setChoice(vote);
  };

  useEffect(() => {
    if (choice !== undefined) {
      handleVerify();
    }
  }, [choice]);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <div className="relative h-48 rounded-t-lg overflow-hidden">
        <img src={item} alt="card-image" className="h-full w-full object-cover" />
      </div>
      <CardBody className="py-2 px-6">
        
      </CardBody>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button onClick={handleOpen} variant="gradient" fullWidth>
          Read More
        </Button>

        <Dialog open={open} size="lg" handler={handleOpen}>
          {data ? (
            <div className="p-4">
              <DialogHeader className="flex flex-col items-start gap-1 border-b pb-2">
                <Typography variant="h5" color="blue-gray">
                  Owner: {data.owner}
                </Typography>
              </DialogHeader>

              <DialogBody className="grid gap-6 max-h-[70vh] overflow-y-auto mt-4">
                <img
                  src={item}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  alt="card-image"
                />

                <div className="space-y-4">
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      AI Diagnosis:
                    </Typography>
                    <Typography color="gray">{data.AI_sol}</Typography>
                  </div>

                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Your Review:
                    </Typography>
                    <Typography color="gray">{data.reviewer_sol}</Typography>
                  </div>
                </div>
              </DialogBody>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          )}
        </Dialog>
      </CardFooter>
      <ToastContainer />
    </Card>
  );
}
