"use client";

import { useState } from "react";
import Link from "next/link";
import GradientText from "@/components/gradientText";
import { createSlug } from "@/lib/utils";
import * as React from 'react';

export default function CampaignApplyPage({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
  searchParams 
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ campaignTitle?: string, brandName?: string, description?: string }>
}) {
  const { campaignTitle, brandName, description } = React.use(searchParams);
  
  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    trackTitle: "",
    trackLink: "",
    genre: "",
    comments: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  if (!campaignTitle) {
    return (
      <div className="w-full py-5 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Campaign Not Found</h1>
          <p className="mb-8">The campaign you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/campaigns"
            className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // In a real app, you would submit the form data to your API here
      console.log("Form submitted:", formData);
    }, 1500);
  };
  
  if (submitted) {
    return (
      <div className="w-full py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="rounded-2xl bg-card border border-border p-8 mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-8 h-8 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for applying to the {campaignTitle} campaign! We&apos;ll review your submission and get back to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/campaigns/${createSlug(campaignTitle)}`}
                className="px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Campaign Details
              </Link>
              <Link
                href="/campaigns"
                className="px-6 py-3 rounded-full border border-border hover:bg-card/80 transition-colors"
              >
                Browse More Campaigns
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full py-20">
      <div className="max-w-3xl mx-auto px-4">
        <Link 
          href={`/campaigns/${createSlug(campaignTitle)}`}
          className="inline-flex items-center text-sm font-medium mb-8 hover:text-primary transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Campaign
        </Link>
        
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">
            <GradientText
              colors={["#8acfcf", "#A86523", "#8acfcf"]}
              animationSpeed={6}
              showBorder={false}
            >
              Apply to {campaignTitle}
            </GradientText>
          </h1>
          {description && <p className="text-muted-foreground">{description}</p>}
          {brandName && <p className="text-sm text-muted-foreground mt-2">By {brandName}</p>}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl bg-card border border-border p-6 space-y-6">
            <div>
              <label htmlFor="artistName" className="block text-sm font-medium mb-2">
                Artist/Band Name *
              </label>
              <input
                type="text"
                id="artistName"
                name="artistName"
                required
                value={formData.artistName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="trackTitle" className="block text-sm font-medium mb-2">
                Track Title *
              </label>
              <input
                type="text"
                id="trackTitle"
                name="trackTitle"
                required
                value={formData.trackTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="trackLink" className="block text-sm font-medium mb-2">
                Track Link (SoundCloud, Spotify, etc.) *
              </label>
              <input
                type="url"
                id="trackLink"
                name="trackLink"
                required
                value={formData.trackLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-2">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                required
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a genre</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="electronic">Electronic</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="r-and-b">R&B</option>
                <option value="country">Country</option>
                <option value="folk">Folk</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="comments" className="block text-sm font-medium mb-2">
                Additional Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                rows={4}
                value={formData.comments}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>
          </div>
          
          <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-border rounded-sm bg-background focus:ring-primary focus:ring-1"
                />
              </div>
              <label htmlFor="terms" className="ml-3 text-sm text-muted-foreground">
                I agree to the terms and conditions and understand that my submission will be reviewed before being accepted.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 