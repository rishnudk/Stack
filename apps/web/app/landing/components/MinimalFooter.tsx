"use client";

import {
	FacebookIcon,
	GithubIcon,
	Grid2X2Plus,
	InstagramIcon,
	LinkedinIcon,
	TwitterIcon,
	YoutubeIcon,
} from 'lucide-react';

export function MinimalFooter() {
	const year = new Date().getFullYear();

	const company = [
		{
			title: 'About Us',
			href: '#',
		},
		{
			title: 'Careers',
			href: '#',
		},
		{
			title: 'Brand assets',
			href: '#',
		},
		{
			title: 'Privacy Policy',
			href: '#',
		},
		{
			title: 'Terms of Service',
			href: '#',
		},
	];

	const resources = [
		{
			title: 'Blog',
			href: '#',
		},
		{
			title: 'Help Center',
			href: '#',
		},
		{
			title: 'Contact Support',
			href: '#',
		},
		{
			title: 'Community',
			href: '#',
		},
		{
			title: 'Security',
			href: '#',
		},
	];

	const socialLinks = [
		{
			icon: <FacebookIcon className="size-4" />,
			link: '#',
		},
		{
			icon: <GithubIcon className="size-4" />,
			link: 'https://github.com/rishnudk/stack',
		},
		{
			icon: <InstagramIcon className="size-4" />,
			link: '#',
		},
		{
			icon: <LinkedinIcon className="size-4" />,
			link: '#',
		},
		{
			icon: <TwitterIcon className="size-4" />,
			link: '#',
		},
		{
			icon: <YoutubeIcon className="size-4" />,
			link: '#',
		},
	];
	return (
		<footer className="relative mt-24">
			<div className="bg-[radial-gradient(35%_80%_at_30%_0%,rgba(59,130,246,0.1),transparent)] mx-auto max-w-7xl md:border-x border-gray-100/10">
				<div className="bg-gray-100/10 absolute inset-x-0 h-px w-full" />
				<div className="grid max-w-7xl grid-cols-6 gap-6 p-8 md:p-12">
					<div className="col-span-6 flex flex-col gap-5 md:col-span-4">
						<a href="#" className="w-max opacity-80 hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2">
							    <Grid2X2Plus className="size-8 text-blue-500" />
                                <span className="text-xl font-bold tracking-tighter">STACK</span>
                            </div>
						</a>
						<p className="text-gray-400 max-w-sm font-sans text-sm text-balance">
							The modern social network designed specifically for developers. Connect, collaborate, and grow your career.
						</p>
						<div className="flex gap-2">
							{socialLinks.map((item, i) => (
								<a
									key={i}
									className="hover:bg-white/5 rounded-md border border-white/10 p-2 transition-colors"
									target="_blank"
									href={item.link}
								>
									{item.icon}
								</a>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-gray-500 mb-4 block text-xs font-semibold uppercase tracking-wider">
							Resources
						</span>
						<div className="flex flex-col gap-2">
							{resources.map(({ href, title }, i) => (
								<a
									key={i}
									className={`w-max py-1 text-sm text-gray-400 duration-200 hover:text-white hover:underline`}
									href={href}
								>
									{title}
								</a>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-gray-500 mb-4 block text-xs font-semibold uppercase tracking-wider">Company</span>
						<div className="flex flex-col gap-2">
							{company.map(({ href, title }, i) => (
								<a
									key={i}
									className={`w-max py-1 text-sm text-gray-400 duration-200 hover:text-white hover:underline`}
									href={href}
								>
									{title}
								</a>
							))}
						</div>
					</div>
				</div>
				<div className="bg-gray-100/10 absolute inset-x-0 h-px w-full" />
				<div className="flex max-w-7xl flex-col items-center justify-between gap-2 pt-8 pb-12">
					<p className="text-gray-500 text-center font-light text-sm">
						© {year} <span className="text-gray-300 font-medium">Stack</span>. Built for developers, by developers.
					</p>
				</div>
			</div>
		</footer>
	);
}
