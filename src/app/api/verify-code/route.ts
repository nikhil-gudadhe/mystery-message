import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 500}
            )
        } 

        const isCodeValid = user.verificationCode == code 
        const isCodeNotExpired = new Date(user.verificationExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {status: 200})
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get a new code "
            }, {status: 400})
        } else {
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {status: 400})
        }

    } catch (error) {
        console.error("Error validating code", error)
        return Response.json({
            success: false,
            message: "Error validating code"
        }, {status: 500}
        )
    }
}