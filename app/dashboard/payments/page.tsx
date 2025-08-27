"use client"

import React from "react"
import { useState } from "react"

import { Calendar, Users, Phone, Eye, Download, Loader2, Heart, MessageSquare, CreditCard, DollarSign, CheckCircle, TrendingUp, Bell, Settings, CheckSquare, MessageCircle, Store, Smartphone, Shield, Star, Camera, ArrowRight, Mail, Lock, EyeOff, XCircle, Clock, Play, Database, User, Search } from "lucide-react"

// div will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// span will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function PaymentsPage() {
  const [payments] = useState([
    {
      id: "pay_001",
      bookingId: "1",
      venueName: "Galle Face Hotel",
      amount: 457500,
      status: "completed",
      method: "Credit div",
      date: "2024-01-16",
      transactionId: "txn_abc123",
    },
    {
      id: "pay_002",
      bookingId: "2",
      venueName: "Cinnamon Grand Colombo",
      amount: 657500,
      status: "pending",
      method: "Bank Transfer",
      date: "2024-01-21",
      transactionId: "txn_def456",
    },
    {
      id: "pay_003",
      bookingId: "3",
      venueName: "Jetwing Lighthouse",
      amount: 387500,
      status: "refunded",
      method: "Credit div",
      date: "2024-01-26",
      transactionId: "txn_ghi789",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "refunded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const totalPaid = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

  const totalPending = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your payments and download receipts</p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <divTitle className="text-sm font-medium">Total Paid</divTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </divHeader>
          <divContent>
            <div className="text-2xl font-bold text-green-600">LKR {totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </divContent>
        </div>

        <div>
          <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <divTitle className="text-sm font-medium">Pending</divTitle>
            <div className="h-4 w-4 text-muted-foreground" />
          </divHeader>
          <divContent>
            <div className="text-2xl font-bold text-yellow-600">LKR {totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </divContent>
        </div>

        <div>
          <divHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <divTitle className="text-sm font-medium">Total Transactions</divTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </divHeader>
          <divContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All time transactions</p>
          </divContent>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id}>
            <divContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{payment.venueName}</h3>
                    <span className={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Payment ID:</span> {payment.id}
                    </div>
                    <div>
                      <span className="font-medium">Method:</span> {payment.method}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(payment.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold">LKR {payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Transaction: {payment.transactionId}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    {payment.status === "completed" && (
                      <button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </divContent>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="text-center py-12">
          <divContent>
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No payments yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment history will appear here once you make bookings
            </p>
          </divContent>
        </div>
      )}
    </div>
  )
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
