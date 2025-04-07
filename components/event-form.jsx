"use client";

import { eventSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CreateEvent } from "@/actions/events";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

const EventForm = ({ onSubmitForm }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
      isPrivate: true,
    },
  });

  const { loading, error, data, fn: fnCreateEvent } = useFetch(CreateEvent);

  const onSubmit = async (formData) => {
    try {
      await fnCreateEvent(formData);
      
      toast.success("Event created successfully!");
      reset();
      if (onSubmitForm) onSubmitForm();
    } catch (err) {
      toast.error(err?.message || "Failed to create event");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <Input 
          id="title" 
          {...register("title")} 
          className="mt-1" 
          placeholder="Enter event title"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Event Description
        </label>
        <Textarea 
          id="description" 
          {...register("description")} 
          className="mt-1 min-h-24" 
          placeholder="Enter event description"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <Input 
          id="duration" 
          type="number"
          {...register("duration", { valueAsNumber: true })} 
          className="mt-1" 
          min={15}
          max={240}
        />
        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
      </div>

      <div>
        <label htmlFor="isPrivate" className="block text-sm font-medium text-gray-700">
          Event Privacy
        </label>
        <Controller
          name="isPrivate"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Select
              {...rest}
              value={value ? "true" : "false"}
              onValueChange={(selectedValue) => onChange(selectedValue === "true")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Private</SelectItem>
                <SelectItem value="false">Public</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.isPrivate && <p className="text-red-500 text-sm mt-1">{errors.isPrivate.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || loading} 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create Event"}
      </Button>
      
      {error && (
        <p className="text-red-500 text-sm text-center">{error.message || "An error occurred"}</p>
      )}
    </form>
  );
};

export default EventForm;