"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar, Clock, Check, UserCircle, Mail, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

import useFetch from "@/hooks/use-fetch";
import { createBookings } from "@/actions/bookings";

const BookingForm = ({ event, eventAvailability }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm();

  const availableDays = eventAvailability?.map((day) => new Date(day.date)) || [];

  const timeSlots = selectedDate
    ? eventAvailability?.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

    useEffect(()=>{
      if(selectedDate){
        setValue("date",format(selectedDate,'yyyy-MM-dd'))
      }
      return ()=>{
      }
    },[selectedDate])

    useEffect(()=>{
      if(selectedTime){
        setValue("time",selectedTime)
      }
      return ()=>{
      }
    },[selectedTime])

    const {loading, data, fn:fnCreateBooking} = useFetch(createBookings)

    const onSubmit = async(data) => {
      console.log(data)
      
      const startTime = new Date(
        `${format(selectedDate,"yyyy-MM-dd")}T${selectedTime}`
      )
  
      const endTime = new Date(startTime.getTime() + event.duration * 60000)
    
      const bookingData = {
        eventId: event.id,
        name: data.name,
        email: data.email,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        additionalInfo: data.additionalInfo,
      }

      const result = await fnCreateBooking(bookingData);

      if (result.success) {
        if (result.booking.meetLink) {
          console.log("success")
        } else {
          console.log("without goole meet sucews")
        }
      } else {
        console.log("ERROR")
      }
    }

    if(data){
      return(
        <div className="container mx-auto px-4 py-12 max-w-md">
          <Card className="w-full shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
              <div className="flex items-center justify-center">
                <Check className="w-16 h-16 text-white bg-green-400 p-3 rounded-full shadow-lg mb-4" />
              </div>
              <CardTitle className="text-3xl font-bold text-center">Booking Successful!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              {data.meetLink ? (
                <div className="space-y-4">
                  <p className="text-gray-700">Your meeting has been scheduled successfully. Join using the link below:</p>
                  <a 
                    href={data.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors font-medium"
                  >
                    {data.meetLink}
                  </a>
                </div>
              ) : (
                <p className="text-gray-700">Your appointment has been scheduled successfully. Check your email for more details.</p>
              )}
              <Button className="mt-6 w-full">Return to Home</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="w-full shadow-xl overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-12 h-12 text-white bg-blue-500 p-2 rounded-full shadow-lg" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Book Your {event?.title || "Event"}
            </CardTitle>
            {event?.duration && (
              <p className="text-center text-blue-100 mt-2">
                Duration: {event.duration} minutes
              </p>
            )}
          </CardHeader>
          
          <CardContent className="p-6 pt-8">
            <div className="space-y-8">
              {/* Date Picker Section */}
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4 text-gray-800">
                  <Calendar className="mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold">Select Date</h3>
                </div>
                <div className="w-full flex justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    disabled={[{ before: new Date() }]}
                    modifiers={{
                      available: availableDays,
                    }}
                    modifiersStyles={{
                      available: {
                        background: "rgb(59, 130, 246)",
                        color: "white",
                        fontWeight: "bold",
                      },
                      disabled: {
                        color: "#d1d5db"
                      }
                    }}
                    className="w-full max-w-xs"
                    styles={{
                      caption: { color: "#1e40af" },
                      head_cell: { color: "#6b7280" },
                    }}
                  />
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4 text-gray-800">
                  <Clock className="mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold">Available Time Slots</h3>
                </div>
                <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.length > 0 ? (
                        timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            className={`w-full py-3 justify-center transition-all ${
                              selectedTime === slot
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                : "border-blue-200 text-blue-600 hover:bg-blue-50"
                            }`}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {selectedTime === slot && (
                              <Check className="mr-1 w-4 h-4" />
                            )}
                            {slot}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-3 text-center text-gray-500 py-6">
                          No available slots for this date
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-10 px-4">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>Please select a date to see available time slots</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                disabled={!selectedDate || !selectedTime}
                className={`w-full py-6 text-lg font-medium shadow-md transition-colors ${
                  !selectedDate || !selectedTime 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Continue to Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedTime && (
          <Card className="w-full shadow-xl overflow-hidden border-0">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <CardTitle className="text-xl font-bold text-center">
                Enter Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-8 bg-white">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <UserCircle className="mr-2 h-4 w-4 text-gray-500" />
                    Your Name
                  </label>
                  <Input 
                    {...register("name", { required: "Name is required" })} 
                    placeholder="Full Name"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    Email Address
                  </label>
                  <Input 
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email"
                      }
                    })} 
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-gray-500" />
                    Additional Information
                  </label>
                  <Textarea 
                    {...register("additionalInfo")} 
                    placeholder="Share any additional information or questions"
                    className="w-full min-h-24 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md"
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scheduling...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Check className="mr-2 h-5 w-5" />
                        Schedule Event
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingForm;