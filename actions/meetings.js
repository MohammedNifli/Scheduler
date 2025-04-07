"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function getUserMeetings(type = 'upcoming') {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        throw new Error("Unauthorized: Please sign in to create events.");
    }
    console.log("session",session.user.email)

    const now = new Date();
    const user=await db.user.findUnique({
        where:{ 
            email:session.user.email
        }
    })


    const meetings = await db.booking.findMany({
        where: {
            userId: user.id,
            startTime: type === 'upcoming' ? { gte: now } : { lt: now }
        },
        include: {
            event: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            startTime: type === "upcoming" ? "asc" : "desc"
        }
    });
   

    return meetings;
}

export async function cancelMeeting(meetId) {
    try {
        // console.log("meeeeeeeeeeeeeeettttttttid",meetId)
      const cancelledEvent = await db.booking.update({
        where: {
          id: meetId
        },
        data: {
          isDeleted: true,  // Soft delete flag
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });

    //   console.log("canedccccccccccccccccccccc",cancelledEvent)
  
      return cancelledEvent;
    } catch (error) {
      console.error("Failed to cancel meeting:", error);
      throw new Error("Failed to cancel meeting");
    }
  }


  export async function getgraphDatas() {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        throw new Error("Unauthorized: Please sign in to view dashboard.");
      }
  
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: {
          events: {
            include: {
              bookings: {
                where: {
                  status: 'CONFIRMED', 
                  isDeleted: false     
                }
              }
            }
          }
        }
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      const currentYear = new Date().getFullYear();
      const monthlyData = [];
  
      for (let month = 0; month < 12; month++) {
        const startDate = new Date(currentYear, month, 1);
        const endDate = new Date(currentYear, month + 1, 0);
        
        const monthName = startDate.toLocaleString('default', { month: 'short' });
  
        
        const monthlyEvents = user.events.filter(event => {
          const eventCreatedAt = new Date(event.createdAt);
          return eventCreatedAt >= startDate && eventCreatedAt <= endDate;
        });
  
      
        const monthlyBookings = monthlyEvents.reduce(
          (sum, event) => sum + event.bookings.length, 
          0
        );
  
        monthlyData.push({
          name: monthName,
          events: monthlyEvents.length,
          bookings: monthlyBookings,
        
        });
      }

    
  
      return {
        monthlyStats: monthlyData,
        totalEvents: user.events.length,
        totalBookings: user.events.reduce(
          (sum, event) => sum + event.bookings.length, 
          0
        ),
        // Additional useful metrics:
        upcomingBookings: user.events.flatMap(e => e.bookings)
          .filter(b => new Date(b.startTime) > new Date()).length,
        pastBookings: user.events.flatMap(e => e.bookings)
          .filter(b => new Date(b.startTime) <= new Date()).length
      };
  
    } catch (error) {
      console.error("Error in getgraphDatas:", error);
      return { 
        error: error.message || "Server error",
        status: 500 
      };
    }
  }