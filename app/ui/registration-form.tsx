'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { signUp } from '@/app/lib/actions';

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(signUp, undefined);
    const parsedState = state ? JSON.parse(state) : null;

    // Manage form inputs
    const [formData, setFormData] = useState({name: '', email: '', password: '' });

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Clear fields on successful registration
    useEffect(() => {
        if (parsedState && !parsedState.errors) {
            setFormData({name: '', email: '', password: '' });
        }
    }, [parsedState]);

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Create your account.
                </h1>
                <div className="w-full">
                    {/* Name Field */}
                    <div>
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="name">
                            Name
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />

                        </div>
                        {parsedState?.errors?.name && (
                            <p className="text-red-500 text-xs mt-1">{parsedState.errors.name}</p>
                        )}
                    </div>
                    {/* Email Field */}
                    <div>
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {parsedState?.errors?.email && (
                            <p className="text-red-500 text-xs mt-1">{parsedState.errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                        {parsedState?.errors?.password && (
                            <div className="text-red-500 text-xs mt-1">
                                <ul>
                                    {Array.isArray(parsedState.errors.password) ? (
                                        parsedState.errors.password.map((error: string) => (
                                            <li key={error}>- {error}</li>
                                        ))
                                    ) : (
                                        <li>- {parsedState.errors.password}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
                {state && !parsedState?.errors && (
                    <p className="text-green-500 text-xs mt-2">Registration successful!</p>
                )}
            </div>
        </form>
    );
}
