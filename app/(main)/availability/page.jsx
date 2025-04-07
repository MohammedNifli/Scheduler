import { getUserAvailability } from "@/actions/availability";
import AvailabilityForm from "./_component/availability-form";


const AvailabilityPage = async () => {
  const availability = await getUserAvailability(); 
 
  return <AvailabilityForm initialData={availability} />;
};

export default AvailabilityPage;
