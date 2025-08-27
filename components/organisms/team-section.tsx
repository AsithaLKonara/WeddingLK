"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const teamMembers = [
  {
    name: 'Arjun Silva',
    role: 'CEO & Co-Founder',
    avatar: '/avatars/arjun.jpg',
    bio: 'Former tech executive with 15+ years in software development and business strategy.',
    initials: 'AS'
  },
  {
    name: 'Kavitha Perera',
    role: 'CTO & Co-Founder',
    avatar: '/avatars/kavitha.jpg',
    bio: 'Full-stack developer and wedding industry expert with a passion for user experience.',
    initials: 'KP'
  },
  {
    name: 'Dilshan Fernando',
    role: 'Head of Operations',
    avatar: '/avatars/dilshan.jpg',
    bio: 'Event management specialist with deep knowledge of Sri Lankan wedding traditions.',
    initials: 'DF'
  },
  {
    name: 'Priya Rajapaksa',
    role: 'Head of Marketing',
    avatar: '/avatars/priya.jpg',
    bio: 'Digital marketing expert focused on building authentic connections with our community.',
    initials: 'PR'
  }
]

export function TeamSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're a passionate team dedicated to revolutionizing wedding planning 
            in Sri Lanka through technology and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl text-gray-900">{member.name}</CardTitle>
                <p className="text-pink-600 font-medium">{member.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


export default TeamSection
