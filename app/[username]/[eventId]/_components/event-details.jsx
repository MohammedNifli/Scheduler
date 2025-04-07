import React from 'react';
import { Video, Clock, Calendar, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EventDetails = ({ event }) => {
    const { user } = event;
    
    return (
        <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl overflow-hidden border border-blue-100 transition-all hover:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <h1 className="text-2xl font-extrabold text-white relative z-10">{event.title}</h1>
            </CardHeader>
            
            <CardContent className="p-0">
                <div className="bg-gradient-to-b from-blue-50 to-white pt-8 pb-6 px-6 text-center">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg mx-auto ring-4 ring-blue-100">
                        <AvatarImage 
                            src={user.imageurl} 
                            alt={`${user.name}'s profile`} 
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-4xl">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="mt-4 space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            @{user.username}
                        </Badge>
                    </div>
                </div>
                
                <div className="p-6 space-y-4 border-t border-blue-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="bg-blue-100 p-2 rounded-full mb-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{event.duration} minutes</span>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                            <div className="bg-blue-100 p-2 rounded-full mb-2">
                                <Video className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Google Meet</span>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                        <div className="flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Select a time below to book this event</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventDetails;