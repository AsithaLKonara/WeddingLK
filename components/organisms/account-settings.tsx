"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Shield } from "lucide-react"

export function AccountSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleChangePassword = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: "Password changed successfully!", type: "success" })
    } catch (error) {
      toast({ title: "Failed to change password", type: "error" })
    }
  }

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({ title: "Account deleted", type: "success" })
    } catch (error) {
      toast({ title: "Failed to delete account", type: "error" })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password for better security.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>Permanently delete your account and all associated data.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </AlertDescription>
              </Alert>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Are you sure? Type "DELETE" to confirm.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Confirm Delete"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


export default AccountSettings
