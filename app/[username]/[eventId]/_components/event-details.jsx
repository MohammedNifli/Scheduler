import React from 'react'
import { Video, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const EventDetails = ({event}) => {
    const {user} = event
    
    return (
        <Card className="max-w-md mx-auto shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 text-center">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">{event.title}</h1>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className='w-32 h-32 border-4 border-blue-500 shadow-md'>
                        <AvatarImage 
                            src={user.imageurl} 
                            alt={`${user.name}'s profile`} 
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-4xl">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <Badge variant="secondary" className="mt-2">@{user.username}</Badge>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span>{event.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Video className="h-5 w-5 text-blue-600" />
                        <span>Google Meet</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default EventDetails;