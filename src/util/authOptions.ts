// import type { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import axiosInstance from '@/util/axiosinstance';
//
// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'Email', type: 'email' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     console.error('Authorize: Email or password missing');
//                     throw new Error('Email and password are required');
//                 }
//
//                 try {
//                     console.log('Authorize: Sending login request with:', {
//                         email: credentials.email,
//
//                     });
//                     const response = await axiosInstance.post('/login', {
//                         email: credentials.email,
//                         password: credentials.password,
//                     });
//                     console.log('Authorize: Backend response:', response.data);
//
//                     const { token, user } = response.data;
//
//                     if (user && token) {
//                         return {
//                             id: user.id.toString(),
//                             email: user.email,
//                             name: user.name || null,
//                             image: user.image || null,
//                             token: token,
//                         };
//                     }
//                     console.error('Authorize: Login failed, user or token not received from backend.');
//                     return null;
//                 } catch (error: any) {
//                     console.error("Authorize: Login error:", error.response?.data || error.message);
//                     throw new Error(error.response?.data?.message || "Invalid credentials. Please try again.");
//                 }
//             },
//         }),
//         // Example: GoogleProvider
//         // GoogleProvider({
//         //   clientId: process.env.GOOGLE_CLIENT_ID!,
//         //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         // }),
//     ],
//     callbacks: {
//         async jwt({ token, user, account }) {
//             if (user) {
//                 token.id = user.id;
//                 if ((user as any).token) {
//                     token.accessToken = (user as any).token;
//                 }
//                 if (account?.access_token) {
//                     token.accessToken = account.access_token;
//                 }
//             }
//             return token;
//         },
//         async session({ session, token, user: sessionUser }) {
//             if (!session.user) {
//                 session.user = {};
//             }
//
//             if (token.id) {
//                 session.user.id = token.id as string;
//             }
//             if (token.email) {
//                 session.user.email = token.email as string;
//             }
//             if (token.name) {
//                 session.user.name = token.name as string;
//             }
//             if (token.picture) {
//                 session.user.image = token.picture as string;
//             }
//
//             if (token.accessToken) {
//                 session.accessToken = token.accessToken as string;
//             }
//             return session;
//         },
//     },
//     pages: {
//         signIn: '/login',
//         error: '/login',
//     },
//     session: {
//         strategy: 'jwt',
//         maxAge: 30 * 24 * 60 * 60,
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// };

import {NextAuthOptions, User as NextAuthUser, Session, DefaultSession} from 'next-auth';
import type {JWT} from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import axiosInstance from '@/util/axiosinstance';
import axios from "axios";

// Extend the User type to include your custom properties from the backend
interface CustomUser extends NextAuthUser {
    token?: string;
    id: string; // Ensure id is always a string
    email: string;
    name?: string | null;
    image?: string | null;
}

// Extend the Token type to include your custom properties
interface CustomJWT extends JWT {
    id?: string;
    accessToken?: string;
    email?: string;
}

// Extend the Session type to include your custom properties
declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user?: {
            id?: string;
        } & DefaultSession['user'];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.error('Authorize: Email or password missing');
                    throw new Error('Email and password are required');
                }

                try {
                    console.log('Authorize: Sending login request with:', {
                        email: credentials.email,
                    });
                    const response = await axiosInstance.post('/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });
                    console.log('Authorize: Backend response:', response.data);

                    // Type the destructured response
                    const {token, user} = response.data as { token: string; user: Omit<CustomUser, 'token'> };

                    if (user && token) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            token: token,
                        } as CustomUser; // Cast to CustomUser
                    }
                    console.error('Authorize: Login failed, user or token not received from backend.');
                    return null;
                } catch (error) { // Keep any here for broad error catching from axios, or refine with AxiosError type
                    if (axios.isAxiosError(error)) { // <--- CORRECTED: Use axios.isAxiosError
                        console.error("Authorize: Login error:", error.response?.data || error.message);
                        throw new Error(error.response?.data?.message || "Invalid credentials. Please try again.");
                    } else if (error instanceof Error) {
                        console.error("Authorize: Generic error:", error.message);
                        throw new Error(error.message || "An unexpected error occurred.");
                    } else {
                        console.error("Authorize: Unknown error type:", error);
                        throw new Error("An unknown error occurred.");
                    }
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user, account}) {
            if (user) {
                // user is CustomUser here
                token.id = (user as CustomUser).id;
                if ((user as CustomUser).token) {
                    token.accessToken = (user as CustomUser).token;
                }
            }
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            return token as CustomJWT; // Return type is CustomJWT
        },
        async session({session, token}) { // Removed 'sessionUser'
            if (!session.user) {
                session.user = {
                    id: '', // Initialize with default values if not present
                    email: '',
                };
            }

            if (token.id) {
                session.user.id = token.id;
            }
            if (token.email) {
                session.user.email = token.email;
            }

            if (token.accessToken) {
                (session as Session).accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
