"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { availabilitySchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeSlots } from "../data";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateAvailability } from "@/actions/availability";

const AvailabilityForm = ({ initialData }) => {
  if (!initialData) return <div>Loading...</div>;
  // console.log("initial",initialData)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    clearErrors, // ✅ Add this line
    formState: { errors },
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });
  
  const onSubmit = async (data) => {
    console.log("Submitting data:", data);
    try {
      const result = await updateAvailability(data);

      console.log("Availability update result:", result);

    } catch (error) {
      console.error("Error updating availability:", error);

    }
  };

  // const onSubmit = async (data) => {
  //   console.log("Submitting data:", data); // Check if this runs
  // };

  return (
    <div>
      <h2>Availability Form</h2>
      <form
        onSubmit={handleSubmit(onSubmit)} 
      >
        {[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day) => {
          const isAvailable = watch(`${day}.isAvailable`);

          return (
            <div key={day} className="flex items-center space-x-4 mb-4">
              <Controller
                name={`${day}.isAvailable`}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      setValue(`${day}.isAvailable`, checked);
                      if (checked) {
                        setValue(
                          `${day}.startTime`,
                          watch(`${day}.startTime`) || "9:00"
                        );
                        setValue(
                          `${day}.endTime`,
                          watch(`${day}.endTime`) || "17:00"
                        );
                      } else {
                        setValue(`${day}.startTime`, ""); // Clear fields when unchecking
                        setValue(`${day}.endTime`, "");
                      }
                    }}
                  />
                )}
              />
              <span className="w-24">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </span>

              {isAvailable && (
                <>
                  <Controller
                    name={`${day}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Start Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <span>to</span>
                  <Controller
                    name={`${day}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <Select
                      onValueChange={(value) => {
                        const startTime = watch(`${day}.startTime`);
                      
                        if (startTime) {
                          // Convert to Date objects for correct comparison
                          const startTimeDate = new Date(`1970-01-01T${startTime}:00`);
                          const endTimeDate = new Date(`1970-01-01T${value}:00`);
                      
                          if (endTimeDate <= startTimeDate) {
                            setError(`${day}.endTime`, {
                              type: "custom",
                              message: "End time must be later than start time",
                            });
                          } else {
                            clearErrors(`${day}.endTime`);  // ✅ Clears error when valid
                          }
                        }
                      
                        setValue(`${day}.endTime`, value);
                      }}
                      
                      
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="End Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors?.[day]?.endTime && (
                    <span className="text-red-50 text-sm ml-2">
                      {errors[day]?.endTime?.message}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}

        <div>
          <span>Minimum gap before booking (minutes):</span>
          <Input
            type="number"
            {...register("timeGap", {
              valueAsNumber: true,
            })}
            className="w-32 mb-2"
          />
          {errors?.timeGap && (
            <span className="text-red-50 text-sm ml-2">
              {errors?.timeGap?.message}
            </span>
          )}
        </div>
        <Button type="submit" className="bg-black text-white">
          Update Availability
        </Button>
      </form>
    </div>
  );
};

export default AvailabilityForm;
