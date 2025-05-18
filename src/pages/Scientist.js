import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import UploadImage from "../components/UploadImage";
import { Typography, Button, ButtonGroup } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import StatisticsCard from "../components/StatisticsCard";
import StatisticsChart from "../components/StatisticsChart";
import { statisticsCardsData } from "../utils/statisticsCardsData";
import { statisticsChartsData } from "../utils/statisticsChartsData";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import ScientistReviewCard from "../components/ScientistReviewCard";
import { CardSkeleton } from "../components/CardSkeleton";
import FinalCard from "../components/FinalCard";


export default function Scientist() {
  const [meth, setMeth] = useState("");
  const [img, setImg] = useState([]);
  const { walletAddress } = useUser();

  const { runContractFunction: fetch, data } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "display_scientist",
    params: { _user: walletAddress },
  });

  const fetchImg = async () => {
    await fetch();
    if (data) {
      if (meth === "verified") {
        setImg(data.image_VR);
      } else if (meth === "reviewed") {
        setImg(data.image_rvd);
      }
    }
  };

  const renderImages = () => {
  if (meth === "verified") {
    return img.map((item, i) => (
      <div key={`img-${i}`} className="p-2 md:p-4">
        <FinalCard item={item} />
      </div>
    ));
  } else if (meth === "reviewed") {
    return img.map((item, i) => (
      <div key={`img-${i}`} className="p-2 md:p-4">
        <ScientistReviewCard item={item} />
      </div>
    ));
  } else {
    return null; // fallback if meth doesn't match
  }
};


  return (
    <div className="">
      <Navbar />
      <Layout headerType="scientist" className="">
        <section
          className={`pt-20 pb-10  ${
            walletAddress ? " px-6 md:px-8" : "px-4"
          } bg-gradient-to-br from-blue-50 to-green-50`}
        >
        <div className="bg-gradient-to-r from-green-100 via-blue-100 to-teal-100 rounded-xl p-4 shadow-md mb-6">
  <h1 className="text-gray-700 text-3xl font-extrabold tracking-wide uppercase text-center ">
    🚀 Dashboard
  </h1>
</div>
          

          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow-md max-w-6xl mx-auto my-10 p-6">
            
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
              {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
                <StatisticsCard
                  key={title}
                  {...rest}
                  title={title}
                  icon={React.createElement(icon, {
                    className: "w-6 h-6 text-white",
                  })}
                  footer={
                    <Typography className="font-normal text-blue-gray-600">
                      <strong className={footer.color}>{footer.value}</strong>
                      &nbsp;{footer.label}
                    </Typography>
                  }
                />
              ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
              {statisticsChartsData.map((props) => (
                <StatisticsChart
                  key={props.title}
                  {...props}
                  footer={
                    <Typography
                      variant="small"
                      className="flex items-center font-normal text-blue-gray-600"
                    >
                      <ClockIcon className="h-4 w-4 text-blue-gray-400" />
                      &nbsp;{props.footer}
                    </Typography>
                  }
                />
              ))}
            </div>

            <div className="text-center">
              <Typography variant="paragraph" color="blue-gray">
                The graphs and data shown here are for ideation only and not
                actual on-chain values. A pipeline for real-time data will be
                included in the next version.
              </Typography>
            </div>

          </div>

          {/* Review Instructions */}
          <div className="bg-white rounded-xl shadow-md max-w-6xl mx-auto my-10 p-6">
            <div className="text-center mb-6">
              <Typography variant="h2" className="text-3xl font-semibold">
                Review Images
              </Typography>
            </div>
            <Typography variant="paragraph" color="blue-gray">
              The AI proposes a solution which you need to verify. You earn
              authority points for each image reviewed. If your review is later
              found incorrect, points will be deducted.
            </Typography>
            <div className="flex justify-center pt-4 pb-6">
              <Link to="../openimages">
                <Button variant="outlined" className="flex items-center gap-2">
                  Review
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                ><path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  /></svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Verify Instructions */}
          <div className="bg-white rounded-xl shadow-md max-w-6xl mx-auto my-10 p-6">
            <div className="text-center mb-6">
              <Typography variant="h2" className="text-3xl font-semibold">
                Verify Images
              </Typography>
            </div>
            <Typography variant="paragraph" color="blue-gray">
              After review, images are verified by a group. Only if 5 verifiers
              approve, it gets added to the final section. Verifiers also earn
              authority points.
            </Typography>
            <div className="flex justify-center pt-4 pb-6">
              <Link to="../closeimages">
                <Button variant="outlined" className="flex items-center gap-2">
                  Verify
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                ><path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  /></svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Fetch Images */}
          <div className="bg-white rounded-xl shadow-md max-w-6xl mx-auto my-10 p-6">
            <div className="text-center mb-6">
              <Typography variant="h2" className="text-3xl font-semibold">
                Fetch Your Images
              </Typography>
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-center max-w-3xl mx-auto mb-10"
              >
                Click the respective buttons to fetch the images you have
                reviewed or verified.
              </Typography>
            </div>

            <div className="flex justify-center mb-10">
              <ButtonGroup fullWidth variant="outlined">
                <Button
                  onClick={() => {
                    setMeth("verified");
                    fetchImg();
                  }}
                >
                  Verified
                </Button>
                <Button
                  onClick={() => {
                    setMeth("reviewed");
                    fetchImg();
                  }}
                >
                  Reviewed
                </Button>
              </ButtonGroup>
            </div>

            <div className="min-h-[300px]">
              {img && img.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderImages()}
                </div>
              ) : (
                <div className="text-center">
                  <Typography>No images fetched yet</Typography>
                  <div className="flex justify-center gap-6 mt-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}
