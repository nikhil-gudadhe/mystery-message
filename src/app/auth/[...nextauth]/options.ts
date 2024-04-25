import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user) {
                        throw new Error("No user found with this email")
                    }

                    if(user.isVerified) {
                        throw new Error("Please verifiy your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password)

                    if(isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect password")
                    }

                } catch (error: any) {
                    throw new Error
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString(),
                token.username = user.username,
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id?.toString(),
                session.user.username = token.username,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}