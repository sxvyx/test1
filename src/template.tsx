import type React from "react";
import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };

type Profile = {
	name: string;
	initials: string;
	title: string;
	tagline: string;
	summary: string;
	location: string;
	email: string;
	phone: string;
	avatar?: string;
};

type ExperienceItem = {
	id: string;
	role: string;
	company: string;
	location: string;
	start: string;
	end: string;
	current?: boolean;
	bullets: string[];
	stack?: string[];
};

type EducationItem = {
	id: string;
	degree: string;
	institution: string;
	location: string;
	start: string;
	end: string;
	details?: string;
	gpa?: string;
};

type ProjectItem = {
	id: string;
	title: string;
	description: string;
	tags: string[];
	highlights?: string[];
};

type SkillCategory = {
	category: string;
	skills: { name: string }[];
};

type CertificationItem = {
	id: string;
	name: string;
	issuer: string;
	date: string;
	credentialId?: string;
};

export type PortfolioData = {
	brand: string;
	profile: Profile;
	nav: NavItem[];
	experiences: ExperienceItem[];
	education: EducationItem[];
	projects: ProjectItem[];
	skills: SkillCategory[];
	certifications: CertificationItem[];
	footer: { copyright: string; note: string };
};

const Icon = {
	Sun: (p: { className?: string }) => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={p.className || "h-5 w-5"}
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
		</svg>
	),
	Moon: (p: { className?: string }) => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={p.className || "h-5 w-5"}
			aria-hidden="true"
		>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
		</svg>
	),
	Menu: (p: { className?: string }) => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={p.className || "h-5 w-5"}
			aria-hidden="true"
		>
			<path d="M4 7h16M4 12h16M4 17h16" />
		</svg>
	),
	Close: (p: { className?: string }) => (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.6"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={p.className || "h-5 w-5"}
			aria-hidden="true"
		>
			<path d="M6 6l12 12M18 6 6 18" />
		</svg>
	),
};

function useTheme() {
	const [isDark, setIsDark] = useState<boolean>(() => {
		if (typeof window === "undefined") return true;
		try {
			const stored = localStorage.getItem("theme");
			if (stored) return stored === "dark";
			return true; // Default to dark theme
		} catch {
			return true;
		}
	});

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", isDark);
		try {
			localStorage.setItem("theme", isDark ? "dark" : "light");
		} catch {
			/* ignore */
		}
	}, [isDark]);

	return { isDark, toggle: () => setIsDark((v) => !v) };
}

function Container({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>
			{children}
		</div>
	);
}

function SectionHeader({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string;
	title: React.ReactNode;
	description?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3">
			<span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
				{eyebrow}
			</span>
			<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
				{title}
			</h2>
			{description ? (
				<p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
					{description}
				</p>
			) : null}
		</div>
	);
}

