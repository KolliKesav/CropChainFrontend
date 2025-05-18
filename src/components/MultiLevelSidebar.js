import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
} from "@material-tailwind/react";
import { WalletIcon } from "@heroicons/react/24/solid";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ConnectButton } from "web3uikit";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useUser } from "../context/UserContext";

export function MultiLevelSidebar() {
  const { walletAddress, role } = useUser();
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div>
      <Card className="h-[calc(100vh-0rem)] w-full max-w-[17rem] p-4 pt-24 shadow-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        {/* <div className="mb-2 flex items-center gap-4 p-4">
        <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        />
        <Typography variant="h5" color="blue-gray">
          CropChain
        </Typography>
      </div> */}
        <div className="p-2">
          <Input
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            label="Search"
          />
        </div>
        <List>
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""
                  }`}
              />
            }
          >
            <ListItem>
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                <Link
                  to={
                    role === "Farmer"? "/farmer": role === "Scientist"? "/scientist": role === "Manager"? "/kvkmanager":"/"

                  }
                >
                  Dashboard
                </Link>
              </Typography>
            </ListItem>

            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Search
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  <Typography>
                    {" "}
                    <Link to="/scientistlist">Scientists</Link>
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  <Link to="/farmerlist"> Farmer</Link>
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <Accordion
            open={open === 2}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""
                  }`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 2}>
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <InboxIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Images
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  <Link to="/openimages">Uploaded</Link>
                </ListItem>
                
                { role=== "Scientist" && (
                  <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  <Link to="/closeimages">Reviewed</Link>
                </ListItem>)}
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  <Link to="/finalimages">Verified</Link>
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>

          <hr className="my-2 border-blue-gray-50" />

          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/profile">Profile</Link>
          </ListItem>

          <ListItem className="flex flex-col items-start gap-2">
           <div className="hidden"><ConnectButton /></div>
            <div className="flex items-center gap-2">
              <WalletIcon className="h-6 w-6 " />
              <Typography variant="h6">Wallet Connected</Typography>
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2 w-full text-center shadow-sm border border-gray-300">
              <Typography
                variant="paragraph"
                className="text-base font-medium text-gray-800"
              >
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "Not Connected"}
              </Typography>
            </div>
          </ListItem>
        </List>
        <Alert
          open={openAlert}
          className="ml-auto mt-auto"
          onClose={() => setOpenAlert(false)}
        >
          <CubeTransparentIcon className=" mb-4 h-12 w-12" />
          <Typography variant="h6" className="mb-1">
            Legitmate solutions
          </Typography>
          <Typography variant="small" className="font-normal opacity-80">
            BlockChain and AI combined gives you a chance to experience of Fair
            and decentralised world
          </Typography>
          <div className="mt-4 flex gap-3">
            <Typography
              as="a"
              href="#"
              variant="small"
              className="font-medium opacity-80"
              onClick={() => setOpenAlert(false)}
            >
              Dismiss
            </Typography>
            <Typography as="a" href="#" variant="small" className="font-medium">
              Join
            </Typography>
          </div>
        </Alert>
      </Card>
    </div>
  );
}
