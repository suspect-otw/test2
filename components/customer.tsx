"use client";

import CountUp from "@/components/count-numbers";
import GradientText from "@/components/gradientText";

interface StatCardProps {
  count: number;
  label: string;
  prefix?: string;
}

function StatCard({ count, label, prefix = "+" }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-8 rounded-2xl border border-border bg-card backdrop-blur-sm transition-all hover:border-primary/20 hover:scale-105">
      <div className="text-4xl font-bold mb-3">
        <GradientText
          colors={["#8acfcf", "#A86523", "#8acfcf"]}
          animationSpeed={6}
          showBorder={false}
        >
          {prefix}
          <CountUp 
            from={0} 
            to={count} 
            separator="," 
            duration={2} 
          />
        </GradientText>
      </div>
      <p className="text-muted-foreground text-center">{label}</p>
    </div>
  );
}

export default function Customer() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">
            Our Impact By Numbers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard 
            count={100} 
            label="Campaigns Launched" 
          />
          <StatCard 
            count={200} 
            label="Happy Clients" 
          />
          <StatCard 
            count={2500} 
            label="Active Participants" 
          />
        </div>
      </div>
    </section>
  );
} 