function Navbar({
	brand,
	items,
	isDark,
	onToggleTheme,
}: {
	brand: string;
	items: NavItem[];
	isDark: boolean;
	onToggleTheme: () => void;
}) {
	const [active, setActive] = useState<string>(items[0]?.href ?? "");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const sections = items
			.map((i) => document.querySelector(i.href))
			.filter((el): el is Element => el !== null);
		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActive(`#${visible[0].target.id}`);
			},
			{ rootMargin: "-40% 0px -55% 0px", threshold: 0 },
		);
		sections.forEach((s) => {
			observer.observe(s);
		});
		return () => observer.disconnect();
	}, [items]);

	function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
		e.preventDefault();
		setOpen(false);
		const el = document.querySelector(href);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
			history.replaceState(null, "", href);
		}
	}

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
				<a
					href="#about"
					onClick={(e) => handleClick(e, "#about")}
					className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50"
				>
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
						CP
					</span>
					<span>{brand}</span>
				</a>

				<nav className="hidden items-center gap-1 md:flex">
					{items.map((item) => {
						const isActive = active === item.href;
						return (
							<a
								key={item.href}
								href={item.href}
								onClick={(e) => handleClick(e, item.href)}
								className={`rounded-md px-3 py-2 text-sm transition ${
									isActive
										? "text-slate-950 dark:text-white"
										: "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
								}`}
							>
								{item.label}
							</a>
						);
					})}
					<div className="ml-2 border-l border-slate-200 pl-2 dark:border-slate-800">
						<button
							type="button"
							onClick={onToggleTheme}
							aria-label={
								isDark ? "Switch to light mode" : "Switch to dark mode"
							}
							className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
						>
							{isDark ? (
								<Icon.Sun className="h-4 w-4" />
							) : (
								<Icon.Moon className="h-4 w-4" />
							)}
						</button>
					</div>
				</nav>

				<div className="flex items-center gap-2 md:hidden">
					<button
						type="button"
						onClick={onToggleTheme}
						aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
						className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
					>
						{isDark ? (
							<Icon.Sun className="h-4 w-4" />
						) : (
							<Icon.Moon className="h-4 w-4" />
						)}
					</button>
					<button
						type="button"
						onClick={() => setOpen((o) => !o)}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
					>
						{open ? (
							<Icon.Close className="h-4 w-4" />
						) : (
							<Icon.Menu className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			{open ? (
				<nav className="border-t border-slate-200 bg-white px-5 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
					<ul className="flex flex-col gap-1">
						{items.map((item) => {
							const isActive = active === item.href;
							return (
								<li key={item.href}>
									<a
										href={item.href}
										onClick={(e) => handleClick(e, item.href)}
										className={`block rounded-md px-3 py-2 text-sm transition ${
											isActive
												? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
												: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
										}`}
									>
										{item.label}
									</a>
								</li>
							);
						})}
					</ul>
				</nav>
			) : null}
		</header>
	);
}

