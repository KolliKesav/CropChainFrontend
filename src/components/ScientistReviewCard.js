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
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function ScientistReviewCard({ item }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState();
  const [showRemainingImages, setShowRemainingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = async () => {
    handleButtonClick();
    setOpen(!open);
  };
  
  const allImages = item?.split("$") || [];
  const firstImage = allImages[0];
  const secondImage = allImages[1];
  const remainingImages = allImages.slice(2);

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_output",
    params: { _url: item },
  });

  const { runContractFunction: verifySolution } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "verify_image",
    params: { _url: item, _choice: choice },
  });

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    toast("Voted");
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
    if (data) console.log(data);
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
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          <img
            src={firstImage}
            alt="card-image"
            className="h-full w-full object-cover"
          />
        </div>
        <CardBody className="py-2 px-6"></CardBody>
        <CardFooter className="px-6 pb-6 pt-0">
          <Button onClick={handleOpen} variant="gradient" fullWidth>
            Read More
          </Button>
        </CardFooter>
      </Card>

      {/* Main Dialog */}
      <Dialog
        open={open}
        size="lg"
        handler={handleOpen}
        className="max-h-[90vh] overflow-y-auto backdrop-blur-sm"
        style={{
          borderRadius: '1.5rem',
          boxShadow: '0 20px 60px -12px rgba(59, 130, 246, 0.15), 0 8px 32px -8px rgba(139, 92, 246, 0.1)',
          background: 'linear-gradient(135deg, #fefefe 0%, #f8fafc 30%, #f1f5f9 70%, #e2e8f0 100%)',
          border: '1px solid rgba(59, 130, 246, 0.1)',
        }}
      >
        {data ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-violet-50/30 to-cyan-50/40 rounded-3xl pointer-events-none"></div>
            
            <DialogBody className="space-y-6 px-8 py-6 relative z-10 overflow-x-hidden">
              

              {/* Enhanced Images Section */}
              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-cyan-200/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Typography variant="h5" className="text-slate-800 font-bold tracking-tight">
                    Uploaded Images
                  </Typography>
                </div>
                
                <div className="grid grid-cols-2 w-full gap-6">
                  <div
                    onClick={() => setSelectedImage(firstImage)}
                    className="group cursor-pointer relative w-full h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1"
                  >
                    <img
                      src={firstImage}
                      className="w-full h-full object-cover border-2 border-white/70"
                      alt="first-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-transparent to-blue-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>
                  
                  {secondImage && (
                    <div className="relative">
                      <div
                        onClick={() => setSelectedImage(secondImage)}
                        className="group cursor-pointer relative w-full h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-1"
                      >
                        <img
                          src={secondImage}
                          className="w-full h-full object-cover border-2 border-white/70"
                          alt="second-image"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-transparent to-blue-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                      </div>
                      
                      {remainingImages.length > 0 && (
                        <button
                          className="absolute bottom-2 right-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                          onClick={() => setShowRemainingImages(true)}
                        >
                          +{remainingImages.length} more
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced Info Section */}
                {(data.title || data.description || data.location) && (
                  <div className="mt-6 bg-white/85 backdrop-blur-sm p-5 rounded-xl border border-cyan-200/40 shadow-inner space-y-3">
                    {data.title !== " " && (
                      <p className="text-slate-700 flex items-center gap-2">
                        <strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                          <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Title:
                        </strong>
                        <span className="text-base font-medium">{data.title}</span>
                      </p>
                    )}
                    {data.description !== " " && (
                      <p className="text-slate-700 flex items-start gap-2">
                        <strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Description:
                        </strong>
                        <span className="text-base font-medium">{data.description}</span>
                      </p>
                    )}
                    {data.location !== " " && (
                      <p className="text-slate-700 flex items-center gap-2">
                        <strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Location:
                        </strong>
                        <span className="text-base font-medium">{data.location}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Enhanced Owner Section */}
              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-5 rounded-2xl shadow-xl border border-white/30 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <Typography variant="h5" className="text-slate-800 font-bold tracking-tight drop-shadow-sm">
                    Owner Information
                  </Typography>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-inner border border-white/50">
                  <Typography variant="paragraph" className="text-slate-700 font-medium break-all">
                    {data.owner}
                  </Typography>
                </div>
              </div>

              {/* Enhanced AI Diagnosis Section */}
              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-emerald-200/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <Typography variant="h5" className="text-slate-800 font-bold tracking-tight">
                    AI Diagnosis
                  </Typography>
                </div>
                <div className="bg-white/85 backdrop-blur-sm p-5 rounded-xl shadow-inner border border-emerald-200/40 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
                  <Typography variant="paragraph" className="text-slate-700 leading-relaxed text-base font-medium">
                    {data.AI_sol}
                  </Typography>
                </div>
              </div>

              {/* Enhanced Reviewer Solution Section */}
              {data.reviewer_sol && data.reviewer_sol.trim() !== "" && (
                <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-purple-200/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <Typography variant="h5" className="text-slate-800 font-bold tracking-tight">
                      Your Review
                    </Typography>
                  </div>
                  <div className="bg-white/85 backdrop-blur-sm p-5 rounded-xl shadow-inner border border-purple-200/40 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400"></div>
                    <Typography variant="paragraph" className="text-slate-700 leading-relaxed text-base font-medium">
                      {data.reviewer_sol}
                    </Typography>
                  </div>
                </div>
              )}

              
               
            </DialogBody>
          </>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/40 via-blue-50/30 to-indigo-50/40 rounded-2xl pointer-events-none"></div>
            <DialogBody className="p-8 text-center text-slate-600 relative z-10">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <Typography variant="h6" className="text-slate-700">
                  Loading...
                </Typography>
              </div>
            </DialogBody>
          </div>
        )}
      </Dialog>

      {/* Enhanced Remaining Images Dialog */}
      <Dialog
        size="xl"
        open={showRemainingImages}
        handler={() => setShowRemainingImages(false)}
        className="backdrop-blur-sm"
        style={{
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)'
        }}
      >
        <div className="bg-gradient-to-br from-white via-cyan-50/50 to-blue-50 rounded-2xl shadow-2xl border border-cyan-200/60">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <Typography variant="h4" className="text-slate-800 font-bold">
                Remaining Images
              </Typography>
            </div>
          </DialogHeader>
          <DialogBody className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto p-8">
            {remainingImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img)}
                className="group cursor-pointer transform hover:scale-110 hover:-rotate-2 transition-all duration-300"
              >
                <img
                  src={img}
                  className="w-full h-48 object-cover rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl group-hover:border-cyan-300 transition-all duration-300"
                  
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </DialogBody>
        </div>
      </Dialog>

      {/* Enhanced Full Image View */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-2xl font-bold z-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white/30"
            />
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}