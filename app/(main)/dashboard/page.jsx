"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CardTitle,
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { getCurrentUsername, updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import {
  LineChart,
  BarChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Loader2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  ArrowUp,
  ArrowDown,
  Award,
  Clock3,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { dashboardDatas } from "@/actions/bookings";
import { getgraphDatas } from "@/actions/meetings";
import { Toaster, toast } from 'sonner'


const Dashboard = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [currentUsername, setCurrentUsername] = useState("");
  const [origin, setOrigin] = useState("");
  const [bookingData, setBookingData] = useState();
  const [graphData, setGraphData] = useState({
    monthlyStats: [],
    totalEvents: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    pastBookings: 0,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

 

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await getCurrentUsername();
        if (username) {
          setCurrentUsername(username);
          setValue("username", username);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      } finally {
      }
    };

    fetchUsername();
  }, [setValue]);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        totalBookings,
        upcomingBookings,
        pastBookings,
        cancelledBookings,
      } = await dashboardDatas();
      const data = await getgraphDatas();
      setGraphData(data);

      setBookingData({
        totalBookings,
        upcomingBookings,
        pastBookings,
        cancelledBookings,
      });

      console.log(
        "Dashboard data:",
        totalBookings,
        upcomingBookings,
        pastBookings,
        cancelledBookings
      );
    };

    fetchDashboardData();

    const intervalId = setInterval(fetchDashboardData, 10000); // 5000ms = 5s

    return () => clearInterval(intervalId);
  }, [dashboardDatas]);

  const onSubmit = async (data) => {
    console.log("Updated username:", data.username);
    fnUpdateUsername(data.username);
    toast.success("Username updated successfully!");
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BarLoader width={150} color="#36d7b7" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md p-6">
          <CardTitle className="text-center mb-4">Access Restricted</CardTitle>
          <CardDescription className="text-center">
            Please sign in to access this dashboard
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Card with Meeting Stats */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome back, {user?.name}
          </CardTitle>
          <CardDescription className="text-blue-100 mt-1">
            Your meeting analytics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Upcoming</span>
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {bookingData?.upcomingBookings ?? "Loading...."}
              </p>
              <div className="flex items-center mt-1 text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>over all</span>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Past</span>
                <CheckCircle className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {bookingData?.pastBookings ?? "Loading....."}
              </p>
              <div className="flex items-center mt-1 text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>over all</span>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">cancelled</span>
                <Clock3 className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {bookingData?.cancelledBookings ?? "Loading...."}
              </p>
              <div className="flex items-center mt-1 text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>over all</span>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total</span>
                <Users className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {bookingData?.totalBookings ?? "Loading..."}
              </p>
              <div className="flex items-center mt-1 text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>2 more than average</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meetings Over Time Chart */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-600" />
                  Meeting Trends
                </CardTitle>
                <CardDescription>
                  Monthly overview of your meetings
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-500">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  {error}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphData.monthlyStats}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name === "events" ? "Events" : "Bookings",
                      ]}
                    />
                    <Legend
                      formatter={(value) =>
                        value === "events" ? "Events" : "Bookings"
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Type Distribution */}
        <Card className="shadow-md rounded-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Booking Status
                </CardTitle>
                <CardDescription>
                  Distribution by booking status
                </CardDescription>
              </div>
              <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {bookingData?.totalBookings} Total
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Upcoming",
                        value: bookingData?.upcomingBookings,
                      },
                      { name: "Past", value: bookingData?.pastBookings },
                      {
                        name: "Cancelled",
                        value: bookingData?.cancelledBookings,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    paddingAngle={2}
                  >
                    <Cell fill="#3b82f6" /> {/* Upcoming - blue */}
                    <Cell fill="#10b981" /> {/* Past - green */}
                    <Cell fill="#ef4444" /> {/* Cancelled - red */}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} bookings`, "Count"]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Username Form Card (Existing Functionality) */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Your Unique Link
          </CardTitle>
          <CardDescription>Customize your profile URL</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{origin}/</span>
                <Input
                  {...register("username")}
                  placeholder="username"
                  className="flex-1"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}

              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof error === "string"
                    ? error
                    : error.message || "Something went wrong"}
                </p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              Update Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
