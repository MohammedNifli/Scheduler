"use client";

import { eventSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
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

const EventForm = ({ onSubmitForm }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      duration: 30,
      isPrivate: true,
    },
  });

  const { loading, error, data, fn: fnCreateEvent } = useFetch(CreateEvent);

  const onSubmit = async (data) => {
    await fnCreateEvent(data);
    if (!loading && !error) {
      onSubmitForm();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <Input id="title" {...register("title")} className="mt-1" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Event Description
        </label>
        <Input id="description" {...register("description")} className="mt-1" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <Input id="duration" {...register("duration", { valueAsNumber: true })} className="mt-1" />
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Create Event"}
      </Button>
    </form>
  );
};

export default EventForm;
