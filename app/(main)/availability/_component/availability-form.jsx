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
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, CalendarDays } from "lucide-react";

const AvailabilityForm = ({ initialData }) => {
  if (!initialData) return (
    <div className="p-4 flex justify-center items-center min-h-[200px]">
      <p className="text-muted-foreground">Loading availability.....</p>
    </div>
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          <CalendarDays className="h-5 w-5" />
          Weekly Availability
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 sm:space-y-6">
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
                <div key={day} className="flex flex-col rounded-lg bg-muted/50 p-3 sm:p-4">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    <Controller
                      name={`${day}.isAvailable`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={`${day}-checkbox`}
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
                              setValue(`${day}.startTime`, "");
                              setValue(`${day}.endTime`, "");
                            }
                          }}
                        />
                      )}
                    />
                    <label htmlFor={`${day}-checkbox`} className="font-medium capitalize">
                      {day}
                    </label>
                  </div>

                  {isAvailable && (
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5 lg:items-center">
                      <div className="lg:col-span-2">
                        <Controller
                          name={`${day}.startTime`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 opacity-50" />
                                  <SelectValue placeholder="Start Time" />
                                </div>
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
                      </div>
                      
                      <div className="flex justify-center lg:col-span-1">
                        <span className="text-muted-foreground">to</span>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <Controller
                          name={`${day}.endTime`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                const startTime = watch(`${day}.startTime`);
                                if (startTime) {
                                  const startTimeDate = new Date(`1970-01-01T${startTime}:00`);
                                  const endTimeDate = new Date(`1970-01-01T${value}:00`);
                                
                                  if (endTimeDate <= startTimeDate) {
                                    setError(`${day}.endTime`, {
                                      type: "custom",
                                      message: "End time must be later than start time",
                                    });
                                  } else {
                                    clearErrors(`${day}.endTime`);
                                  }
                                }
                                setValue(`${day}.endTime`, value);
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 opacity-50" />
                                  <SelectValue placeholder="End Time" />
                                </div>
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
                          <p className="text-sm text-destructive mt-1">
                            {errors[day]?.endTime?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 sm:w-auto sm:min-w-[180px]">
                  <Clock className="h-5 w-5 opacity-70" />
                  <label htmlFor="timeGap" className="font-medium">
                    Minimum booking gap:
                  </label>
                </div>
                <div className="flex-1">
                  <Input
                    id="timeGap"
                    type="number"
                    {...register("timeGap", {
                      valueAsNumber: true,
                    })}
                    className="w-full sm:w-48"
                    placeholder="Minutes"
                  />
                  {errors?.timeGap && (
                    <p className="text-sm text-destructive mt-1">
                      {errors?.timeGap?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <CardFooter className="px-0 pb-0 pt-6 flex justify-center sm:justify-end">
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Update Availability"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default AvailabilityForm;