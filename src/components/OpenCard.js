import {
  Dialog,
  Card,
  CardHeader,
  CardFooter,
  Typography,
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [dialog,setDialog]=useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const allParts = item?.split("$") || [];
  const firstImageUrl = allParts[0];
  const remainingImageUrls = allParts.slice(1);
  const remaining = Math.max(0, allParts.length - 2);
  const allImages = allParts;
  const [selectedImage, setSelectedImage] = useState(null);


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
    functionName: "display_output",
    params: { _url: item },
  });

  const handleOpen = async () => {
    await fetch();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSolution("");
  };

const handleDialogOpen = () => setDialog(true);
const handleDialogClose = () => setDialog(false);

  const handleSubmit = async () => {
    setLoading(true);
    await updateSolution({
      onSuccess: (tx) => handleSetOnSuccess(tx),
      onError: (error) => {
        console.error(error);
        toast.error("Submission failed!");
        if (mounted) setLoading(false);
      },
    });
  };

  async function handleSetOnSuccess(tx) {
    await tx.wait(1);
    toast.success("Solution updated successfully!");

    // Delay to avoid state update on unmounted component
    setTimeout(() => {
      if (mounted) {
        setLoading(false);
        handleClose();
      }
    }, 300);
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader
          floated={false}
          className="relative h-48 mb-5 cursor-pointer overflow-hidden"
          onClick={handleOpen}
        >
          <img
            src={firstImageUrl}
            alt="Uploaded"
            className="h-full w-full object-cover rounded"
          />
          {remainingImageUrls.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded" onClick={handleOpen}>
              +{remainingImageUrls.length} more
            </div>
          )}
        </CardHeader>
 {role === "Scientist" && (
        <CardFooter className="flex justify-center ">
         
            <Button onClick={handleOpen} variant="gradient" fullWidth>
              Review
            </Button>
         
        </CardFooter>
         )}
      </Card>

<Dialog
  open={open}
  size="lg"
  onClose={handleClose}
  className="max-h-[90vh] overflow-y-auto backdrop-blur-sm"
  style={{
    borderRadius: '1.5rem',
    boxShadow: '0 20px 60px -12px rgba(59, 130, 246, 0.15), 0 8px 32px -8px rgba(139, 92, 246, 0.1)',
    background: 'linear-gradient(135deg, #fefefe 0%, #f8fafc 30%, #f1f5f9 70%, #e2e8f0 100%)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
  }}
