// // lib/auth.js
// import GoogleProvider from "next-auth/providers/google";
// import { db } from "./prisma";

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           access_type: "offline",
//           prompt: "consent", // Force consent to get refresh token
//           scope: [
//             "openid",
//             "email",
//             "profile",
//             "https://www.googleapis.com/auth/calendar",
//             "https://www.googleapis.com/auth/calendar.events"
//           ].join(" "),
//           response_type: "code"
//         }
//       }
//     })
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error",
//   },
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       try {
//         const existingUser = await db.user.findUnique({
//           where: { email: user.email },
//         });
  
//         if (!existingUser) {
//           const username =
//             user.name.replace(/\s+/g, "-").toLowerCase() +
//             "-" +
//             Math.random().toString(36).substring(2, 6);
  
//           await db.user.create({
//             data: {
//               email: user.email,
//               name: user.name,
//               imageurl: user.image,
//               username: username,
//               provider: "google",
//               providerId: profile.sub,
//               oauthAccessToken: account.access_token,
//               oauthRefreshToken: account.refresh_token,
//               oauthTokenExpiry: account.expires_at
//                 ? new Date(account.expires_at * 1000)
//                 : null,
//             },
//           });
//         }
//         return true;
//       } catch (error) {
//         console.error("SignIn error:", error);
//         return false;
//       }
//     },
  
//     async jwt({ token, account, user }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//         token.expiresAt = account.expires_at;
//       }
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
  
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;
//       session.expiresAt = token.expiresAt;
  
//       if (session.user?.email) {
//         const dbUser = await db.user.findUnique({
//           where: { email: session.user.email },
//         });
  
//         if (dbUser) {
//           session.user.id = dbUser.id;
//           session.user.username = dbUser.username;
//         }
//       }
//       return session;
//     },
  
//     async redirect({ url, baseUrl }) {
//       // Redirect to home after login instead of dashboard
//       if (url === `${baseUrl}/auth/signin`) {
//         return `${baseUrl}/`;
//       }
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
  
//   debug: process.env.NODE_ENV === "development",
// };




import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./prisma";

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events"
          ].join(" "),
          response_type: "code"
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const username = user.name
            .replace(/\s+/g, "-")
            .toLowerCase() + 
            "-" + 
            Math.random().toString(36).substring(2, 6);

          await db.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              username,
              provider: "google",
              providerId: profile.sub,
              oauthAccessToken: account.access_token,
              oauthRefreshToken: account.refresh_token,
              oauthTokenExpiry: account.expires_at 
                ? new Date(account.expires_at * 1000) 
                : null,
            },
          });
        } else {
          // Update existing user's tokens
          await db.user.update({
            where: { email: user.email },
            data: {
              oauthAccessToken: account.access_token,
              oauthRefreshToken: account.refresh_token,
              oauthTokenExpiry: account.expires_at 
                ? new Date(account.expires_at * 1000) 
                : null,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      // Subsequent calls
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.user.id = token.id;

      // Get additional user data from database
      if (token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        });

        if (dbUser) {
          session.user = {
            ...session.user,
            ...dbUser
          };
        }
      }
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  debug: process.env.NODE_ENV === "development",
};