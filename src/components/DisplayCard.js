import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import Upload from "../utils/Upload.json";

export default function DisplayCard({ item }) {
 


  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader shadow={false} floated={false} className="relative h-48">
        <img
          src={item}
          alt="Image"
          className="w-full h-full object-cover rounded-t-xl"
        />
      </CardHeader>

      {/* Optional CardBody or Info */}
      <CardBody className="flex-1">
        {/* Add content here if needed */}
      </CardBody>

      
    </Card>
  );
}
