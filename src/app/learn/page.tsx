"use client";

import type React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronRight } from "lucide-react";
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
import { BLOCKCHAIN_EXPERT_QUESTION } from "@/lib/questions/blockchain-expert";
import Link from "next/link";

const formSchema = z.object({
  answer: z.string().min(1, { message: "Please select an answer" }),
});

const QuestionGame: React.FC = () => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const { control, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
    },
  });

  const currentQuestion = BLOCKCHAIN_EXPERT_QUESTION[currentQuestionIndex];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const selectedAnswerIndex = Number.parseInt(data.answer);
    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
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

    if (currentQuestionIndex < BLOCKCHAIN_EXPERT_QUESTION.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      reset();
    } else {
      toast({
        title: "Game Over!",
        description: `Your final score is ${
          score + (isCorrect ? 1 : 0)
        } out of ${BLOCKCHAIN_EXPERT_QUESTION.length}`,
        variant: "default",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#FF69B4] via-[#9370DB] to-[#87CEEB]">
      {/* Navbar */}
      <nav className=" z-10 px-6 py-4 flex justify-between items-center">
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
      <div className="min-h-screen  px-4 py-8 flex flex-col items-center justify-center h-full w-full">
        <div className="max-w-2xl mx-auto min-w-min ">
          <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white pixel-font text-center">
                Mina Protocol Quiz
              </CardTitle>
              <CardDescription className="text-white/60 pixel-font text-center">
                Question {currentQuestionIndex + 1} of{" "}
                {BLOCKCHAIN_EXPERT_QUESTION.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl text-white pixel-font">
                    {currentQuestion.question}
                  </h2>
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
            </CardContent>
            <CardFooter>
              <p className="text-white/60 pixel-font text-sm">
                Current Score: {score}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionGame;
