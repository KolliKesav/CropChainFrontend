import {
  Card,
  CardHeader,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";

export default function DisplayCard({ item }) {
  const allParts = item?.split("$") || [];
  const firstImageUrl = allParts[0];
  const remainingImageUrls = allParts.slice(1);
  const allImages = allParts; // include all in popup

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card className="w-full h-full flex flex-col relative mb-4">
        <CardHeader
          shadow={false}
          floated={false}
          className="relative h-48 cursor-pointer overflow-hidden"
          onClick={handleOpen}
        >
          <img
            src={firstImageUrl}
            alt="Main"
            className="w-full h-full object-cover rounded-t-xl transition"
          />

          {/* +N Badge */}
          {remainingImageUrls.length > 0 && (
            <div
              onClick={handleOpen}
              className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded cursor-pointer"
            >
              +{remainingImageUrls.length} more
            </div>
          )}
        </CardHeader>

        
      </Card>

      {/* Popup Dialog */}
      <Dialog open={open} size="lg" handler={handleClose}>
        <DialogHeader className="justify-between">
          All Images
          <button
            onClick={handleClose}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6">
            {allImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
          
        </DialogBody>
      </Dialog>
    </>
  );
}
