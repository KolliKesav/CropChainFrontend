import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
export function StatisticsCard({ color, icon, title, value, footer, onFetch }) {
  return (
    <Card className="border border-blue-gray-100 z-0 shadow-sm">
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
     <CardBody className="p-4 text-right">
  {/* Title */}
  <Typography as="p" className="text-xs font-medium text-blue-gray-600 mb-2">
    {title}
  </Typography>

  {/* Value or Fetch button */}
  {value ? (
    <Typography as="p" className=" font-semibold text-blue-gray-800">
      {value}
    </Typography>
  ) : (
    <div className="flex justify-end">
      <Button
        size="sm"
        variant="outlined"
        color="blue-gray"
        className="text-xs py-1 px-2"
        onClick={onFetch}
      >
        Fetch
      </Button>
    </div>
  )}
</CardBody>

      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
  onFetch: () => {}, // default to no-op
};


StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;
