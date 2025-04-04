"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Calendar, Clock, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { se } from "date-fns/locale";
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


    const {loading,data,fn:fnCreateBooking}=useFetch(createBookings)


    const onSubmit=async(data)=>{
      console.log(data)

       
      const startTime=new Date(
        `${format(selectedDate,"yyyy-MM-dd")}T${selectedTime}`
      )
  
      const endTime=new Date(startTime.getTime()+event.duration*60000)
    
      const bookingData={
        eventId:event.id,
        name:data.name,
        email:data.email,
        startTime:startTime.toISOString(),
        endTime:endTime.toISOString(),
        additionalInfo:data.additionalInfo,
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
        <div>
          <h2>Booking Successfull</h2>
          {
            data.meetLink &&(
              <p>
                join the meeting:{" "}
              
                <a href={data.meetLink}
                target="_blank"
                rel="noopener noreferer"
                className="text-blue-500 hover:underline"
                >
                  {data.meetLink}
                </a>
              </p>
            )
          }
        </div>
      )
    }
   

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="w-full shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-8 h-8" />
              <CardTitle className="text-2xl font-bold text-center">
                Book Your Event
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Date Picker Section */}
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4 text-gray-700">
                  <Calendar className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">Select Date</h3>
                </div>
                <div className="w-full flex justify-center">
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
                        background: "#60A5FA",
                        color: "white",
                        borderRadius: "9999px",
                      },
                    }}
                    className="w-full max-w-xs"
                  />
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4 text-gray-700">
                  <Clock className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">Available Time Slots</h3>
                </div>
                <div className="w-full">
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          className={`w-full justify-center ${
                            selectedTime === slot
                              ? "bg-blue-500 text-white"
                              : "hover:bg-blue-100"
                          }`}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {selectedTime === slot && (
                            <Check className="mr-2 w-4 h-4" />
                          )}
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      Select a date to see available time slots
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <Button
                disabled={!selectedDate || !selectedTime}
                className="w-full"
              >
                Continue to Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedTime && (
          <Card className="w-full shadow-xl">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                <Input 
  {...register("name", { required: "Name is required" })} 
  placeholder="Your Name"
/>

                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input 
                    {...register("email")} 
                    placeholder="Your Email"
                    className="w-full"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Textarea 
                    {...register("additionalInfo")} 
                    placeholder="Additional Information"
                    className="w-full"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
               {loading ? "Scheduling..." :"Schedule Event"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingForm;