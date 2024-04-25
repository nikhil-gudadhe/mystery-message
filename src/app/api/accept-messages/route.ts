import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"


export async function POST(request: Request) {
  await dbConnect()

    const session = await getServerSession(authOptions)
        const user: User = session?.user as User

        if(!session || !session.user) {
            return Response.json({
                success: false,
                message: "Not authenticated"
            }, {status: 401}
            )
        }

        const userId = user._id
        const { acceptMessages } = await request.json()
        
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, {status: 401}
            )
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully"
        }, {status: 200}
        )

    } catch (error) {
        console.error("Failed to update user status to accept messages", error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, {status: 500}
        )
    }
}

export async function GET(request: Request) {
    await dbConnect();
  
    const session = await getServerSession(authOptions);
    const user = session?.user;
  
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    try {
      const foundUser = await UserModel.findById(user._id);
  
      if (!foundUser) {
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
  
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessages,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error retrieving message acceptance status:', error);
      return Response.json(
        { success: false, message: 'Error retrieving message acceptance status' },
        { status: 500 }
      );
    }
  }