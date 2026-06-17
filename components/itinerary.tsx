"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, Coffee, Utensils, Award, Users, Car, Music } from "lucide-react"

const scheduleData = [
  {
    id: "day-1",
    day: "Day 1",
    events: [
      { time: "08:30 AM – 09:30 AM", title: "Registration", icon: Users },
      { time: "10:00 AM – 11:00 AM", title: "Opening Ceremony", icon: Award },
      { time: "11:30 AM – 01:00 PM", title: "Committee Session 1", icon: Users },
      { time: "01:00 PM – 02:00 PM", title: "Lunch", icon: Utensils },
      { time: "02:00 PM – 04:30 PM", title: "Committee Session 2", icon: Users },
      { time: "04:30 PM – 06:30 PM", title: "Auto Expo", icon: Car },
      { time: "06:30 PM", title: "Dispersal", icon: MapPin }
    ]
  },
  {
    id: "day-2",
    day: "Day 2",
    events: [
      { time: "09:00 AM – 12:00 PM", title: "Committee Session 3", icon: Users },
      { time: "12:00 PM – 01:00 PM", title: "Lunch", icon: Utensils },
      { time: "01:00 PM – 03:30 PM", title: "Committee Session 4", icon: Users },
      { time: "03:30 PM – 04:00 PM", title: "High Tea", icon: Coffee },
      { time: "04:00 PM – 05:30 PM", title: "Committee Session 5", icon: Users },
      { time: "05:30 PM Onwards", title: "Socials", icon: Music }
    ]
  },
  {
    id: "day-3",
    day: "Day 3",
    events: [
      { time: "09:00 AM – 12:00 PM", title: "Committee Session 6", icon: Users },
      { time: "12:00 PM – 01:00 PM", title: "Lunch", icon: Utensils },
      { time: "01:00 PM – 03:00 PM", title: "Committee Session 7", icon: Users },
      { time: "03:00 PM – 03:30 PM", title: "High Tea", icon: Coffee },
      { time: "04:00 PM – 06:00 PM", title: "Closing Ceremony & Awards", icon: Award },
      { time: "06:30 PM", title: "Final Departure", icon: MapPin }
    ]
  }
];

export default function Itinerary() {
  const [activeTab, setActiveTab] = useState(scheduleData[0].id)

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 relative z-10">
      <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
        {scheduleData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? "text-cyan-300"
                : "text-slate-400 hover:text-cyan-100 hover:bg-slate-800/50"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {tab.day}
            </span>
          </button>
        ))}
      </div>

      <div className="relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden min-h-[500px]">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          {scheduleData.map(
            (day) =>
              activeTab === day.id && (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 relative z-10"
                >
                  {day.events.map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 md:w-1/3 shrink-0 text-cyan-400 font-medium">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-sm md:text-base tracking-wide">{event.time}</span>
                      </div>

                      <div className="hidden md:block w-px h-12 bg-slate-800 group-hover:bg-cyan-500/30 transition-colors" />

                      <div className="flex items-center gap-4 md:w-2/3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:border-cyan-500/30 transition-colors">
                          <event.icon className="w-5 h-5 text-slate-300 group-hover:text-cyan-300 transition-colors" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-200 group-hover:text-white transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
