"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function HairyNosePage() {
  const [sensorReadings, setSensorReadings] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorReadings((prev) => [...prev.slice(-19), Math.floor(Math.random() * 1000)])
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black px-8 py-6">
        <Link href="/" className="font-mono text-3xl font-bold hover:underline">
          OpenSmell
        </Link>
        <p className="font-mono text-sm text-gray-600 mt-1">Hairy-Nose Sensor Playground</p>
      </header>

      {/* Main Content */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8">
          {/* Sensor Interface */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">MQ-135 Live Data Stream</h2>
            <div className="border border-black p-4 bg-gray-50 h-64 overflow-y-auto font-mono text-xs space-y-1">
              {sensorReadings.length === 0 ? (
                <p className="text-gray-500">Waiting for sensor data...</p>
              ) : (
                sensorReadings.map((reading, idx) => (
                  <div key={idx} className="text-gray-700">
                    [{new Date().toLocaleTimeString()}] Voltage: {reading.toString().padStart(4, "0")} mV
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Odor Matching */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Real-Time Odor Matching</h2>
            <div className="space-y-3">
              {[
                { chemical: "d-limonene", confidence: 87 },
                { chemical: "vanillin", confidence: 72 },
                { chemical: "camphor", confidence: 65 },
              ].map((match, idx) => (
                <div key={idx} className="border border-black p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm font-bold">{match.chemical}</span>
                    <span className="font-mono text-xs">{match.confidence}%</span>
                  </div>
                  <div className="h-2 border border-black">
                    <div className="h-full bg-black" style={{ width: `${match.confidence}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arduino Code */}
          <div className="border border-black p-6 col-span-2">
            <h2 className="font-mono text-xs font-bold uppercase mb-4">Arduino Code Snippet</h2>
            <div className="border border-black bg-gray-900 text-white p-4 font-mono text-xs overflow-x-auto">
              <pre>{`#include <MQ135.h>

const int MQ135_PIN = A0;
MQ135 mq135(MQ135_PIN);

void setup() {
  Serial.begin(9600);
}

void loop() {
  float ppm = mq135.getPPM();
  Serial.println(ppm);
  delay(500);
}`}</pre>
            </div>
            <button className="mt-3 border border-black px-4 py-2 font-mono text-xs hover:bg-gray-100 w-full">
              Copy Code
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
