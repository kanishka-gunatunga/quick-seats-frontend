// import NextAuth, {NextAuthOptions} from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from "next-auth/providers/google";
// import axiosInstance from "@/util/axiosinstance";
//
// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: {label: 'Email', type: 'email'},
//                 password: {label: 'Password', type: 'password'},
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error('Email and password are required');
//                 }
//
//                 try {
//                     const response = await axiosInstance.post('/api/login', {
//                         email: credentials.email,
//                         password: credentials.password,
//                     });
//
//                     const {token, user} = response.data;
//
//                     if (user && token) {
//                         return {
//                             id: user.id,
//                             email: user.email,
//                             token,
//                         };
//                     }
//                     return null;
//                 } catch (error: any) {
//                     throw new Error(error.response?.data?.message || 'Login failed');
//                 }
//             },
//         }),
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//     ],
//     callbacks: {
//         async jwt({token, user}) {
//             if (user) {
//                 token.id = user.id;
//                 token.email = user.email;
//                 token.accessToken = user.token;
//             }
//             return token;
//         },
//         async session({session, token}) {
//             session.user.id = token.id as string;
//             session.user.email = token.email as string;
//             session.accessToken = token.accessToken as string;
//             return session;
//         },
//     },
//     pages: {
//         signIn: '/login',
//     },
//     session: {
//         strategy: 'jwt',
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// };
//
// const handler = NextAuth(authOptions);
//
// export { handler as GET, handler as POST };


import NextAuth from 'next-auth';
import {authOptions} from "@/util/authOptions";


// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: {label: 'Email', type: 'email'},
//                 password: {label: 'Password', type: 'password'},
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error('Email and password are required');
//                 }
//
//                 try {
//                     console.log('Sending login request with:', {
//                         email: credentials.email,
//                         password: credentials.password
//                     });
//                     const response = await axiosInstance.post('/login', {
//                         email: credentials.email,
//                         password: credentials.password,
//                     });
//                     console.log('Backend response:', response.data);
//
//                     const {token, user} = response.data;
//
//                     if (user && token) {
//                         return {
//                             id: user.id,
//                             email: user.email,
//                             token,
//                         };
//                     }
//                     return null;
//                 } catch (error) {
//                     console.error("Login error:", error);
//                     throw new Error("Login failed");
//                 }
//             },
//         }),
//         // GoogleProvider({
//         //   clientId: process.env.GOOGLE_CLIENT_ID!,
//         //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         // }),
//     ],
//     callbacks: {
//         async jwt({token, user}) {
//             if (user) {
//                 token.id = user.id;
//                 token.email = user.email;
//                 token.accessToken = user.token;
//             }
//             return token;
//         },
//         async session({session, token}) {
//             if (!session.user) {
//                 session.user = { id: "", email: "", name: null };
//             }
//             session.user.id = token.id as string;
//             session.user.email = token.email as string;
//             session.accessToken = token.accessToken as string;
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

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};

// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import axiosInstance from '@/util/axiosinstance';
//
// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: {label: 'Email', type: 'email'},
//                 password: {label: 'Password', type: 'password'},
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error('Email and password are required');
//                 }
//
//                 try {
//                     console.log('Sending login request with:', {
//                         email: credentials.email,
//                         password: credentials.password
//                     });
//                     const response = await axiosInstance.post('/login', {
//                         email: credentials.email,
//                         password: credentials.password,
//                     });
//                     console.log('Backend response:', response.data);
//
//                     const {token, user} = response.data;
//
//                     if (user && token) {
//                         return {
//                             id: user.id,
//                             email: user.email,
//                             token,
//                         };
//                     }
//                     return null;
//                 } catch (error) {
//                     console.error("Login error:", error);
//                     throw new Error("Login failed");
//                 }
//             },
//         }),
//         // GoogleProvider({
//         //   clientId: process.env.GOOGLE_CLIENT_ID!,
//         //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         // }),
//     ],
//     callbacks: {
//         async jwt({token, user}) {
//             if (user) {
//                 token.id = user.id;
//                 token.email = user.email;
//                 token.accessToken = user.token;
//             }
//             return token;
//         },
//         async session({session, token}) {
//             session.user.id = token.id;
//             session.user.email = token.email;
//             session.accessToken = token.accessToken;
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
//
// const handler = NextAuth(authOptions);
//
// export {handler as GET, handler as POST};