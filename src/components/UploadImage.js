import React, { useRef, useState } from "react";
import axios from "axios";
import { Button, Typography } from "@material-tailwind/react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import Upload from "../utils/Upload.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadImage() {
  const { account } = useMoralis();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [ipfsUrlString, setIpfsUrlString] = useState("");
  const [solution, setSolution] = useState("This is a Plant disease named x and the solution is as follows");
  const fileInputRef = useRef();
  const { runContractFunction } = useWeb3Contract();
  const [waitingForSignature, setWaitingForSignature] = useState(false);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    
    const newFiles = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = null;
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const removeFile = (index) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImagesToBlockchain = async () => {
    if (files.length === 0) return toast.error("Please select at least one image.");
    if (!account) return toast.error("Wallet not connected.");

    setLoading(true);
    setWaitingForSignature(true);
    try {
      const urlList = [];

      for (let { file } of files) {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
              pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        urlList.push(ipfsUrl);
      }

      const finalUrlString = urlList.join("$");
      setIpfsUrlString(finalUrlString);

      await runContractFunction({
        params: {
          abi: Upload.abi,
          contractAddress: process.env.REACT_APP_CONTRACT,
          functionName: "upload_image",
          params: {
            _user: account,
            _url: finalUrlString,
             _title: title || " ",           
            _description: description || " ",
            _location: location || " ",

          },
        },
        onSuccess: async (tx) => {
          setWaitingForSignature(false);
          setWaitingForConfirmation(true);
          toast.info("Uploading image hash to blockchain...");
          await tx.wait(1);
          setWaitingForConfirmation(false);
          toast.success("Image uploaded and saved on blockchain.");
         // setStep(2);
           setDescription("");
          setTitle("");
          setLocation("");
          setFiles([]);
        },
        onError: (err) => {
          console.error("Upload call failed:", err);
          setWaitingForSignature(false);
          setWaitingForConfirmation(false);
          toast.error("Image upload transaction failed.");
        },
      });
    } catch (err) {
      console.error("IPFS upload failed:", err);
      toast.error("Image upload failed.");
      setWaitingForSignature(false);
      setWaitingForConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const submitAISolution = async () => {
    if (!account || !ipfsUrlString) {
      toast.error("Please upload images first.");
      return;
    }

    setLoading(true);
    setWaitingForSignature(true);

    try {
      await runContractFunction({
        params: {
          abi: Upload.abi,
          contractAddress: process.env.REACT_APP_CONTRACT,
          functionName: "AI_solution",
          params: {
            _url: ipfsUrlString,
            _solution: solution,
          },
        },
        onSuccess: async (tx2) => {
          setWaitingForSignature(false);
          setWaitingForConfirmation(true);
          toast.info("Submitting AI analysis...");
          await tx2.wait(1);
          setWaitingForConfirmation(false);
          toast.success("AI analysis submitted successfully.");
          setFiles([]);
          setDescription("");
          setTitle("");
          setLocation("");
          setStep(1);
        },
        onError: (err) => {
          console.error("AI call failed:", err);
          setWaitingForSignature(false);
          setWaitingForConfirmation(false);
          toast.error("AI transaction failed.");
        },
      });
    } catch (err) {
      console.error("AI step error:", err);
      toast.error("Failed to submit AI solution.");
      setWaitingForSignature(false);
      setWaitingForConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-xl mx-auto">
      <Typography variant="h5" className="mb-4 text-center text-gray-800">
        Upload Plant Images (Step {step}/2)
      </Typography>
      <div className="mb-4">
  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full p-2 border border-gray-500 rounded mb-2"
  />
  <textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full p-2 border border-gray-500 rounded mb-2"
  />
  <input
    type="text"
    placeholder="Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="w-full p-2 border border-gray-500 rounded"
  />
</div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
      />

      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="w-24 h-24 relative rounded-md shadow-md overflow-hidden border border-gray-300"
          >
            <img src={file.preview} alt={`preview-${idx}`} className="object-cover w-full h-full" />
            <button
              onClick={() => removeFile(idx)}
              className="absolute top-1 right-1 bg-blue-gray-100 text-black text-xs px-1 py-0 rounded hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button
          onClick={triggerFileInput}
          className="bg-black text-white hover:bg-gray-800"
          disabled={loading}
        >
          + {files.length ? "Add More" : "Upload Images"}
        </Button>

        {step === 1 && (
          <Button
            onClick={uploadImagesToBlockchain}
            className="bg-green-700 text-white hover:bg-green-900 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Uploading Images...
              </>
            ) : (
              "Submit Images"
            )}
          </Button>
        )}

        {step === 2 && (
          <Button
            onClick={submitAISolution}
            className="bg-blue-700 text-white hover:bg-blue-900 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Submitting to AI...
              </>
            ) : (
              "Submit to AI"
            )}
          </Button>
        )}

       
        {waitingForSignature && (
          <Typography className="text-center text-gray-600 italic">
            Please confirm the transaction in MetaMask...
          </Typography>
        )}
        {waitingForConfirmation && (
          <Typography className="text-center text-gray-600 italic">
            Waiting for blockchain confirmation...
          </Typography>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
