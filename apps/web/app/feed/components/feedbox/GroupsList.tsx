import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui/card'
import { Button } from '@repo/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'React Developers',
    description: 'A community for React.js enthusiasts to share knowledge and projects.',
    memberCount: 12500,
    image: 'https://github.com/facebook.png'
  },
  {
    id: '2',
    name: 'Startup Founders',
    description: 'Connect with other founders, share resources, and get feedback.',
    memberCount: 8400,
    image: 'https://github.com/ycombinator.png'
  },
  {
    id: '3',
    name: 'Next.js Wizards',
    description: 'Everything about Next.js, Vercel, and server-side rendering.',
    memberCount: 9200,
    image: 'https://github.com/vercel.png'
  },
  {
    id: '4',
    name: 'Web Design Pros',
    description: 'Discuss trends, tools, and share your latest designs.',
    memberCount: 5600,
    image: 'https://github.com/figma.png'
  }
];

export function GroupsList() {
  const router = useRouter();

  const handleGroupClick = (groupId: string) => {
    router.push(`/feed?groupId=${groupId}`);
  };

  return (
    <div className="flex flex-col">
      {MOCK_GROUPS.map((group) => (
        <div 
          key={group.id} 
          onClick={() => handleGroupClick(group.id)}
          className="flex items-center gap-4 p-4 border-b border-neutral-800 bg-black hover:bg-neutral-900/50 transition-colors cursor-pointer"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={group.image} alt={group.name} />
            <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white hover:underline">{group.name}</h3>
              <span className="text-neutral-500 text-sm">@{group.name.replace(/\s+/g, '').toLowerCase()}</span>
            </div>
            <p className="text-neutral-400 text-sm mt-0.5">{group.description}</p>
            <p className="text-neutral-500 text-xs mt-2">{group.memberCount.toLocaleString()} members</p>
          </div>
          <Button 
            variant="secondary" 
            className="rounded-full px-6 font-bold bg-white text-black hover:bg-neutral-200"
            onClick={(e) => {
              e.stopPropagation();
              handleGroupClick(group.id);
            }}
          >
            Join
          </Button>
        </div>
      ))}
    </div>
  )
}
