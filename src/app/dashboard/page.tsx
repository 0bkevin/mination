"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Trophy, Award, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface UserProgress {
  currentLevel: "basics" | "advanced" | "expert";
  answeredQuestions: {
    basics: number[];
    advanced: number[];
    expert: number[];
  };
  points: {
    basics: number;
    advanced: number;
    expert: number;
  };
}

const TOTAL_QUESTIONS = {
  basics: 10, // Assuming 10 questions per level, adjust as needed
  advanced: 10,
  expert: 10,
};

const UserDashboard: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const savedProgress = localStorage.getItem("minationProgress");
    const savedUsername = localStorage.getItem("minationUsername");

    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  if (!userProgress) {
    return <div className="text-white pixel-font">Loading...</div>;
  }

  const totalPoints = Object.values(userProgress.points).reduce(
    (a, b) => a + b,
    0
  );
  const totalAnswered = Object.values(userProgress.answeredQuestions).flat()
    .length;
  const totalQuestions = Object.values(TOTAL_QUESTIONS).reduce(
    (a, b) => a + b,
    0
  );

  const badges = [
    {
      name: "Blockchain Expert",
      achieved: userProgress.points.basics >= TOTAL_QUESTIONS.basics * 0.7,
      icon: Trophy,
    },
    {
      name: "Mina Explorer",
      achieved: userProgress.points.advanced >= TOTAL_QUESTIONS.advanced * 0.7,
      icon: Award,
    },
    {
      name: "Mina Navigator",
      achieved: userProgress.points.expert >= TOTAL_QUESTIONS.expert * 0.7,
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF69B4] via-[#9370DB] to-[#87CEEB] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl text-white pixel-font text-center">
              Welcome, {username}!
            </CardTitle>
            <CardDescription className="text-white/60 pixel-font text-center">
              Your Mination Journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl text-white pixel-font mb-2">
                Total Points
              </h2>
              <span className="text-4xl text-yellow-300 pixel-font">
                {totalPoints}
              </span>
            </div>
            <div>
              <h3 className="text-xl text-white pixel-font mb-2">
                Overall Progress
              </h3>
              <Progress
                value={(totalAnswered / totalQuestions) * 100}
                className="h-4"
              />
              <p className="text-white/60 pixel-font text-sm mt-2">
                {totalAnswered} / {totalQuestions} questions answered
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(userProgress.points).map(([level, points]) => (
                <div key={level} className="text-center">
                  <h4 className="text-lg text-white pixel-font capitalize">
                    {level}
                  </h4>
                  <p className="text-yellow-300 pixel-font">
                    {points} /{" "}
                    {TOTAL_QUESTIONS[level as keyof typeof TOTAL_QUESTIONS]}{" "}
                    points
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white pixel-font">
              Your Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white/5 rounded-lg"
                >
                  <badge.icon
                    className={`w-12 h-12 mb-2 ${
                      badge.achieved ? "text-yellow-300" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm pixel-font ${
                      badge.achieved ? "text-white" : "text-white/40"
                    }`}
                  >
                    {badge.name}
                  </span>
                  {!badge.achieved && (
                    <span className="text-xs pixel-font text-white/40 mt-1">
                      Not yet achieved
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Link href="/learn">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 pixel-font">
              Start learning and earn points
            </Button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