>
  {role === "Scientist" && data ? (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-violet-50/30 to-cyan-50/40 rounded-3xl pointer-events-none"></div>
      
      <DialogBody className="space-y-6 px-8 py-6 relative z-10 overflow-x-hidden">
        {/* Enhanced Owner Section */}
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-5 rounded-2xl shadow-xl border border-white/30 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/25 rounded-2xl flex bg-gradient-to-br from-cyan-400 to-blue-500 items-center justify-center shadow-lg backdrop-blur-sm">
              <svg className="w-6 h-6 text-white bg-gradient-to-br from-cyan-400 to-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {allImages.slice(0, 2).map((url, index) => (
            <div key={index} onClick={() => setSelectedImage(url) } className="group cursor-pointer relative w-full h-40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-rotate-1">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover border-2 border-white/70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-transparent to-blue-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
                
              
            </div>
          ))}
          {remaining > 0 && (
            <div
              onClick={handleDialogOpen}
              className="group relative w-full h-40 bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 rounded-2xl border-2 border-dashed border-cyan-300/70 flex items-center justify-center cursor-pointer hover:bg-gradient-to-br hover:from-cyan-200 hover:via-blue-200 hover:to-indigo-200 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-lg"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-cyan-600 group-hover:text-cyan-700 transition-colors">+{remaining} more</span>
              </div>
            </div>
          )}
          </div>
          
          {(data.title || data.description || data.location) && (
          <div className="mt-6 bg-white/85 backdrop-blur-sm p-5 rounded-xl border border-cyan-200/40 shadow-inner space-y-3">
            {data.title!==" " && <p className="text-slate-700 flex items-center gap-2"><strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>Title:</strong> <span className="text-base font-medium">{data.title}</span></p>}
            {data.description!==" " && <p className="text-slate-700 flex items-start gap-2"><strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Description:</strong> <span className="text-base font-medium">{data.description}</span></p>}
            {data.location!==" " &&<p className="text-slate-700 flex items-center gap-2"><strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Location:</strong> <span className="text-base font-medium">{data.location}</span></p>}
          </div>
        )}
        </div>

        {/* Enhanced Dialog for all images */}
        <Dialog open={dialog} onClose={handleDialogClose} size="xl" className="backdrop-blur-sm" style={{borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)'}}>
          <div className="bg-gradient-to-br from-white via-cyan-50/50 to-blue-50 rounded-2xl shadow-2xl border border-cyan-200/60">
            <DialogBody className="space-y-6 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <Typography variant="h4" className="text-slate-800 font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  All Uploaded Images
                </Typography>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
               {allImages.map((url, index) => (
              <div key={index} onClick={() => setSelectedImage(url)} className="group cursor-pointer transform hover:scale-110 hover:-rotate-2 transition-all duration-300">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-60 h-40 rounded-xl border-2 border-white shadow-lg hover:shadow-2xl group-hover:border-cyan-300 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
              ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="filled"
                  onClick={handleDialogClose}
                  className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                >
                  Close Gallery
                </Button>
              </div>
            </DialogBody>
          </div>
        </Dialog>

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

        {/* Enhanced AI Solution Section */}
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-emerald-200/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <Typography variant="h5" className="text-slate-800 font-bold tracking-tight">
              AI Suggested Solution
            </Typography>
            
          </div>
          <div className="bg-white/85 backdrop-blur-sm p-5 rounded-xl shadow-inner border border-emerald-200/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
            <Typography variant="paragraph" className="text-slate-700 leading-relaxed text-base font-medium">
              {data.AI_sol}
            </Typography>
          </div>
        </div>

        {/* Enhanced Your Solution Section */}
        <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-rose-200/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <Typography variant="h5" className="text-slate-800 font-bold tracking-tight">
              Your Solution
            </Typography>
           
          </div>
          <Textarea
            label="Enter your solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={4}
            className="bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-rose-300 transition-all duration-300 rounded-xl border-rose-200/50 shadow-inner"
          />
        </div>
      </DialogBody>

      <DialogFooter className="flex flex-row gap-4 pt-4 pb-6 px-8 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 rounded-b-2xl border-t border-blue-200/30">
        <Button 
          variant="outlined" 
          onClick={handleClose}
          className="px-8 py-3 rounded-xl font-semibold border-2 border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shadow-lg"></div>
              Submitting...
            </div>
          ) : "Submit "}
        </Button>
      </DialogFooter>
    </>
  ) : (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/40 via-blue-50/30 to-indigo-50/40 rounded-2xl pointer-events-none"></div>
      
      <DialogBody className="space-y-6 px-8 py-6 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <Typography variant="h4" className="text-slate-800 font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Uploaded Images
          </Typography>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-6">
          {allImages.map((url, index) => (
            <div key={index} className="group transform hover:scale-110 hover:-rotate-1 transition-all duration-300 relative">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                onClick={() => setSelectedImage(url)}
                className="w-72 h-40 rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl group-hover:border-cyan-300 cursor-pointer transition-all duration-300"
              />
              <div className="absolute inset-0  group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
            </div>
          ))}
        </div>

        {(data&&(data.title || data.description || data.location)) && (
          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border border-cyan-200/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
            <div className="bg-white/85 backdrop-blur-sm p-5 rounded-xl shadow-inner space-y-3">
              {data.title!==" " && <p className="text-slate-700 flex items-center gap-2"><strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>Title:</strong> <span className="text-base font-medium">{data.title}</span></p>}
              {data.description!==" " && <p className="text-slate-700 flex items-start gap-2"><strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Description:</strong> <span className="text-base font-medium">{data.description}</span></p>}
              {data.location !==" " &&<p className="text-slate-700 flex items-center gap-2"><strong className="font-bold text-slate-800 text-sm uppercase tracking-wide flex items-center gap-2"><svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>Location:</strong> <span className="text-base font-medium">{data.location}</span></p>}
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-6">
          <Button 
            variant="filled"
            onClick={handleClose}
            className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
          >
            Close
          </Button>
        </div>
        
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
      </DialogBody>
    </div>
  )}
</Dialog>
    </>
  );
}