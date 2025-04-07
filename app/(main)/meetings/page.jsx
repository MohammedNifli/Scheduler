'use client'
import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserMeetings } from '../../../actions/meetings';
import MeetingList from './_components/meeting-list';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, ListTodo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MeetingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Meetings</h1>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Schedule</span>
          </div>
          <div className="flex items-center">
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Manage</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="upcoming">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Upcoming</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="past">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4" />
              <span>Past</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MeetingListSkeleton />}>
                  <UpcomingMeetings />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Past Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<MeetingListSkeleton />}>
                  <PastMeetings />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

async function UpcomingMeetings() {
  const meetings = await getUserMeetings("upcoming");
  return <MeetingList meetings={meetings} type="upcoming" />;
}

async function PastMeetings() {
  const meetings = await getUserMeetings("past");
  return <MeetingList meetings={meetings} type="past" />;
}

function MeetingListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="h-[200px]">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MeetingPage;