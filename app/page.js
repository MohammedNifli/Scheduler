import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Image from "next/image";
import { Calendar, Clock, LinkIcon } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const features = [
  {
    icon: Calendar,
    title: "Create Events",
    description: "Easily set up and customize your event types",
  },
  {
    icon: Clock,
    title: "Manage Availability",
    description: "Define your availability to streamline scheduling",
  },
  {
    icon: LinkIcon,
    title: "Custom Links",
    description: "Share your personalized scheduling link",
  },
];

const howItWorks = [
  { step: "Sign Up", description: "Create your free Schedulrr account" },
  {
    step: "Set Availability",
    description: "Define when you're available for meetings",
  },
  {
    step: "Share Your Link",
    description: "Send your scheduling link to clients or colleagues",
  },
  {
    step: "Get Booked",
    description: "Receive confirmations for new appointments automatically",
  },
];

export default async function Home() {
    await checkUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
    
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Section - Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text ">Simplify</span> Your Scheduling
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
              Scheduler helps you manage your time effectively. Create events, set
              your availability, and let others book time with you seamlessly.
            </p>
            <div className="pt-3 sm:pt-5 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-base sm:text-lg rounded-lg shadow-md hover:shadow-lg transition-all">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="px-8 py-2 text-base sm:text-lg border-blue-600 text-blue-600 hover:bg-blue-50 transition-all"
              >
                Learn More
              </Button>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
              </div>
              <p className="text-sm text-gray-600">Trusted by 10,000+ users</p>
            </div>
          </div>

          {/* Right Section - Image with better responsive handling */}
          <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-10"></div>
              <Image
                src="/scheduler.jpg"
                alt="Scheduling illustration"
                layout="fill"
                objectFit="cover"
                className="rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Improved for mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-16">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, ind) => (
            <Card key={ind} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
              <CardHeader className="flex flex-col items-center pt-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 shadow-md">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section - With responsive carousel */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-16">How It Works</h2>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {howItWorks.map((item, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="border-0 shadow-md bg-white hover:shadow-lg transition-all duration-300 h-full">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 mx-auto shadow-md">
                        {index + 1}
                      </div>
                      <CardTitle className="text-xl font-bold text-center">{item.step}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-base text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className=" static transform-none shadow-md hover:shadow-lg transition-all h-10 w-10" />
              <CarouselNext className=" static transform-none shadow-md hover:shadow-lg transition-all h-10 w-10" />
            </div>
          </Carousel>
        </div>
      </div>
    </main>
  );
}
