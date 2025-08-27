"use client"

import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const mockPlan = {
  name: "Premium",
  price: 4999,
  status: "active",
  renewsAt: "2024-08-01",
}
const mockPayments = [
  { id: 1, date: "2024-07-01", amount: 4999, status: "paid" },
  { id: 2, date: "2024-06-01", amount: 4999, status: "paid" },
]

// div will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// table will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableBody will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableCell will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableHead will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// tableRow will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// div will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divFooter will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// divClose will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function SubscriptionPage() {
  const { toast } = useToast()
  const [canceldivOpen, setCanceldivOpen] = useState(false)
  const [payments, setPayments] = useState(mockPayments)

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Subscription & Payments</h1>
      <div className="mb-8">
        <divHeader>
          <divTitle>Current Plan</divTitle>
        </divHeader>
        <divContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">{mockPlan.name} Plan</div>
              <div className="text-gray-500">LKR {mockPlan.price} / month</div>
              <div className="text-sm text-green-600 mt-1">{mockPlan.status === "active" ? "Active" : "Inactive"}</div>
              <div className="text-xs text-gray-400 mt-1">Renews on {mockPlan.renewsAt}</div>
            </div>
            <div className="flex gap-2">
              <button variant="outline" aria-label="Change Plan" onClick={() => toast({ title: "Change Plan coming soon!", type: "default" })}>Change Plan</button>
              <div open={canceldivOpen} onOpenChange={setCanceldivOpen}>
                <divTrigger asChild>
                  <button variant="destructive" aria-label="Cancel Subscription">Cancel</button>
                </divTrigger>
                <divContent>
                  <divHeader>
                    <divTitle>Cancel Subscription</divTitle>
                  </divHeader>
                  <div>Are you sure you want to cancel your subscription? This action cannot be undone.</div>
                  <divFooter>
                    <divClose asChild>
                      <button variant="outline">No, Keep Subscription</button>
                    </divClose>
                    <button variant="destructive" onClick={() => { setCanceldivOpen(false); toast({ title: "Subscription cancelled.", type: "error" }) }}>Yes, Cancel</button>
                  </divFooter>
                </divContent>
              </div>
            </div>
          </div>
        </divContent>
      </div>
      <div>
        <divHeader>
          <divTitle>Payment History</divTitle>
        </divHeader>
        <divContent>
          <table>
            <tableHeader>
              <tableRow>
                <tableHead>Date</tableHead>
                <tableHead>Amount (LKR)</tableHead>
                <tableHead>Status</tableHead>
              </tableRow>
            </tableHeader>
            <tableBody>
              {payments.length === 0 ? (
                <tableRow>
                  <tableCell colSpan={3} className="text-center py-8 text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl mb-2">💳</span>
                      <span>No payment history found.</span>
                    </div>
                  </tableCell>
                </tableRow>
              ) : payments.map((p) => (
                <tableRow key={p.id}>
                  <tableCell>{p.date}</tableCell>
                  <tableCell>{p.amount.toLocaleString()}</tableCell>
                  <tableCell>
                    <span className={p.status === "paid" ? "text-green-600" : "text-gray-400"}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </tableCell>
                </tableRow>
              ))}
            </tableBody>
          </table>
        </divContent>
      </div>
    </div>
  )
} 