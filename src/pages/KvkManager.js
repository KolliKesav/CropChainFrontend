import React from "react";
import Layout from "../components/Layout";
import { Typography, Button, Card } from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import StatisticsCard from "../components/StatisticsCard";
import StatisticsChart from "../components/StatisticsChart";
import { statisticsCardsData } from "../utils/statisticsCardsData";
import { statisticsChartsData } from "../utils/statisticsChartsData";
import { UserAddCard } from "../components/UserAddCard";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const data = [
  {
    title: "ADD FARMER",
    user: "farmer",
    discription:
      "For registering farmer we need the account address and the Aadhar Id of the farmer which is kept private",
    link: "./farmer",
  },
  {
    title: "ADD Scientist",
    user: "scientist",
    discription:
      "For registering scientist we need the account address and the Aadhar Id of the farmer which is kept private",
    link: "./scientist",
  },
];

export default function KvkManagaer() {
  return (
    <div>
      <Navbar />
      <Layout>
        <div className="bg-gradient-to-br from-blue-50 to-green-50">

          {/* Header */}
          <div className="px-8 pt-24">
            <Typography variant="h4" className="text-gray-800">
              Welcome, KVK Manager
            </Typography>
            <Typography variant="small" className="mt-2 text-gray-600">
              The graphs and statistical data below are for ideation only and do not reflect real on-chain data. A live pipeline will be introduced in future versions.
            </Typography>
          </div>

          {/* Statistics Cards */}
          <div className="px-8 py-10">
            <Card className="bg-white p-6 shadow-md">
              <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
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
           

          {/* Statistics Charts */}
          <div className="px-4 pb-10 py-10">
            
              <div className="grid gap-y-12 gap-x-7 md:grid-cols-2 xl:grid-cols-3">
                {statisticsChartsData.map((props) => (
                  <StatisticsChart
                    key={props.title}
                    {...props}
                    footer={
                      <Typography
                        variant="small"
                        className="flex items-center font-normal text-blue-gray-600"
                      >
                        <ClockIcon
                          strokeWidth={2}
                          className="h-4 w-4 text-blue-gray-400"
                        />
                        &nbsp;{props.footer}
                      </Typography>
                    }
                  />
                ))}
              </div>
           
          </div>
          </Card>
          </div>

          {/* Image Flow Info */}
          <div className="px-8 pb-10">
            <Card className="bg-white p-6 shadow-md">
              <Typography variant="h5" className="mb-4 text-gray-800">
                Image Verification Flow
              </Typography>
              <Typography variant="paragraph" color="blue-gray">
                Farmers upload images, AI reviews and proposes solutions. These go to the "Close Images" section, where Scientists verify the AI's output. Scientists earn or lose authority points based on their accuracy.
              </Typography>

              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                <Link to="../openimages">
                  <Button variant="outlined" className="flex items-center gap-2">Open<svg
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
                    /></svg></Button>
                </Link>
                <Link to="../closeimages">
                  <Button variant="outlined" className="flex items-center gap-2">Close<svg
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
                    /></svg></Button>
                </Link>
                <Link to="../finalimages">
                  <Button variant="outlined" className="flex items-center gap-2">Final<svg
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
                    /></svg></Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* User Registration */}
          <div className="px-8 pb-10">
            <Card className=" p-6 shadow-md">
              <Typography variant="h5" className="mb-6 text-gray-800 text-center">
                Register New Users
              </Typography>
              <div className="flex flex-wrap justify-center gap-6">
                {data.map((item, index) => (
                  <UserAddCard key={index} data={item} />
                ))}
              </div>
            </Card>
          </div>

          {/* Description Section */}
          <div className="px-8 pb-10">
            <Card className="bg-white p-6 shadow-md">
              <Typography variant="paragraph" color="blue-gray">
                The KVK Manager is the admin who deploys and controls the smart contract. They are authorized to register Farmers and Scientists. Since the network uses Proof of Authority, identity is required via Aadhar and wallet address.
              </Typography>
            </Card>
          </div>

          {/* Flowchart Image */}
          <div className="px-8 pb-16">
            <Card className="bg-white p-6 px-24 shadow-md flex justify-center">
              <img
                src="./flow.png"
                alt="Interaction Flow"
                className="w-full max-w-4xl rounded-md"
              />
            </Card>
          </div>
        </div>
      </Layout>
    </div>
  );
}
