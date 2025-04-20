"use client";

import React from 'react';

export default function StripeVerificationPage() {
    return (
        <div className="min-h-screen max-w-6xl mx-auto h-full w-full p-4 pt-4 text-black flex flex-col pb-24">
            <h1 className="text-2xl lg:text-3xl font-bold text-black mb-8">
                Stripe Verification
            </h1>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <p className="font-semibold">Primary Email:</p>
                    <a
                        href="mailto:hookerhillstudios@gmail.com"
                        className="text-blue-600 hover:underline"
                    >
                        hookerhillstudios@gmail.com
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <p className="font-semibold">Secondary Email:</p>
                    <a
                        href="mailto:momentum.hookerhillstudios@gmail.com"
                        className="text-blue-600 hover:underline"
                    >
                        momentum.hookerhillstudios@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
} 