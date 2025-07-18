"use client"

import dynamic from "next/dynamic"
import { MainLayout } from "@/components/templates/main-layout"

// Dynamically import the RegisterForm component with a fallback loading state
const RegisterForm = dynamic(() => import("@/components/auth/register-form"), {
    loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" />
})

export default function RegisterPage() {
    return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <RegisterForm />
                </div>
            </div>
        </MainLayout>
    )
}