function Avatar({
	src,
	alt,
	initials,
}: {
	src?: string;
	alt: string;
	initials: string;
}) {
	const [failed, setFailed] = useState(false);
	const showImg = !!src && !failed;

	return (
		<div className="relative h-56 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-[0_24px_60px_rgba(16,24,40,0.12)] sm:h-64 sm:w-64 dark:border-slate-800 dark:bg-slate-900">
			{showImg ? (
				<img
					src={src}
					alt={alt}
					className="h-full w-full object-cover"
					onError={() => setFailed(true)}
				/>
			) : null}
			<div
				aria-hidden="true"
				className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-5xl font-bold text-slate-700 dark:from-slate-800 dark:to-slate-700 dark:text-slate-200 ${
					showImg ? "hidden" : "flex"
				}`}
			>
				{initials}
			</div>
		</div>
	);
}

function HeroSection({ profile }: { profile: Profile }) {
	return (
		<section
			id="about"
			className="scroll-mt-20 border-b border-slate-200 py-16 sm:py-20 lg:py-24 dark:border-slate-800"
		>
			<Container>
				<div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
					<div className="order-2 lg:order-1">
						<span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
							Available for new opportunities
						</span>

						<h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
							{profile.name}
						</h1>

						<p className="mt-3 text-base font-medium text-slate-700 sm:text-lg dark:text-slate-300">
							{profile.title}
						</p>

						<p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
							{profile.summary}
						</p>

						<dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
							<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<span className="font-medium text-slate-900 dark:text-slate-200">
									Location:
								</span>
								<span>{profile.location}</span>
							</div>
							<div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<span className="font-medium text-slate-900 dark:text-slate-200">
									Email:
								</span>
								<span>{profile.email}</span>
							</div>
						</dl>
					</div>

					<div className="order-1 flex justify-center lg:order-2 lg:justify-end">
						<div className="relative">
							<div
								aria-hidden="true"
								className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-slate-200 via-white to-slate-100 blur-sm dark:from-slate-800 dark:via-slate-900 dark:to-slate-800"
							/>
							<Avatar
								src={profile.avatar}
								alt={`${profile.name} portrait`}
								initials={profile.initials}
							/>
							<p className="mt-4 text-center text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
								{profile.tagline}
							</p>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}

function ExperienceSection({ items }: { items: ExperienceItem[] }) {
	return (
		<section
			id="experience"
			className="scroll-mt-20 border-b border-slate-200 py-16 sm:py-20 dark:border-slate-800"
		>
			<Container>
				<SectionHeader
					eyebrow="Experience"
					title="Where I've worked"
					description="A timeline of roles where I've led analysis, built software, and shipped outcomes."
				/>

				<ol className="mt-10 space-y-8 sm:space-y-10">
					{items.map((item, idx) => (
						<li key={item.id} className="relative pl-8 sm:pl-12">
							<span
								aria-hidden="true"
								className="absolute left-3 top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-slate-900 shadow ring-2 ring-slate-200 sm:left-4 dark:border-slate-950 dark:bg-white dark:ring-slate-800"
							/>
							{idx !== items.length - 1 ? (
								<span
									aria-hidden="true"
									className="absolute left-3 top-5 bottom-[-2rem] w-px -translate-x-1/2 bg-slate-200 sm:left-4 sm:bottom-[-2.5rem] dark:bg-slate-800"
								/>
							) : null}

							<article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
								<header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
									<div>
										<h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
											{item.role}
											<span className="text-slate-500 dark:text-slate-400">
												{" "}
												· {item.company}
											</span>
										</h3>
										<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
											{item.location}
										</p>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
											{item.start} — {item.end}
										</span>
										{item.current ? (
											<span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
												Current
											</span>
										) : null}
									</div>
								</header>

								<ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 marker:text-slate-400 dark:text-slate-300 dark:marker:text-slate-600">
									{item.bullets.map((b, i) => (
										<li key={i}>{b}</li>
									))}
								</ul>

								{item.stack && item.stack.length > 0 ? (
									<ul className="mt-4 flex flex-wrap gap-1.5">
										{item.stack.map((tag) => (
											<li
												key={tag}
												className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
											>
												{tag}
											</li>
										))}
									</ul>
								) : null}
							</article>
						</li>
					))}
				</ol>
			</Container>
		</section>
	);
}

function EducationSection({ items }: { items: EducationItem[] }) {
	return (
		<section
			id="education"
			className="scroll-mt-20 border-b border-slate-200 py-16 sm:py-20 dark:border-slate-800"
		>
			<Container>
				<SectionHeader
					eyebrow="Education"
					title="Academic background"
					description="Degrees and programs that shaped how I think about systems and people."
				/>

				<ul className="mt-10 grid gap-5 sm:grid-cols-2">
					{items.map((item) => (
						<li
							key={item.id}
							className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
						>
							<span
								aria-hidden="true"
								className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-slate-900 to-slate-600 transition group-hover:from-slate-700 group-hover:to-slate-400 dark:from-white dark:to-slate-400"
							/>

							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
										{item.degree}
									</h3>
									<p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
										{item.institution}
									</p>
									<p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
										{item.location}
									</p>
								</div>
								<div className="flex flex-col items-end gap-1 text-xs">
									<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
										{item.start} — {item.end}
									</span>
									{item.gpa ? (
										<span className="text-slate-500 dark:text-slate-400">
											GPA: {item.gpa}
										</span>
									) : null}
								</div>
							</div>

							{item.details ? (
								<p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
									{item.details}
								</p>
							) : null}
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

function ProjectsSection({ items }: { items: ProjectItem[] }) {
	return (
		<section
			id="projects"
			className="scroll-mt-20 border-b border-slate-200 py-16 sm:py-20 dark:border-slate-800"
		>
			<Container>
				<SectionHeader
					eyebrow="Projects"
					title="Selected work"
					description="A handful of products, internal tools, and experiments I've built or led."
				/>

				<ul className="mt-10 grid gap-5 sm:grid-cols-2">
					{items.map((project) => (
						<li
							key={project.id}
							className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
						>
							<h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
								{project.title}
							</h3>

							<p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
								{project.description}
							</p>

							{project.highlights && project.highlights.length > 0 ? (
								<ul className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
									{project.highlights.map((h, i) => (
										<li key={i} className="flex items-start gap-2">
											<span
												aria-hidden="true"
												className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500"
											/>
											<span>{h}</span>
										</li>
									))}
								</ul>
							) : null}

							<div className="mt-auto pt-5">
								<ul className="flex flex-wrap gap-1.5">
									{project.tags.map((tag) => (
										<li
											key={tag}
											className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
										>
											{tag}
										</li>
									))}
								</ul>
							</div>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

function SkillsSection({ categories }: { categories: SkillCategory[] }) {
	return (
		<section
			id="skills"
			className="scroll-mt-20 border-b border-slate-200 py-16 sm:py-20 dark:border-slate-800"
		>
			<Container>
				<SectionHeader
					eyebrow="Skills"
					title="What I work with"
					description="A snapshot of the tools, languages, and methodologies I lean on day to day."
				/>

				<dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
					{categories.map((group) => (
						<div key={group.category}>
							<dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
								{group.category}
							</dt>
							<dd className="mt-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
								{group.skills.map((s) => s.name).join(", ")}
								<span className="text-slate-400 dark:text-slate-500">.</span>
							</dd>
						</div>
					))}
				</dl>
			</Container>
		</section>
	);
}

function CertificationsSection({ items }: { items: CertificationItem[] }) {
	return (
		<section
			id="certifications"
			className="scroll-mt-20 border-b border-slate-200 py-16 sm:py-20 dark:border-slate-800"
		>
			<Container>
				<SectionHeader
					eyebrow="Certifications"
					title="Credentials & learning"
					description="Industry certifications and structured programs I've completed."
				/>

				<ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((cert) => (
						<li
							key={cert.id}
							className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
						>
							<div>
								<h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
									{cert.name}
								</h3>
								<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
									{cert.issuer}
								</p>
							</div>

							<div className="mt-auto pt-4">
								<span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
									Issued {cert.date}
								</span>
								{cert.credentialId ? (
									<p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
										Credential ID: {cert.credentialId}
									</p>
								) : null}
							</div>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}

function Footer({ footer }: { footer: PortfolioData["footer"] }) {
	const year = new Date().getFullYear();
	const copyright = footer.copyright.replace("{year}", String(year));

	return (
		<footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
			<Container>
				<div className="flex flex-col items-start justify-between gap-3 text-sm text-slate-500 sm:flex-row sm:items-center dark:text-slate-400">
					<p className="m-0">{copyright}</p>
					<p className="m-0 text-xs">{footer.note}</p>
				</div>
			</Container>
		</footer>
	);
}

export default function ProfessionalCorporateTemplate({
	portfolioData,
}: {
	portfolioData: PortfolioData;
}) {
	const { isDark, toggle } = useTheme();

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
			<Navbar
				brand={portfolioData.brand}
				items={portfolioData.nav}
				isDark={isDark}
				onToggleTheme={toggle}
			/>

			<main>
				<HeroSection profile={portfolioData.profile} />
				<ExperienceSection items={portfolioData.experiences} />
				<EducationSection items={portfolioData.education} />
				<ProjectsSection items={projectList(portfolioData.projects)} />
				<SkillsSection categories={portfolioData.skills} />
				<CertificationsSection items={portfolioData.certifications} />
			</main>

			<Footer footer={portfolioData.footer} />
		</div>
	);
}

// Map helper to resolve highlight differences safely (Professional Corporate template uses ProjectItem type)
function projectList(projects: ProjectItem[]): ProjectItem[] {
	return projects.map((p) => ({
		id: p.id,
		title: p.title,
		description: p.description,
		tags: p.tags,
		highlights: p.highlights ?? [],
	}));
}
