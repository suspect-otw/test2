import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  className = "",
  action
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-4 h-1 w-20 bg-primary rounded-full"></div>
    </div>
  );
} 