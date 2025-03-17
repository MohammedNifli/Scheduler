import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function Home() {
  return (
    <div className="w-full bg-white h-auto border border-amber-200 flex">
  {/* Left Side - Content */}
  <div className="w-1/2 flex items-center justify-center p-4">
    <p>Content</p>
  </div>

  {/* Right Side - Image */}
  <div className="w-1/2 flex justify-center items-center p-4">
    <p>Image</p>
  </div>
</div>


  );
}
