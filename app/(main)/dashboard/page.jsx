"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CardTitle, Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";

const Dashboard = () => {
  const { isLoaded, user } = useUser();
  console.log("user", user);

  const [origin, setOrigin] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    if (isLoaded && user?.firstName) {
      setValue("username", user?.firstName);
    }
  }, [isLoaded, user, setValue]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const {
    loading,
    error,
    data,
    fn: fnUpdateUsername,
  } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    console.log("Updated username:", data.username);
    fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardTitle>Welcome, {user?.firstName}</CardTitle>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span>{origin}/</span>
                <Input {...register("username")} placeholder="username" />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}

              {error && <p className="text-red-500">{error.message}</p>}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button type="submit">Update Username</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
