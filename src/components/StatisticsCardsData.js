import React, { useEffect, useState } from "react";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "./StatisticsCard"; // Adjust if needed

export default function Cards() {
  const [imageCount, setImageCount] = useState(0);
  const [farmerCount, setFarmerCount] = useState(0);
  const [scientistCount, setScientistCount] = useState(0);
  const [txCount, setTxCount] = useState(0);

  const contractAddress = process.env.REACT_APP_CONTRACT;

  const { runContractFunction: getImageCount } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "images_count",
  });

  const { runContractFunction: getFarmerCount } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "farmers_count",
  });

  const { runContractFunction: getScientistCount } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "scientists_count",
  });

  const { runContractFunction: getTxCount } = useWeb3Contract({
    abi: Upload.abi,
    contractAddress: process.env.REACT_APP_CONTRACT,
    functionName: "transactions_count",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [images, farmers, scientists, txs] = await Promise.all([
          getImageCount(),
          getFarmerCount(),
          getScientistCount(),
          getTxCount(),
        ]);

        setImageCount(Number(images));
        setFarmerCount(Number(farmers));
        setScientistCount(Number(scientists));
        setTxCount(Number(txs));
        console.log(txs);
      } catch (error) {
        console.error("Error fetching data from contract:", error);
      }
    }

    fetchData();
  }, []);

  // While loading
  if (
    imageCount === null ||
    farmerCount === null ||
    scientistCount === null ||
    txCount === null
  ) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
     <StatisticsCard
  color="gray"
  icon={<ChartBarIcon className="h-6 w-6 text-white" />}
  title="Uploads"
  value={imageCount}
  onFetch={async () => {
    const images = await getImageCount();
    setImageCount(Number(images));
  }}
  footer={<span className="text-green-500 text-sm">+5% this week</span>}
  
/>

<StatisticsCard
  color="gray"
  icon={<UserPlusIcon className="h-6 w-6 text-white" />}
  title="Farmers"
  value={farmerCount}
  onFetch={async () => {
    const farmers = await getFarmerCount();
    setFarmerCount(Number(farmers));
  }}
  footer={<span className="text-green-500 text-sm">+2% this week</span>}
/>

<StatisticsCard
  color="gray"
  icon={<UsersIcon className="h-6 w-6 text-white" />}
  title="Scientists"
  value={scientistCount}
  onFetch={async () => {
    const scientists = await getScientistCount();
    setScientistCount(Number(scientists));
  }}
  footer={<span className="text-green-500 text-sm">+3% this week</span>}
/>

<StatisticsCard
  color="gray"
  icon={<BanknotesIcon className="h-6 w-6 text-white" />}
  title="Transactions"
  value={txCount}
  onFetch={async () => {
    const txs = await getTxCount();
    setTxCount(Number(txs));
  }}
  footer={<span className="text-green-500 text-sm">+10% this week</span>}
/>

    </div>
  );
}
