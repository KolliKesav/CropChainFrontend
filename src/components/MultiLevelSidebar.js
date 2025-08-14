import React, { useEffect,useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
} from "@material-tailwind/react";
import {
  WalletIcon,
  PresentationChartBarIcon,
  UserCircleIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ConnectButton } from "web3uikit";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function MultiLevelSidebar() {
  const { walletAddress, role } = useUser();
  const [open, setOpen] = useState(0);
  const [openAlert, setOpenAlert] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile,setIsMobile]=useState(false);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setIsExpanded(true); // desktop only
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) setIsExpanded(false); // desktop only
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile: expand fully when menu is open
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
      setIsExpanded(isMobileOpen);
    }
  }, [isMobileOpen]);

  return (
    <div>
      {/* Mobile Menu Button */}
      {(!isMobile||!isMobileOpen )&&<div className="lg:hidden fixed top-28 left-8 z-[9999]">
        <button
          onClick={toggleMobile}
          className="p-2 bg-gray-200 rounded-md shadow-md opacity-100"
        >
           <Bars3Icon className="h-6 w-6" />
          
        </button>
      </div>}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full transition-all duration-300 ease-in-out 
           ${isMobile ? "z-[9998]" : "z-[50]"} 
          ${isExpanded ? "w-80" : "w-20"}
          ${isMobileOpen ? "translate-x-0 " : "-translate-x-full"}
          lg:translate-x-0
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Card className=" h-[calc(100vh-0rem)] w-full max-w-[20rem] p-4 pt-24 shadow-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div
            className={`p-2 transition-all duration-300 flex flex-row ${
              isExpanded
                ? "opacity-100"
                : "opacity-0 h-0 overflow-hidden"
            }`}
          >
          
            <Input
              icon={<MagnifyingGlassIcon className="h-5 w-5 p-3" />}
              label="Search"
            />
              {(isMobile&&isMobileOpen )&&
           <button
          onClick={toggleMobile}
          className="p-2 ml-2 bg-gray-200 rounded-md shadow-md opacity-100"
        >
            <XMarkIcon className="p-1 h-6 w-6" />
            </button>
          }
          </div>

          <List>
            {/* Dashboard */}
            <Link
              to={
                role === "Farmer"
                  ? "/farmer"
                  : role === "Scientist"
                  ? "/scientist"
                  : role === "Manager"
                  ? "/kvkmanager"
                  : "/"
              }
            >
              <ListItem>
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography
                  color="blue-gray"
                  className={`font-normal transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Dashboard
                </Typography>
              </ListItem>
            </Link>

            {/* Search Accordion */}
            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  } ${isExpanded ? "opacity-100" : "opacity-0"}`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className={`mr-auto font-normal transition-all duration-300 ${
                      isExpanded
                        ? "opacity-100"
                        : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    Search
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody
                className={`py-1 transition-all duration-300 ${
                  open === 1 && isExpanded
                    ? "opacity-100"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <List className="p-0">
                  <Link to="/scientistlist">
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      <Typography>Scientists</Typography>
                    </ListItem>
                  </Link>
                  <Link to="/farmerlist">
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      <Typography>Farmer</Typography>
                    </ListItem>
                  </Link>
                </List>
              </AccordionBody>
            </Accordion>

            {/* Images Accordion */}
            <Accordion
              open={open === 2}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 2 ? "rotate-180" : ""
                  } ${isExpanded ? "opacity-100" : "opacity-0"}`}
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
                  <Typography
                    color="blue-gray"
                    className={`mr-auto font-normal transition-all duration-300 ${
                      isExpanded
                        ? "opacity-100"
                        : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    Images
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody
                className={`py-1 transition-all duration-300 ${
                  open === 2 && isExpanded
                    ? "opacity-100"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <List className="p-0">
                  <Link to="/openimages">
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      <Typography>Uploaded</Typography>
                    </ListItem>
                  </Link>

                  <Link to="/closeimages">
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon
                          strokeWidth={3}
                          className="h-3 w-5"
                        />
                      </ListItemPrefix>
                      <Typography>Reviewed</Typography>
                    </ListItem>
                  </Link>

                  <Link to="/finalimages">
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      <Typography>Verified</Typography>
                    </ListItem>
                  </Link>
                </List>
              </AccordionBody>
            </Accordion>

            <hr className="my-2 border-blue-gray-50" />

            {/* Profile */}
            <Link to="/profile">
              <ListItem>
                <ListItemPrefix>
                  <UserCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Profile
                </Typography>
              </ListItem>
            </Link>

            {/* Wallet Section */}
            <ListItem className="flex flex-col items-start gap-2">
              <div className="hidden">
                <ConnectButton />
              </div>
              <div className="flex items-center gap-2">
                <WalletIcon className="h-6 w-6" />
                <Typography
                  variant="h6"
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Wallet Connected
                </Typography>
              </div>
              <div
                className={`bg-gray-100 rounded-lg px-4 py-2 w-full text-center shadow-sm border border-gray-300 transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100"
                    : "opacity-0 h-0 overflow-hidden"
                }`}
              >
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

          {/* Alert */}
          <Alert
            open={openAlert}
            className={`ml-auto mt-auto transition-all duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
            }`}
            onClose={() => setOpenAlert(false)}
          >
            <CubeTransparentIcon className="mb-4 h-12 w-12" />
            <Typography variant="h6" className="mb-1">
              Legitimate solutions
            </Typography>
            <Typography variant="small" className="font-normal opacity-80">
              Blockchain and AI combined gives you a chance to experience a fair
              and decentralized world.
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

      {/* Content Spacer for Desktop */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isExpanded ? "w-80" : "w-16"
        }`}
      />
    </div>
  );
}
