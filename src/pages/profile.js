import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import Navbar from "../components/Navbar";
import { Circles } from "react-loader-spinner";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import { User, Award, Camera, CheckCircle, Coins, Eye, EyeOff } from "lucide-react";
import { Button } from "web3uikit";

export default function Profile() {
  const { walletAddress, role, hydrated } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [auth, setAuth] = useState(0);
  const { runContractFunction } = useWeb3Contract();

  const navigate = useNavigate();
  const location = useLocation();

  const { runContractFunction: getFarmerData } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_farmer",
    params: { _user: walletAddress },
  });

  const { runContractFunction: getScientistData } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_scientist",
    params: { _user: walletAddress },
  });

  const handleRedeem = async () => {
    await runContractFunction({
      params: {
        abi: Upload.abi,
        contractAddress: process.env.REACT_APP_CONTRACT,
        functionName: "payUser",
        params: {
          user: walletAddress,
        },
      },
      onSuccess: () => {
        toast.success("Successfully redeemed auth points!");
        setAuth(0);
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message || "Redeem failed");
      },
    });
  };
const fetchProfile = async () => {
      try {
        let res = null;
        if (role === "Farmer") {
          res = await getFarmerData();
          if (res) {
            setProfileData({ ...res, role: "Farmer" });
            setAuth(res.auth_points);
          }
        } else if (role === "Scientist") {
          res = await getScientistData();
          if (res) {
            setProfileData({ ...res, role: "Scientist" });
            setAuth(res.auth_points);
          }
        } else if (role === "Manager") {
          setProfileData({
            role: "Manager",
            address: walletAddress,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    if (!hydrated || !role || !walletAddress) return;
    fetchProfile();
  }, [walletAddress, role, getFarmerData, getScientistData, hydrated]);

  const getRoleImage = (role) => {
    switch (role) {
      case "Farmer":
        return "farmer1.png";
      case "Scientist":
        return "scientist.png";
      case "Manager":
        return "manager.jpeg";
      default:
        return null;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Farmer":
        return "from-green-800 to-green-500";
      case "Scientist":
        return "from-blue-400 to-indigo-500";
      case "Manager":
        return "from-purple-400 to-violet-500";
      default:
        return "from-gray-400 to-slate-500";
    }
  };

  const renderImageGrid = (title, imageString) => {
    if (!imageString || imageString.length === 0) return null;

    const groups = imageString.split("$$$").filter(Boolean);
    const isExpanded = expandedSections[title] || false;

    const toggleSection = () => {
      setExpandedSections((prev) => ({
        ...prev,
        [title]: !isExpanded,
      }));
    };

    const visibleGroups = isExpanded ? groups : groups.slice(0, 8);

    return (
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
            {groups.length}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {visibleGroups.map((group, index) => {
            const images = group.split("$").filter(Boolean);
            const first = images[0];
            const remaining = images.length - 1;

            return (
              <div key={index} className="relative group">
                <img
                  src={first}
                  alt={`${title} ${index}`}
                  className="w-[90%] h-36 object-cover rounded-lg shadow-sm border border-slate-200 transition-transform group-hover:scale-105"
                />
                {remaining > 0 && (
                  <button
                    onClick={() => {
                      setModalImages(images);
                      setOpenModal(true);
                    }}
                    className="absolute bottom-2 right-8 bg-slate-900 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full shadow-lg hover:bg-opacity-90 transition-all"
                  >
                    +{remaining}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {groups.length > 8 && (
          <div className="text-center mt-4">
            <button
              onClick={toggleSection}
              className="flex items-center gap-1 mx-auto text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isExpanded ? "Show Less" : `Show ${groups.length - 8} more`}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 px-4 py-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center z-[1] gap-6">
                {profileData?.role && (
                  <div className="">
                    <div className={` z-[1]  -inset-1 bg-gradient-to-r ${getRoleColor(profileData.role)} rounded-full blur opacity-75`}></div>
                    <img
                      src={getRoleImage(profileData.role)}
                      alt={`${profileData.role} avatar`}
                      className=" w-24 h-24 z-[1] object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                )}
                
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <User className="w-6 h-6 text-slate-600" />
                    <h1 className="text-3xl font-bold text-slate-800">User Profile</h1>
                  </div>
                  <p className="text-slate-600 text-lg">
                    Welcome back, <span className="font-semibold">{profileData?.role || 'User'}</span>
                  </p>
                </div>
              </div>
            </div>

            {loading || !profileData ? (
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-20">
                <div className="flex flex-col gap-4 justify-center items-center">
                  <Circles
                    height="60"
                    width="60"
                    color="#3b82f6"
                    ariaLabel="circles-loading"
                    visible={true} 
                  />
                <button
  onClick={fetchProfile}
  className="
    px-4 py-2 
    border border-gray-800 
    text-gray-800 text-sm font-medium 
    rounded-lg 
    bg-transparent 
    hover:bg-gray-800 hover:text-white 
    transition-colors duration-200
  "
>
  Fetch Profile
</button>


                </div>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Basic Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">Account Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600">Role:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(profileData.role)} text-white`}>
                          {profileData.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <span className="text-slate-600">Wallet:</span>
                        <span className="font-mono text-sm text-slate-800 break-all">
                          {walletAddress}
                        </span>
                      </div>
                    </div>
                    
                    {(profileData.role === "Farmer" || profileData.role === "Scientist") && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-slate-600">Aadhaar ID:</span>
                          <span className="font-semibold text-slate-800">
                            {profileData.adhar_id?.toString()}
                          </span>
                        </div>
                        {profileData.role === "Scientist" && (
                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-slate-600">Scientist ID:</span>
                            <span className="font-semibold text-slate-800">
                              {profileData.scientist_id?.toString()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Cards */}
                {(profileData.role === "Farmer" || profileData.role === "Scientist") && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                          <Coins className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Auth Points</p>
                          <p className="text-2xl font-bold text-slate-800">{auth.toString()}</p>
                        </div>
                      </div>
                      {auth > 0 && profileData.role === "Scientist" && (
                        <button
                          onClick={handleRedeem}
                          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                        >
                          Redeem Points
                        </button>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Correct Reports</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {profileData.correctReportCount?.toString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Level</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {profileData.level?.toString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manager Special Message */}
                {profileData.role === "Manager" && (
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">KVK Manager Access</h3>
                    <p className="text-purple-100">
                      You are logged in as the contract owner with full administrative privileges.
                    </p>
                  </div>
                )}

                {/* Image Galleries */}
                <div className="space-y-6">
                  {profileData.role === "Farmer" && (
                    <>
                      {renderImageGrid("Uploaded Images", profileData.images_upload)}
                      {renderImageGrid("Verified Images", profileData.image_VR)}
                    </>
                  )}

                  {profileData.role === "Scientist" && (
                    <>
                      {renderImageGrid("Reviewed Images", profileData.image_rvd)}
                      {renderImageGrid("Verified Images", profileData.image_VR)}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Modal */}
        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Image Gallery
                </h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <span className="text-2xl text-slate-500 hover:text-slate-700">×</span>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {modalImages.map((img, i) => (
                    <div key={i} className="group relative">
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200 shadow-sm transition-transform group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}