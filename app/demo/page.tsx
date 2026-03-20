"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import FloatingCard from "@/components/floating-card"

export default function Demo() {
  const [activeState, setActiveState] = useState<"session" | "voting" | "break" | "crisis">("session")

  const states = {
    session: { title: "Moderated Caucus", color: "blue", description: "Active debate in progress" },
    voting: { title: "Voting Procedure", color: "green", description: "Resolution voting underway" },
    break: { title: "Unmoderated Caucus", color: "yellow", description: "Informal negotiations" },
    crisis: { title: "Crisis Update", color: "red", description: "Breaking news alert" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container py-8">
        <Link href="/" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="container pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-5xl font-light text-slate-900">
              Integrated Tech <span className="font-semibold text-blue-600">Experience</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience our real-time committee status system. Toggle between states to see how delegates stay
              synchronized.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <FloatingCard className="p-8 bg-white border-slate-200">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">Live Committee Status</h3>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(states).map(([key, state]) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={activeState === key ? "default" : "outline"}
                      onClick={() => setActiveState(key as any)}
                      className={activeState === key ? `bg-${state.color}-600 hover:bg-${state.color}-700` : ""}
                    >
                      {state.title.split(" ")[0]}
                    </Button>
                  ))}
                </div>

                <FloatingCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">{states[activeState].title}</h4>
                      <div className={`w-3 h-3 bg-${states[activeState].color}-500 rounded-full animate-pulse`} />
                    </div>
                    <p className="text-slate-600">{states[activeState].description}</p>
                    <div className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</div>
                  </div>
                </FloatingCard>
              </div>
            </FloatingCard>

            <FloatingCard className="p-8 bg-white border-slate-200">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">How It Works</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Real-time Updates</h4>
                      <p className="text-sm text-slate-600">Committee chairs update status instantly via dashboard</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Live Projection</h4>
                      <p className="text-sm text-slate-600">Status displays in committee rooms and delegate devices</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Synchronized Experience</h4>
                      <p className="text-sm text-slate-600">All delegates stay aligned with current proceedings</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/#experience">Learn More</Link>
                </Button>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>
    </div>
  )
}
