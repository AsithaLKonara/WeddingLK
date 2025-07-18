"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Globe, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VendorContactProps {
  vendor: {
    id: string
    name: string
    contact: {
      phone: string
      email: string
      website: string
    }
  }
}

export function VendorContact({ vendor }: VendorContactProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ 
        title: "Message sent successfully!", 
        description: "The vendor will get back to you soon.",
        variant: "default"
      })
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      toast({ 
        title: "Failed to send message", 
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Contact Vendor</CardTitle>
        <CardDescription>Get in touch with {vendor.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{vendor.contact.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{vendor.contact.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{vendor.contact.website}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Send Message
          </h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your requirements..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[100px]"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
