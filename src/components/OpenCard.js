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
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";
import console from "console-browserify";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useUser } from "../context/UserContext";

export default function OpenCard({ item }) {
  const { role } = useUser();
  const [open, setOpen] = useState(false);
  const [solution, setSolution] = useState("");
  const [output, setOutput] = useState(null);

  const { runContractFunction: updateSolution } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "review_image",
    params: {
      _url: item,
      _solution: solution,
    },
  });

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_open_output",
    params: { _url: item },
  });

  const handleOpen = async () => {
    await fetch();
    setOpen(!open);
  };

  const handleSubmit = async () => {
    await updateSolution({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => {
        console.error(error);
        toast.error("Submission failed!");
      },
    });
  };

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    toast.success("Solution updated successfully!");
    setSolution("");
    setOpen(false);
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">

        <CardHeader floated={false} className="h-48">
          <img
            src={item}
            alt="Uploaded"
            className="h-full w-full object-cover rounded"
          />
        </CardHeader>
        
        <CardFooter className="flex justify-center">
          
          {role === "Scientist" && (
          <Button onClick={handleOpen} variant="gradient" fullWidth>
            Review
          </Button>)}
        </CardFooter>
      </Card>

      <Dialog
        open={open}
        size="lg"
        handler={handleOpen}
        className="max-h-[90vh] overflow-y-auto"
      >
        {data ? (
          <>
            <DialogHeader>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                 Owner:
                </Typography>
                <Typography variant="paragraph" className="bg-gray-100 p-3 rounded">
                  {data.owner}
                </Typography>
              
              </div>
            </DialogHeader>
            <DialogBody className="space-y-4">
              <img
                src={item}
                alt="Image"
                className="w-full max-h-[300px] object-cover rounded-lg border"
              />
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  AI Suggested Solution:
                </Typography>
                <Typography variant="paragraph" className="bg-gray-100 p-3 rounded">
                  {data.AI_sol}
                </Typography>
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Your Solution:
                </Typography>
                <Textarea
                  label="Enter your solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={4}
                  className="bg-white"
                />
              </div>
            </DialogBody>
            <DialogFooter className="justify-end space-x-2">
              <Button variant="text" color="gray" onClick={handleOpen}>
                Cancel
              </Button>
              <Button variant="gradient" color="blue" onClick={handleSubmit}>
                Submit
              </Button>
            </DialogFooter>
          </>
        ) : (
          <DialogBody className="flex justify-center items-center h-48">
            <Typography variant="h5" color="gray">
              Loading...
            </Typography>
          </DialogBody>
        )}
      </Dialog>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}
