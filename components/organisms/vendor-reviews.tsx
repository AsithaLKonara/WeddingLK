"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface VendorReviewsProps {
  vendorId: string
}

export function VendorReviews({ vendorId }: VendorReviewsProps) {
  // Mock reviews data
  const reviews = [
    {
      id: "1",
      user: {
        name: "Sarah & John",
        avatar: "/placeholder-user.jpg"
      },
      rating: 5,
      title: "Amazing photography!",
      comment: "Perfect Moments Photography captured our special day beautifully. Highly recommended!",
      date: "2024-03-15"
    },
    {
      id: "2",
      user: {
        name: "Maria & David",
        avatar: "/placeholder-user.jpg"
      },
      rating: 4,
      title: "Great service",
      comment: "Professional and punctual. The photos turned out great.",
      date: "2024-02-28"
    },
    {
      id: "3",
      user: {
        name: "Lisa & Mike",
        avatar: "/placeholder-user.jpg"
      },
      rating: 5,
      title: "Exceeded expectations",
      comment: "The photographer was creative and captured all the important moments.",
      date: "2024-01-20"
    }
  ]

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>What couples say about this vendor</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-500">{reviews.length} reviews</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{review.user.name}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <h5 className="font-medium mb-1">{review.title}</h5>
                  <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


export default VendorReviews
