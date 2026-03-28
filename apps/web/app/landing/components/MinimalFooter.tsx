"use client";

import {
	GithubIcon,
	Grid2X2Plus,
	InstagramIcon,
	LinkedinIcon,
	TwitterIcon,
} from 'lucide-react';
import Image from 'next/image';

export function MinimalFooter() {
	const year = new Date().getFullYear();

	const socialLinks = [
		{
			icon: <GithubIcon className="size-5" />,
			link: 'https://github.com/rishnudk/stack',
		},
		{
			icon: <TwitterIcon className="size-5" />,
			link: '#',
		},
		{
			icon: <LinkedinIcon className="size-5" />,
			link: '#',
		},
		{
			icon: <InstagramIcon className="size-5" />,
			link: '#',
		},
	];

	return (
		<footer className="mt-24 border-t border-zinc-800 bg-black">
			<div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6 md:order-2">
					{socialLinks.map((item, i) => (
						<a
							key={i}
							href={item.link}
							className="text-zinc-500 hover:text-blue-500 transition-colors duration-200"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span className="sr-only">Social Link</span>
							{item.icon}
						</a>
					))}
				</div>
				<div className="mt-8 md:order-1 md:mt-0 flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Image src="/logo.png" alt="Stack Logo" width={24} height={24} />
						<span className="text-lg font-bold tracking-tighter text-zinc-100 uppercase">STACK</span>
					</div>
					<div className="h-4 w-px bg-zinc-800 hidden md:block" />
					<p className="text-center text-xs leading-5 text-zinc-500">
						&copy; {year} Stack. Built for developers by developers.
					</p>
				</div>
			</div>
		</footer>
	);
}
