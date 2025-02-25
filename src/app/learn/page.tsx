"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronRight, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { BLOCKCHAIN_EXPERT_QUESTION } from "@/lib/questions/blockchain-expert";
import { MINA_ADVANCE_QUESTION } from "@/lib/questions/mina-advance";
import { MINA_BASICS_QUESTION } from "@/lib/questions/mina-basics";
import Link from "next/link";

const formSchema = z.object({
  answer: z.string().min(1, { message: "Please select an answer" }),
});

type Level = "basics" | "advanced" | "expert";

interface UserProgress {
  currentLevel: Level;
  answeredQuestions: {
    [key in Level]: number[];
  };
  points: {
    [key in Level]: number;
  };
}

const initialProgress: UserProgress = {
  currentLevel: "basics",
  answeredQuestions: {
    basics: [],
    advanced: [],
    expert: [],
  },
  points: {
    basics: 0,
    advanced: 0,
    expert: 0,
  },
};

const QuestionGame: React.FC = () => {
  const { toast } = useToast();
  const [userProgress, setUserProgress] =
    useState<UserProgress>(initialProgress);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { control, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  const questions = {
    basics: BLOCKCHAIN_EXPERT_QUESTION,
    advanced: MINA_BASICS_QUESTION,
    expert: MINA_ADVANCE_QUESTION,
  };

  useEffect(() => {
    const savedProgress = localStorage.getItem("minationProgress");
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("minationProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  const currentQuestion =
    questions[userProgress.currentLevel][currentQuestionIndex];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const selectedAnswerIndex = Number.parseInt(data.answer);
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;

    setUserProgress((prev) => {
      const newProgress = { ...prev };
      if (
        !newProgress.answeredQuestions[prev.currentLevel].includes(
          currentQuestionIndex
        )
      ) {
        newProgress.answeredQuestions[prev.currentLevel].push(
          currentQuestionIndex
        );
      }
      if (isCorrect) {
        newProgress.points[prev.currentLevel]++;
      }
      return newProgress;
    });

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! You've earned a point.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${
          currentQuestion.options[currentQuestion.correctAnswer]
        }`,
        variant: "destructive",
      });
    }

    if (
      currentQuestionIndex <
      questions[userProgress.currentLevel].length - 1
    ) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      reset();
    } else {
      toast({
        title: "Level Complete!",
        description: `Your final score for ${userProgress.currentLevel} is ${
          userProgress.points[userProgress.currentLevel]
        } out of ${questions[userProgress.currentLevel].length}`,
        variant: "default",
      });
      setCurrentQuestionIndex(0);
      if (
        userProgress.currentLevel === "basics" &&
        userProgress.points.basics >= questions.basics.length * 0.7
      ) {
        setUserProgress((prev) => ({ ...prev, currentLevel: "advanced" }));
      } else if (
        userProgress.currentLevel === "advanced" &&
        userProgress.points.advanced >= questions.advanced.length * 0.7
      ) {
        setUserProgress((prev) => ({ ...prev, currentLevel: "expert" }));
      }
    }
  };

  const handleLevelChange = (level: Level) => {
    if (
      (level === "advanced" &&
        userProgress.points.basics >= questions.basics.length * 0.7) ||
      (level === "expert" &&
        userProgress.points.advanced >= questions.advanced.length * 0.7) ||
      level === "basics"
    ) {
      setUserProgress((prev) => ({ ...prev, currentLevel: level }));
      setCurrentQuestionIndex(0);
      reset();
    } else {
      toast({
        title: "Level Locked",
        description:
          "You need to complete 70% of the previous level to unlock this one.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FF69B4] via-[#9370DB] to-[#87CEEB]">
      <nav className="z-10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl pixel-font text-white">Mination</span>
        </Link>
        <Link href="/dashboard" passHref>
          <Button
            variant="outline"
            className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:border-white/60 pixel-font text-sm"
          >
            Go to dashboard
          </Button>
        </Link>
      </nav>
      <div className="min-h-screen  px-4 py-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white pixel-font text-center">
                Mination
              </CardTitle>
              <CardDescription className="text-white/60 pixel-font text-center">
                Test your knowledge across different levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={userProgress.currentLevel}
              
                onValueChange={(value: Level) => handleLevelChange(value)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-white/10">
                  <TabsTrigger
                    value="basics"
                    className="pixel-font text-white data-[state=active]:bg-white/20"
                  >
                    Basics
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="pixel-font text-white data-[state=active]:bg-white/20"
                    disabled={
                      userProgress.points.basics < questions.basics.length * 0.7
                    }
                  >
                    {userProgress.points.basics <
                      questions.basics.length * 0.7 && (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    Advanced
                  </TabsTrigger>
                  <TabsTrigger
                    value="expert"
                    className="pixel-font text-white data-[state=active]:bg-white/20"
                    disabled={
                      userProgress.points.advanced <
                      questions.advanced.length * 0.7
                    }
                  >
                    {userProgress.points.advanced <
                      questions.advanced.length * 0.7 && (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    Expert
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={userProgress.currentLevel}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mt-4"
                  >
                    <div className="space-y-4">
                      <h2 className="text-xl text-white pixel-font">
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions[userProgress.currentLevel].length}
                      </h2>
                      <p className="text-white pixel-font">
                        {currentQuestion.question}
                      </p>
                      <Controller
                        name="answer"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                          >
                            {currentQuestion.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={index.toString()}
                                  id={`option-${index}`}
                                  className="border-2 border-white/40 text-white"
                                />
                                <Label
                                  htmlFor={`option-${index}`}
                                  className="text-white pixel-font text-sm"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 pixel-font"
                    >
                      Submit Answer
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-white/60 pixel-font text-sm">
                Current Score: {userProgress.points[userProgress.currentLevel]}
              </p>
              <p className="text-white/60 pixel-font text-sm">
                Level: {userProgress.currentLevel}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionGame;
