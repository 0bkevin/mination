"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Award, Brain, ChevronRight, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const page: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [storedUsername, setStoredUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const username = localStorage.getItem("minationUsername")
    setStoredUsername(username)
  }, [])

  const handleStartLearning = () => {
    if (storedUsername) {
      router.push("/learn")
    } else {
      setIsDialogOpen(true)
    }
  }

  const handleSubmitUsername = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      localStorage.setItem("minationUsername", username.trim())
      setIsDialogOpen(false)
      router.push("/learn")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF69B4] via-[#9370DB] to-[#87CEEB] overflow-hidden h-full">
      {/* Background texture */}

      {/* Navbar */}
      <nav className="z-10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl pixel-font text-white">Mination</span>
        </Link>
        {storedUsername && (
          <Link href="/dashboard" passHref>
            <Button
              variant="outline"
              className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:border-white/60 pixel-font text-sm"
            >
              Go to dashboard
            </Button>
          </Link>
        )}
      </nav>

      {/* Main content */}
      <main className="z-10 container mx-auto h-full">
        <div className="text-center space-y-12 flex flex-col justify-center items-center min-h-screen">
          <h1 className="text-5xl pixel-font text-white text-shadow-glow mb-6 animate-fade-in-down">
            Welcome to Mination
          </h1>
          <p className="text-xl md:text-2xl text-white/80 pixel-font animate-fade-in-up">
            Learn, Earn, and Lead in the Mina Blockchain Ecosystem
          </p>
          <div className="animate-fade-in-up pt-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {/* <DialogTrigger asChild> */}
                <Button
                  size="lg"
                  onClick={handleStartLearning}
                  className="bg-white/20 text-white border-4 border-white/40 hover:bg-white/30 hover:border-white/60 pixel-font text-xl px-8 py-6"
                >
                  {storedUsername ? "Continue Learning" : "Start Learning"}
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Button>
              {/* </DialogTrigger> */}
              <DialogContent className="bg-[#1a1a2e] border-2 border-white/40">
                <DialogHeader>
                  <DialogTitle className="text-2xl pixel-font text-white">Enter Your Name</DialogTitle>
                  <DialogDescription className="pixel-font text-white/60">
                    Choose a name or nickname to start your Mination journey.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitUsername}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right pixel-font text-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="col-span-3 bg-white/10 border-white/40 text-white pixel-font"
                        placeholder="Enter your name or nickname"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-white/20 text-white border-2 border-white/40 hover:bg-white/30 hover:border-white/60 pixel-font"
                    >
                      Start Adventure
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in-up min-h-screen items-center">
          <FeatureCard icon={<Brain />} title="Learn Mina">
            Dive deep into the Mina blockchain and its ecosystem through
            interactive lessons and quizzes.
          </FeatureCard>
          <FeatureCard icon={<Trophy />} title="Earn Points">
            Answer questions correctly to earn points and climb the ranks of
            Mina experts.
          </FeatureCard>
          <FeatureCard icon={<Award />} title="Collect Badges">
            Unlock achievements and earn badges as you master different levels
            of Mina knowledge.
          </FeatureCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 flex items-center justify-center">
        <p className="text-white/60 text-xs pixel-font">
          Made with ❤️ by{" "}
          <a href="https://www.kevinbravo.com" className="text-white underline">
            Kevin
          </a>
        </p>
      </footer>

      {/* Floating pixels */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border-2 border-white/20 hover:border-white/40 transition-all duration-200 max-h-fit cursor-pointer">
    <div className="text-white mb-4">{icon}</div>
    <h3 className="text-xl pixel-font text-white mb-2">{title}</h3>
    <p className="text-white/80 text-sm">{children}</p>
  </div>
);

export default page;