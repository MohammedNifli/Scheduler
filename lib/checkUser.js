import { auth, clerkClient ,currentUser } from "@clerk/nextjs/server";
import {db} from './prisma'

export const checkUser = async () => {
  const { userId } = await auth(); 
  const user =await currentUser()
  
  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db?.user.findUnique({
      where: { clerkUsrId: user.id  },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // const user = await clerkClient( ).users.(userId);    
    // console.log("user",user)

    const name = `${user.firstName} ${user.lastName}`;

    console.log("full Name",name)

    // console.log("clerkClient",clerkClient())

    await clerkClient.users.update(user.id, {
      username: name.split(" ").join("-") + user?.id.slice(-4),
    });

    const newUser = await db.user.create({
      data: {
        clerkUsrId: user.id,
        name,
        imageurl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username: name.split(" ").join("-") + user.id.slice(-4),
      },
    });


    return newUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};
