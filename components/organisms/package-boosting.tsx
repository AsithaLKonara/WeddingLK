"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { 
  TrendingUp, 
  Target, 
  Users, 
  MapPin, 
  Calendar,
  DollarSign,
  BarChart3,
  Zap
} from 'lucide-react'

interface BoostCampaign {
  id: string
  packageId: string
  packageName: string
  budget: number
  duration: number
  targetAudience: {
    ageRange: number[]
    location: string
    interests: string[]
    budgetRange: number[]
  }
  status: 'active' | 'paused' | 'completed'
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
  }
  createdAt: Date
  endDate: Date
}

const PackageBoosting: React.FC = () => {
  const { toast } = useToast()
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [budget, setBudget] = useState<number>(50000)
  const [duration, setDuration] = useState<number>(7)
  const [targetAge, setTargetAge] = useState<number[]>([25, 45])
  const [targetLocation, setTargetLocation] = useState<string>('Colombo')
  const [targetInterests, setTargetInterests] = useState<string[]>([])
  const [budgetRange, setBudgetRange] = useState<number[]>([1000000, 5000000])

  // Mock packages data
  const packages = [
    {
      id: '1',
      name: 'Luxury Wedding Experience',
      price: 2500000,
      description: 'Complete luxury wedding package with premium services',
      category: 'luxury'
    },
    {
      id: '2',
      name: 'Traditional Wedding Package',
      price: 1500000,
      description: 'Beautiful traditional wedding with cultural elements',
      category: 'traditional'
    },
    {
      id: '3',
      name: 'Modern Minimalist Wedding',
      price: 1800000,
      description: 'Contemporary wedding with clean aesthetics',
      category: 'modern'
    }
  ]

  // Mock active campaigns
  const activeCampaigns: BoostCampaign[] = [
    {
      id: '1',
      packageId: '1',
      packageName: 'Luxury Wedding Experience',
      budget: 75000,
      duration: 14,
      targetAudience: {
        ageRange: [28, 45],
        location: 'Colombo',
        interests: ['luxury', 'premium', 'exclusive'],
        budgetRange: [2000000, 5000000]
      },
      status: 'active',
      performance: {
        impressions: 15420,
        clicks: 1234,
        conversions: 89,
        ctr: 8.0,
        cpc: 60.8
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]

  const interestOptions = [
    'luxury', 'traditional', 'modern', 'outdoor', 'indoor', 'beach', 'garden',
    'cultural', 'international', 'local', 'premium', 'budget-friendly'
  ]

  const locationOptions = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Polonnaruwa',
    'Trincomalee', 'Batticaloa', 'Ratnapura', 'Kegalle'
  ]

  const handleCreateCampaign = () => {
    if (!selectedPackage) {
      toast({
        title: 'Error',
        description: 'Please select a package to boost'
      })
      return
    }

    const packageData = packages.find(p => p.id === selectedPackage)
    if (!packageData) return

    toast({
      title: 'Campaign Created',
      description: `Boost campaign created for ${packageData.name}`
    })

    // TODO: Implement real campaign creation
    console.log('Creating boost campaign:', {
      packageId: selectedPackage,
      budget,
      duration,
      targetAudience: {
        ageRange: targetAge,
        location: targetLocation,
        interests: targetInterests,
        budgetRange: budgetRange
      }
    })
  }

  const handleInterestToggle = (interest: string) => {
    setTargetInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const calculateEstimatedReach = () => {
    // Simple estimation based on budget and duration
    const dailyBudget = budget / duration
    const estimatedImpressions = dailyBudget * 200 // Rough estimate
    const estimatedClicks = estimatedImpressions * 0.08 // 8% CTR
    const estimatedConversions = estimatedClicks * 0.07 // 7% conversion rate
    
    return {
      impressions: Math.round(estimatedImpressions),
      clicks: Math.round(estimatedClicks),
      conversions: Math.round(estimatedConversions)
    }
  }

  const estimatedReach = calculateEstimatedReach()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Package Boosting</h1>
        <p className="text-muted-foreground">
          Boost your wedding packages and reach more couples with targeted advertising
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Create Boost Campaign
              </CardTitle>
              <CardDescription>
                Set up a targeted advertising campaign for your wedding package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Selection */}
              <div className="space-y-2">
                <Label htmlFor="package">Select Package to Boost</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a wedding package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{pkg.name}</span>
                          <span className="text-sm text-muted-foreground">
                            LKR {pkg.price.toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Daily Budget (LKR)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min="1000"
                    max="1000000"
                    step="1000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Min: LKR 1,000 | Max: LKR 1,000,000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Campaign Duration (Days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    max="90"
                  />
                  <p className="text-xs text-muted-foreground">
                    Min: 1 day | Max: 90 days
                  </p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-4">
                <Label>Target Audience</Label>
                
                {/* Age Range */}
                <div className="space-y-2">
                  <Label>Age Range: {targetAge[0]} - {targetAge[1]} years</Label>
                  <Slider
                    value={targetAge}
                    onValueChange={setTargetAge}
                    min={18}
                    max={65}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Target Location</Label>
                  <Select value={targetLocation} onValueChange={setTargetLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label>Target Interests</Label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={targetInterests.includes(interest)}
                          onCheckedChange={() => handleInterestToggle(interest)}
                        />
                        <Label htmlFor={interest} className="text-sm">
                          {interest.charAt(0).toUpperCase() + interest.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                  <Label>Target Budget Range: LKR {budgetRange[0].toLocaleString()} - {budgetRange[1].toLocaleString()}</Label>
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    min={100000}
                    max={10000000}
                    step={100000}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Estimated Results */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">Estimated Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {estimatedReach.impressions.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Impressions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {estimatedReach.clicks.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Clicks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {estimatedReach.conversions.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Create Campaign Button */}
              <Button 
                onClick={handleCreateCampaign}
                className="w-full"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Create Boost Campaign
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns & Stats */}
        <div className="space-y-6">
          {/* Active Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCampaigns.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No active campaigns
                </p>
              ) : (
                activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{campaign.packageName}</h4>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <div className="font-medium">LKR {campaign.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{campaign.duration} days</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impressions:</span>
                        <span className="font-medium">{campaign.performance.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Clicks:</span>
                        <span className="font-medium">{campaign.performance.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CTR:</span>
                        <span className="font-medium">{campaign.performance.ctr}%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {activeCampaigns.reduce((sum, c) => sum + c.performance.impressions, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Impressions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {activeCampaigns.reduce((sum, c) => sum + c.performance.conversions, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Conversions</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  LKR {activeCampaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PackageBoosting
