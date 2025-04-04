import { getServerSession } from "next-auth";
import { db } from './prisma';
import { authOptions } from "@/lib/auth";

export const checkUser = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    // User data to update/create
    const userData = {
      email: session.user.email,
      name: session.user.name,
      imageurl: session.user.image,
      provider: 'google',
      providerId: session.user.id,
      oauthAccessToken: session.accessToken,
      oauthRefreshToken: session.refreshToken,
      oauthTokenExpiry: session.expiresAt ? new Date(session.expiresAt * 1000) : null,
      updatedAt: new Date() // Always update this
    };

    if (existingUser) {
      // Update existing user with new tokens and info
      const updatedUser = await db.user.update({
        where: { email: session.user.email },
        data: userData
      });
      console.log("User tokens updated:", updatedUser.email);
      return updatedUser;
    }

    // Create new user with generated username
    const newUser = await db.user.create({
      data: {
        ...userData,
        username: session.user.name?.replace(/\s+/g, '-').toLowerCase() + 
                 '-' + Math.random().toString(36).substring(2, 6)
      },
    });

    console.log("New user created:", newUser.email);
    return newUser;
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
};
// lib/auth.js
// lib/checkUser.js
// import { db } from './prisma';
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export const checkUser = async () => {
//   console.log('\n===== CHECK USER START =====');
//   const session = await getServerSession(authOptions);
  
//   console.log('Session from getServerSession:', session);
  
//   if (!session?.user?.email) {
//     console.log('No session or email found');
//     return null;
//   }

//   try {
//     const user = await db.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       console.log('User not found in database');
//       throw new Error("User not found in database");
//     }

//     console.log('User found in database:', user);
//     return user;
//   } catch (error) {
//     console.error('Error in checkUser:', error);
//     return null;
//   }
// };