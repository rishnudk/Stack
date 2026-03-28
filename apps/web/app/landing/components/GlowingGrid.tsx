"use client";

import { 
  Layout, 
  BarChart3, 
  Briefcase, 
  MessageSquare, 
  Hash 
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingGrid() {
  return (
    <section className="py-24 bg-black">
        <div className="container mx-auto px-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center text-white">
                Engineered for Connection
            </h2>
            <p className="mt-4 text-gray-400 text-center max-w-2xl mx-auto">
                The social platform where your code speaks louder than words. Build your network, showcase your stats, and find your next opportunity.
            </p>
        </div>
        <div className="max-w-7xl mx-auto px-4">
            <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-136 xl:grid-rows-2">
            <GridItem
                area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                icon={<Layout className="h-4 w-4" />}
                title="A Feed That Understands Code"
                description="Join a vibrant community of developers. Share snippets, celebrate milestones, and discover content tailored to your stack."
            />
            <GridItem
                area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                icon={<BarChart3 className="h-4 w-4" />}
                title="Showcase Your Impact"
                description="Sync your GitHub contributions and LeetCode streaks directly. Let your real-world progress do the talking."
            />
            <GridItem
                area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                icon={<Briefcase className="h-4 w-4" />}
                title="Land Your Dream Role"
                description="Our 'Hire Me' system connects talent with opportunity. Build social proof and let recruiters find you based on verified skills."
            />
            <GridItem
                area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                icon={<MessageSquare className="h-4 w-4" />}
                title="Real-time Collaboration"
                description="Native DM and group messaging built for speed. Coordinate on projects or geek out over the latest framework releases."
            />
            <GridItem
                area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                icon={<Hash className="h-4 w-4" />}
                title="Master the Trends"
                description="Follow specific technologies via hashtags. From #rust to #nextjs, stay ahead of the curve and curate your perfect feed."
            />
            </ul>
        </div>
    </section>
  );
}


interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-56 list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-5.5 font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-7.5 text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-4.5 md:text-base md:leading-5.5 text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
