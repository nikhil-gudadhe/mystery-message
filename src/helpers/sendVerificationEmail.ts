import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string,
): Promise<ApiResponse> {

    try {
        
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({username, otp: verificationCode})
        });

        return({success: true, message: 'Verification email send successfully'})
    } catch (error) {
        console.error("Error sending verification email", error)
        return({success: false, message: 'Failed to send verification email'})
    }
}