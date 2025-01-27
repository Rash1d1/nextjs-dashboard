import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import {redirect} from "next/navigation";
import {createSession} from "@/app/lib/session";

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }
                console.log("Invalid Credentials!")
                return null;
            },


        }),
    ],
});

import { SignupFormSchema } from '@/app/lib/definitions'

export async function signup(state: string | undefined, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    console.log(validatedFields);
    try {
        const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

        const result = await sql`
            INSERT INTO users (name, email, password)
            VALUES (${validatedFields.data.name}, ${validatedFields.data.email}, ${hashedPassword})
            RETURNING id;
        `;

        const newUserId = result.rows[0]?.id;

        if (!newUserId) {
            return {
                message: 'An error occurred while creating your account.',
            };
        }

        // Create user session
        await createSession(newUserId);

        // Redirect user to the home page (no try-catch here)
        return { redirectUrl: "/dashboard" };

    } catch (error) {
        console.error('Failed to create user:', error);
        throw new Error('Failed to create user.');
    }
}


import { deleteSession } from '@/app/lib/session'
import {revalidatePath} from "next/cache";

export async function logout() {
    await deleteSession()
    revalidatePath('/login');
    redirect('/login')

}
