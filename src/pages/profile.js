import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import Navbar from "../components/Navbar";
import { Circles } from 'react-loader-spinner';
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";

export default function Profile() {
  const { walletAddress, role } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (!role || !walletAddress) return;

    const fetchProfile = async () => {
      try {
        let res = null;
        if (role === "Farmer") {
          res = await getFarmerData();
          if (res) setProfileData({ ...res, role: "Farmer" });
        } else if (role === "Scientist") {
          res = await getScientistData();
          if (res) setProfileData({ ...res, role: "Scientist" });
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

    fetchProfile();
  }, [walletAddress, role, getFarmerData, getScientistData]);

  const getRoleImage = (role) => {
    switch (role) {
      case "Farmer":
        return "farmer1.png";
      case "Scientist":
        return "scientist.png";
      case "Manager":
        return "/assets/roles/manager.png";
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <Layout>
        <div className="min-h-screen flex justify-center pt-24 px-4 py-10 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl flex flex-col md:flex-row gap-8">
            {/* Left: Profile Details */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-gray-700 border-l-4 border-green-500 pl-4">
                User Profile
              </h2>

              {loading || !profileData ? (
                <div className="flex justify-center items-center py-20">
                  <Circles
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    visible={true}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-4 text-gray-800">
                    <div><strong>Role:</strong> {profileData.role}</div>
                    <div><strong>Wallet:</strong>{walletAddress}</div>

                    {profileData.role === "Farmer" && (
                      <>
                        <div><strong>Aadhaar:</strong> {profileData.adhar_id?.toString()}</div>
                        <div><strong>Auth Points:</strong> {profileData.auth_points?.toString()}</div>
                        <div><strong>Correct Reports:</strong> {profileData.correctReportCount?.toString()}</div>
                        <div><strong>Level:</strong> {profileData.level?.toString()}</div>

                        <div className="mt-4">
                          <strong>Uploaded Images:</strong>
                          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 mt-2">
                            {profileData.images_upload?.map((img, i) => (
                              <li key={i}>
                                <img
                                  src={img}
                                  alt={`Uploaded ${i}`}
                                  className="w-full h-40 object-cover rounded-lg shadow"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4">
                          <strong>Verified Images:</strong>
                          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 mt-2">
                            {profileData.image_VR?.map((img, i) => (
                              <li key={i}>
                                <img
                                  src={img}
                                  alt={`Verified ${i}`}
                                  className="w-full h-40 object-cover rounded-lg shadow"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {profileData.role === "Scientist" && (
                      <>
                        <div><strong>Aadhaar:</strong> {profileData.adhar_id?.toString()}</div>
                        <div><strong>Scientist ID:</strong> {profileData.scientist_id?.toString()}</div>
                        <div><strong>Auth Points:</strong> {profileData.auth_points?.toString()}</div>
                        <div><strong>Correct Reports:</strong> {profileData.correctReportCount?.toString()}</div>
                        <div><strong>Level:</strong> {profileData.level?.toString()}</div>

                        <div className="mt-4">
                          <strong>Reviewed Images:</strong>
                          <ul className="flex flex-wrap gap-8 mt-3">
                            {profileData.image_rvd?.map((img, i) => (
                              <li key={i} className="w-40 h-40 overflow-hidden rounded shadow">
                                <img src={img} alt={`Reviewed ${i}`} className="object-cover w-full h-full" />
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4">
                          <strong>Verified Images:</strong>
                          <ul className="flex flex-wrap gap-8 mt-3">
                            {profileData.image_VR?.map((img, i) => (
                              <li key={i} className="w-40 h-40 overflow-hidden rounded shadow">
                                <img src={img} alt={`Verified ${i}`} className="object-cover w-full h-full" />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {profileData.role === "Manager" && (
                      <div className="text-green-600 font-medium">
                        You are logged in as the KVK Manager (contract owner).
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right: Role Image */}
            {profileData?.role && (
              <div className="w-full flex justify-end md:justify-end md:pr-12 pt-4 md:pt-2">
  <img
    src={getRoleImage(profileData.role)}
    alt={`${profileData.role} logo`}
    className="w-48 h-48 object-contain"
  />
</div>

            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
