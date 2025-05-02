"use client";

import Aurora from "@/components/aurora";
import GradientText from "@/components/gradientText";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-background">
      {/* Aurora background component with reduced opacity */}
      <div className="absolute inset-0 w-full h-full opacity-80">
        <Aurora 
          colorStops={["#A86523", "#8acfcf", "#A86523"]}
          blend={0.1}
          amplitude={1}
          speed={0.8}
        />
      </div>
      
      {/* Content on top of Aurora */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-6 px-4 py-4">
         <GradientText
             colors={["#8acfcf", "#A86523", "#8acfcf", "#A86523", "#8acfcf"]}
             animationSpeed={8}
             showBorder={false}
          >
          BEST MUSIC CAMPAIGNS
        </GradientText>
        </h1>
        <p className="text-xl text-white max-w-2xl mb-8">Find the best music campaign for you</p>
        
        <Link href="/campaigns">
          <GradientText
            colors={["#A86523", "#8acfcf", "#A86523", "#8acfcf", "#A86523"]}
            animationSpeed={7}
            showBorder={true}
            className="text-lg font-bold px-12 py-4 min-w-[200px] hover:scale-105 transition-transform"
          >
            DISCOVER
          </GradientText>
        </Link>
      </div>
      
      <div className="absolute bottom-0 w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
}
