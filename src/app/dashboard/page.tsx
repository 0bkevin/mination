"use client"

import type React from "react"
import { Trophy, Award, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// This would typically come from your API or user state
const mockUserData = {
  points: 750,
  badges: [
    { name: "Blockchain Expert", achieved: true, icon: Trophy },
    { name: "Mina Explorer", achieved: true, icon: Award },
    { name: "Mina Navigator", achieved: false, icon: Star },
  ],
  totalQuestions: 30,
  answeredQuestions: 75,
}

const UserDashboard: React.FC = () => {
  const username =  localStorage.getItem  ("minationUsername") || "User"
  const {  points, badges, totalQuestions, answeredQuestions } = mockUserData

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF69B4] via-[#9370DB] to-[#87CEEB] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white pixel-font text-center">Welcome, {username}!</CardTitle>
            <CardDescription className="text-white/60 pixel-font text-center">Your Mination Journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl text-white pixel-font mb-2">Total Points</h2>
              <span className="text-4xl text-yellow-300 pixel-font">{points}</span>
            </div>
            <div>
              <h3 className="text-xl text-white pixel-font mb-2">Progress</h3>
              <Progress value={(answeredQuestions / totalQuestions) * 100} className="h-4" />
              <p className="text-white/60 pixel-font text-sm mt-2">
                {answeredQuestions} / {totalQuestions} questions answered
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white pixel-font">Your Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
                  <badge.icon className={`w-12 h-12 mb-2 ${badge.achieved ? "text-yellow-300" : "text-gray-400"}`} />
                  <span className={`text-sm pixel-font ${badge.achieved ? "text-white" : "text-white/40"}`}>
                    {badge.name}
                  </span>
                  {!badge.achieved && <span className="text-xs pixel-font text-white/40 mt-1">Not yet achieved</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 pixel-font">
            Take a Quiz
          </Button>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 pixel-font">
            View Leaderboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

