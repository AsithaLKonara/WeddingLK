"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MainLayout } from "@/components/templates/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LoginForm = dynamic(() => import("@/components/auth/login-form"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const RegisterForm = dynamic(() => import("@/components/auth/register-form"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const VenueBooking = dynamic(() => import("@/components/organisms/venue-booking"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })
const PaymentForm = dynamic(() => import("@/components/organisms/payment-form"), { loading: () => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function TestDemoPage() {
  const [activeTab, setActiveTab] = useState("auth")

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Payment successful:", paymentId)
    // Handle payment success
  }

  return (
    <MainLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
          <h1 className="text-3xl font-bold">Component Test & Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test and demonstrate various components and features
          </p>
      </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
        <CardHeader>
                  <CardTitle>Login Form</CardTitle>
        </CardHeader>
        <CardContent>
                  <LoginForm />
        </CardContent>
      </Card>

          <Card>
            <CardHeader>
                  <CardTitle>Register Form</CardTitle>
            </CardHeader>
            <CardContent>
                  <RegisterForm />
            </CardContent>
          </Card>
            </div>
        </TabsContent>

          <TabsContent value="booking" className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Venue Booking</CardTitle>
            </CardHeader>
            <CardContent>
                <VenueBooking venue={{
                  _id: "demo-venue-1",
                  name: "Demo Venue",
                  pricing: {
                    basePrice: 50000,
                    currency: "LKR"
                  }
                }} />
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Payment Form</CardTitle>
            </CardHeader>
            <CardContent>
                <PaymentForm 
                  booking={{
                    id: "demo-booking-1",
                    venueName: "Demo Venue",
                    totalAmount: 50000
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                />
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Form Validation Test</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/test/form-validation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'registration',
                          data: {
                            firstName: 'John',
                            lastName: 'Doe',
                            email: 'john@example.com',
                            phone: '+94123456789',
                            password: 'password123',
                            userType: 'couple'
                          }
                        })
                      })
                      const result = await response.json()
                      console.log('Validation result:', result)
                    }}
                  >
                    Test Registration Validation
                  </Button>

                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/test/form-validation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'booking',
                          data: {
                            venueId: 'venue-1',
                            date: '2024-12-25',
                            guests: 150,
                            name: 'John & Jane',
                            email: 'john@example.com',
                            phone: '+94123456789',
                            message: 'Test booking'
                          }
                        })
                      })
                      const result = await response.json()
                      console.log('Validation result:', result)
                    }}
                  >
                    Test Booking Validation
                  </Button>

                  <Button 
                    onClick={async () => {
                      const response = await fetch('/api/test/form-validation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'payment',
                          data: {
                            amount: 50000,
                            currency: 'LKR',
                            paymentMethod: 'card',
                            cardNumber: '4242424242424242',
                            expiryDate: '12/25',
                            cvv: '123'
                          }
                        })
                      })
                      const result = await response.json()
                      console.log('Validation result:', result)
                    }}
                  >
                    Test Payment Validation
                  </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
                  </div>
    </MainLayout>
  )
}
