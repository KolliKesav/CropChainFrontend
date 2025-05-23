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
  Input,
  Textarea,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import console from "console-browserify";
import { useWeb3Contract, useMoralis } from "react-moralis";
import Upload from "../utils/Upload.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function CloseCard({ item }) {
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
    <Card className="w-full  max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <div color="blue-gray" className="relative h-48">
        <img src={item} alt="card-image" className="h-full w-full object-cover rounded" />
      </div>
      <CardBody></CardBody>
      <CardFooter className="pt-0">
        <Button onClick={handleOpen} variant="gradient" fullWidth>
          Read More
        </Button>

        <Dialog open={open} size="lg" handler={handleOpen}>
  {data ? (
    <div className="p-4">
      <DialogHeader className="flex flex-col items-start">
        <Typography variant="h6" color="blue-gray" className="mb-2">
                 Owner:
                </Typography>
                <Typography variant="paragraph" className="bg-gray-100 p-3 rounded">
                  {data.owner}
                </Typography>
      </DialogHeader>

      <DialogBody className="grid gap-6 max-h-[70vh] overflow-y-auto">
        <img
          src={item}
          className="w-full h-64 object-cover rounded-lg shadow"
          alt="card-image"
        />

        <div className="space-y-2">
          <Typography variant="h6" color="blue-gray">
            AI Diagnosis:
          </Typography>
          <Typography color="blue-gray">{data.AI_sol}</Typography>

          <Typography variant="h6" color="blue-gray">
            Scientist Review:
          </Typography>
          <Typography color="blue-gray">{data.reviewer_sol}</Typography>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-4">
        <Button
          variant="outlined"
          color="green"
          onClick={() => handleVote(true)}
        >
          OK
        </Button>
        <Button
          variant="outlined"
          color="red"
          onClick={() => handleVote(false)}
        >
          Not OK
        </Button>
      </DialogFooter>
    </div>
  ) : (
    <div className="p-4 text-center">Loading...</div>
  )}
</Dialog>

      </CardFooter>
      <ToastContainer />
    </Card>
  );
}
