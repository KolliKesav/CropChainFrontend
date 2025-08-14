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
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_output",
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
    if (data) {
      console.log(data);
    }
  };

  const handleOpen = async () => {
    handleButtonClick();
    setOpen(!open);
  };

  const imageParts = item?.split("$") || [];
  const firstImage = imageParts[0];
  const secondImage = imageParts[1];
  const remainingImages = imageParts.slice(2);
  const [selectedImage, setSelectedImage] = useState(null);


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
      <div color="blue-gray" className="h-44">
        <img
          src={firstImage}
          alt="Image"
          className="w-full h-full object-cover rounded"
        />
      </div>

      <CardFooter className="pt-5">
        <Button onClick={handleOpen} variant="gradient" fullWidth>
          Open
        </Button>

        {/* Main Dialog */}
        <Dialog open={open} handler={handleOpen} size="xl" className="overflow-y-auto">
          <Card className="max-h-[90vh] overflow-hidden">
            <DialogHeader className="bg-blue-200 text-gray-800">
              Image Details
            </DialogHeader>

            <DialogBody className="overflow-y-auto max-h-[70vh] p-6">
              <div className="flex flex-col md:flex-row gap-0">
                <div className="w-full md:w-1/2 flex flex-col gap-4 items-center">
                  {/* First Image */}
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt="First"
                      className="max-h-[220px] w-[60%] object-contain border border-gray-300 rounded-2xl shadow cursor-pointer"
                       onClick={() => setSelectedImage(firstImage)}
                    />
                  )}

                  {/* Second Image (if present) */}
                  {secondImage && (
                    <img
                      src={secondImage}
                      alt="Second"
                      className="max-h-[220px] w-[60%] object-contain border rounded-2xl border-gray-300 shadow"
                      onClick={() => setSelectedImage(secondImage)}
                    />
                  )}

                  {/* +N for remaining images */}
                  {remainingImages.length > 0 && (
                    <div className="relative cursor-pointer" onClick={() => setGalleryOpen(true)}>
                      <img
                        src={remainingImages[0]}
                        alt="More"
                        className="max-h-[200px] w-auto object-contain opacity-50 border border-gray-300 shadow"
                        onClick={() => setSelectedImage(remainingImages[0])}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-black bg-opacity-50 rounded">
                        +{remainingImages.length}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Metadata */}
                <div className="w-full md:w-1/2 overflow-y-auto">
                  {data ? (
                    <>
                      <p className="font-bold">Owner Address:</p>
                      <p className="mb-4 break-words text-gray-700">{data.owner}</p>
                {(data.title || data.description || data.location) && (
                      <div className="mb-2">
                        {data.title!==" " && <p><strong className="font-semibold">Title: </strong> {data.title}</p>}
                        {data.description!==" " && <p><strong className="font-semibold">Description:</strong> {data.description}</p>}
                        {data.location !==" " &&<p><strong className="font-semibold">Location: </strong>{data.location}</p>}
                      </div>
                 )}

                      <p className="font-bold">Stats:</p>
                      <div className="text-gray-700 mb-2">
                      <p><strong className="font-bold">AI Solution:</strong></p>
                      <p className="break-words text-justify">{data.AI_sol}</p>

                      <p><strong className="font-bold">Reviewer Solution:</strong></p>
                      <p className="break-words text-justify">{data.reviewer_sol}</p>

                      <p><strong className="font-bold">Reviewer:</strong></p>
                      <p className="break-words text-justify">{data.reviewer}</p>

                      <p><strong className="font-bold">Verification Count: </strong> {hexToDec(data.verificationCount?._hex)}</p>
                   

                      <p><strong className="font-bold">OK: </strong> {hexToDec(data.true_count?._hex)}</p>
                     

                      <p><strong className="font-bold">NOT OK: </strong> {hexToDec(data.false_count?._hex)}</p>
                      

                      </div>

                      <p className="font-bold mt-4">Verified Image URL:</p>
                      <p className="text-gray-700 break-words">{item}</p>
                    </>
                  ) : (
                    <div className="text-center text-gray-500">Loading...</div>
                  )}
                </div>
              </div>
            </DialogBody>

            <DialogFooter className="justify-end">
              <Button variant="outlined" color="blue-gray" onClick={handleOpen}>
                Close
              </Button>
            </DialogFooter>
          </Card>
          {selectedImage && (
       <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
          <div className="relative max-w-full max-h-full p-2">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-10"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className=" rounded-lg shadow-lg"
            />
          </div>
        </div>
       )}
        </Dialog>
        

        {/* Gallery Dialog */}
        <Dialog open={galleryOpen} handler={() => setGalleryOpen(false)} size="lg" className="overflow-y-auto">
          <DialogHeader>More Images</DialogHeader>
          <DialogBody className="flex flex-wrap gap-4 justify-center">
            {remainingImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Remaining ${idx}`}
                className="w-40 h-40 object-cover border shadow-md rounded"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </DialogBody>
          <DialogFooter>
            <Button variant="outlined" onClick={() => setGalleryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>

        <ToastContainer />
      </CardFooter>
    </Card>
  );
}
