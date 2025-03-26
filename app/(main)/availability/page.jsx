import { getUserAvailability } from "@/actions/availability";
import AvailabilityForm from "./_component/availability-form";
import { get } from "http";

const AvailabilityPage = async () => {
  const availability = await getUserAvailability(); 
  console.log("getUserAvailability",availability)

  return <AvailabilityForm initialData={availability} />;
};

export default AvailabilityPage;
