import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import {Metadata} from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: 'Login Page | Acme Dashboard',
    description: 'The official Next.js Learn Dashboard built with App Router.',
    metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};



export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                <LoginForm />
                <div className="mt-4 text-center">
                    <Link
                        href="/register"
                        className="inline-block w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Don't have an account? Sign up
                    </Link>
                </div>

            </div>
        </main>
    );
}