"use client";

import React from "react";

const marqueeStyles = `
@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% - 1rem));
  }
}

.marquee-animate {
  animation: marquee-scroll var(--marquee-speed) linear infinite;
}

.marquee-container:hover .marquee-animate.pause-on-hover {
  animation-play-state: paused;
}
`;

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = "left",
  speed = 40,
  pauseOnHover = false,
  className = "",
}: MarqueeProps) {
  return (
    <>
      <style>{marqueeStyles}</style>
      <div
        className={`marquee-container flex overflow-hidden gap-4 ${className}`}
        style={{
          maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`marquee-animate flex shrink-0 gap-4 ${pauseOnHover ? "pause-on-hover" : ""}`}
            style={{
              "--marquee-speed": `${speed}s`,
              animationDirection: direction === "right" ? "reverse" : "normal",
              willChange: "transform",
            } as React.CSSProperties}
            aria-hidden={i > 0}
          >
            {children}
          </div>
        ))}
      </div>
    </>
  );
}

interface Testimonial {
  name: string;
  username: string;
  content: string;
  avatar?: string;
  className?: string;
}

export function TestimonialCard({
  name,
  username,
  content,
  avatar,
  className = "",
}: Testimonial) {
  return (
    <div
      className={`relative w-87.5 shrink-0 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 backdrop-blur-sm transition-all ease-out duration-300 hover:border-zinc-700/60 hover:bg-zinc-900/60 ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-9.5 h-9.5 rounded-full object-cover border border-zinc-700/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-zinc-700/50">
            <span className="text-sm font-medium text-zinc-300">
              {name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-200">{name}</span>
          <span className="text-xs text-zinc-500">{username}</span>
        </div>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{content}</p>
    </div>
  );
}

interface TestimonialMarqueeProps {
  testimonials?: Testimonial[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function TestimonialMarquee({
  testimonials = [],
  speed = 40,
  pauseOnHover = true,
  className = "",
}: TestimonialMarqueeProps) {
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <div className={`relative flex flex-col gap-4 overflow-hidden py-4 ${className}`}>
      <div className="pb-px">
        <Marquee direction="left" speed={speed} pauseOnHover={pauseOnHover}>
          {firstRow.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </Marquee>
      </div>
      <Marquee direction="right" speed={speed} pauseOnHover={pauseOnHover}>
        {secondRow.map((testimonial, idx) => (
          <TestimonialCard key={idx} {...testimonial} />
        ))}
      </Marquee>
    </div>
  );
}
