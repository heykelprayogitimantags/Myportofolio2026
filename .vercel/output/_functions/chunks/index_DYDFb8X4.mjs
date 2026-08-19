import { d as maybeRenderHead, f as renderHead, i as renderComponent, m as createRenderInstruction, p as addAttribute, s as renderSlot, u as renderTemplate, x as createAstro } from "./server_DVmJkfu_.mjs";
import { t as createComponent } from "./compiler_D0p0pDok.mjs";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { jsx } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/layouts/BaseLayout.astro
createAstro("http://localhost:4321");
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$BaseLayout;
	const { title = "Heykel Prayogi Timanta G.s — Software Engineer & AI/Computer Vision Specialist", description = "Portofolio Heykel Prayogi, Software Engineer fresh graduate spesialisasi AI & Computer Vision. Membangun aplikasi fullstack dengan machine learning dan facial recognition.", ogImage = "/og-image.jpg", ogType = "website", noIndex = false } = Astro2.props;
	const siteUrl = "http://localhost:4321";
	const canonicalUrl = new URL(Astro2.url.pathname, siteUrl).toString();
	const ogImageUrl = new URL(ogImage, siteUrl).toString();
	return renderTemplate`<html lang="id" class="scroll-smooth"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- ======= ANTI-FOUC (Flash of Unstyled/Wrong Theme) ======= --><!-- Script ini HARUS di <head> sebelum render apapun --><script>
      (function () {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
        document.documentElement.classList.toggle("dark", theme === "dark");
      })();
    <\/script><!-- ======= SEO ======= --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalUrl, "href")}>${noIndex && renderTemplate`<meta name="robots" content="noindex, nofollow">`}<!-- ======= Open Graph ======= --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonicalUrl, "content")}><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:image"${addAttribute(ogImageUrl, "content")}><meta property="og:image:alt"${addAttribute(title, "content")}><meta property="og:locale" content="id_ID"><meta property="og:site_name" content="Heykel Prayogi Portfolio"><!-- ======= Twitter Card ======= --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImageUrl, "content")}><!-- ======= Favicons ======= --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/png" href="/favicon.png"><meta name="theme-color" content="#3b82f6"><!-- ======= Fonts (Google Fonts via CSS, bisa ganti ke self-hosted) ======= --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"><!-- ======= Astro View Transitions ======= --><!-- Diaktifkan untuk page transition smooth --><!-- <ViewTransitions /> -->${renderHead($$result)}</head><body class="bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">${renderSlot($$result, $$slots["default"])}<!-- ======= Theme change event listener ======= --><script>
      // Listen for theme toggle events dari ThemeToggle component
      document.addEventListener("themeChanged", function (e) {
        const theme = e.detail.theme;
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
      });
    <\/script></body></html>`;
}, "D:/Myportofolio2026/src/layouts/BaseLayout.astro", void 0);
//#endregion
//#region src/components/ThemeToggle.tsx
function ThemeToggle() {
	const [theme, setTheme] = useState("dark");
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(stored ?? (prefersDark ? "dark" : "light"));
	}, []);
	const toggle = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: next } }));
	};
	if (!mounted) return /* @__PURE__ */ jsx("button", {
		"aria-label": "Toggle tema",
		className: "w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] flex items-center justify-center",
		children: /* @__PURE__ */ jsx("span", { className: "w-4 h-4 skeleton rounded" })
	});
	return /* @__PURE__ */ jsx("button", {
		onClick: toggle,
		"aria-label": theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap",
		className: `
        w-9 h-9 rounded-lg border flex items-center justify-center
        transition-all duration-200 hover:scale-105 active:scale-95
        border-[var(--border-color)] bg-[var(--bg-tertiary)]
        hover:border-[var(--brand-primary)] hover:bg-[var(--brand-glow)]
        text-[var(--text-secondary)] hover:text-[var(--brand-primary)]
      `,
		children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, {
			size: 16,
			strokeWidth: 2
		}) : /* @__PURE__ */ jsx(Moon, {
			size: 16,
			strokeWidth: 2
		})
	});
}
//#endregion
//#region src/components/Navbar.astro
var $$Navbar = createComponent(($$result, $$props, $$slots) => {
	const navLinks = [
		{
			label: "Home",
			href: "#home"
		},
		{
			label: "Tech Stack",
			href: "#tech-stack"
		},
		{
			label: "Projects",
			href: "#projects"
		},
		{
			label: "Experience",
			href: "#experience"
		},
		{
			label: "Certificates",
			href: "#certificates"
		},
		{
			label: "Contact",
			href: "#contact"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<header id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"><div class="max-w-6xl mx-auto px-4 sm:px-6"><nav class="flex items-center justify-between h-16"><!-- Logo / Name --><a href="#home" class="font-bold text-lg text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors duration-200 flex items-center gap-2"><span class="text-[var(--brand-primary)] font-mono text-xl">&lt;</span><span>Heykel</span><span class="text-[var(--text-muted)] font-mono">/&gt;</span></a><!-- Desktop Nav Links --><ul class="hidden md:flex items-center gap-1">${navLinks.map((link) => renderTemplate`<li><a${addAttribute(link.href, "href")} class="
                  px-3 py-1.5 rounded-lg text-sm font-medium
                  text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-tertiary)]
                  transition-all duration-200
                ">${link.label}</a></li>`)}</ul><!-- Right: Theme Toggle + Mobile Menu --><div class="flex items-center gap-3">${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "D:/Myportofolio2026/src/components/ThemeToggle.tsx",
		"client:component-export": "default"
	})}<!-- Mobile Hamburger Button --><button id="mobile-menu-btn" aria-label="Buka menu" class="md:hidden w-9 h-9 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] flex flex-col items-center justify-center gap-1.5"><span class="w-4 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-300" id="ham-1"></span><span class="w-4 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-300" id="ham-2"></span><span class="w-3 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-300" id="ham-3"></span></button></div></nav><!-- Mobile Menu Dropdown --><div id="mobile-menu" class="md:hidden hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)] py-3"><ul class="flex flex-col gap-1 px-2">${navLinks.map((link) => renderTemplate`<li><a${addAttribute(link.href, "href")} class="
                  block px-4 py-2.5 rounded-lg text-sm font-medium
                  text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-tertiary)]
                  transition-all duration-200
                ">${link.label}</a></li>`)}</ul></div></div></header><!-- Spacer agar konten tidak tertutup navbar --><div class="h-16"></div>${renderScript($$result, "D:/Myportofolio2026/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Myportofolio2026/src/components/Navbar.astro", void 0);
//#endregion
//#region src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const socials = [
		{
			label: "GitHub",
			href: "https://github.com/heykelprayogi",
			icon: "github"
		},
		{
			label: "LinkedIn",
			href: "https://linkedin.com/in/heykelprayogi",
			icon: "linkedin"
		},
		{
			label: "Email",
			href: "mailto:heykelprayogi123@gmail.com",
			icon: "mail"
		}
	];
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer class="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]"><div class="max-w-6xl mx-auto px-4 sm:px-6 py-8"><div class="flex flex-col md:flex-row items-center justify-between gap-4"><!-- Left: Name & tagline --><div class="text-center md:text-left"><p class="font-semibold text-[var(--text-primary)]">Heykel Prayogi Timanta G.s</p><p class="text-sm text-[var(--text-muted)] mt-0.5">Software Engineer · AI & Computer Vision</p></div><!-- Center: Nav quick links --><div class="flex items-center gap-4 text-sm text-[var(--text-secondary)]"><a href="#projects" class="hover:text-[var(--brand-primary)] transition-colors">Projects</a><span class="text-[var(--border-color)]">·</span><a href="#experience" class="hover:text-[var(--brand-primary)] transition-colors">Experience</a><span class="text-[var(--border-color)]">·</span><a href="#contact" class="hover:text-[var(--brand-primary)] transition-colors">Contact</a></div><!-- Right: Social icons --><div class="flex items-center gap-3">${socials.map((s) => renderTemplate`<a${addAttribute(s.href, "href")}${addAttribute(s.icon !== "mail" ? "_blank" : void 0, "target")}${addAttribute(s.icon !== "mail" ? "noopener noreferrer" : void 0, "rel")}${addAttribute(s.label, "aria-label")} class="
                w-8 h-8 rounded-lg border border-[var(--border-color)]
                flex items-center justify-center
                text-[var(--text-muted)] hover:text-[var(--brand-primary)]
                hover:border-[var(--brand-primary)]
                transition-all duration-200
              ">${s.icon === "github" && renderTemplate`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path></svg>`}${s.icon === "linkedin" && renderTemplate`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>`}${s.icon === "mail" && renderTemplate`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`}</a>`)}</div></div><!-- Copyright --><div class="mt-6 pt-6 border-t border-[var(--border-color)] text-center"><p class="text-xs text-[var(--text-muted)]">© ${currentYear} Heykel Prayogi Timanta G.s — Built with<span class="text-[var(--brand-primary)]">Astro</span> &<span class="text-[var(--accent-primary)]">Supabase</span></p></div></div></footer>`;
}, "D:/Myportofolio2026/src/components/Footer.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Navbar", $$Navbar, {})}${maybeRenderHead($$result)}<main><!-- HERO PLACEHOLDER --><section id="home" class="min-h-screen flex items-center justify-center section-padding" style="background: var(--gradient-hero);"><div class="max-w-6xl mx-auto px-4 sm:px-6 text-center"><div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] mb-6"><span class="available-dot"></span><span>Available for Work</span></div><h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-4 leading-tight">Hi, I'm<span class="gradient-text"> Heykel Prayogi</span></h1><p class="text-xl sm:text-2xl text-[var(--text-secondary)] mb-3 font-medium">Software Engineer · AI & Computer Vision Specialist</p><p class="text-[var(--text-muted)] max-w-2xl mx-auto mb-8 text-base sm:text-lg">Membangun aplikasi fullstack dengan AI & machine learning. Spesialisasi di facial expression recognition & computer vision. Fresh graduate D4 Software Engineering Technology.</p><div class="flex flex-col sm:flex-row items-center justify-center gap-3"><a href="/cv.pdf" download class="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl
              bg-[var(--brand-primary)] text-white font-semibold
              hover:opacity-90 transition-all duration-200 hover:scale-105
              shadow-[var(--shadow-md)]
            "><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download CV</a><a href="#contact" class="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl
              border border-[var(--border-color)] text-[var(--text-primary)] font-semibold
              hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]
              hover:bg-[var(--brand-glow)]
              transition-all duration-200
            ">Contact Me<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></a></div></div></section><!-- SECTIONS AKAN DITAMBAH PER FASE --><!-- <TechStack /> --><!-- <Projects client:visible /> --><!-- <Timeline /> --><!-- <Certificates client:visible /> --><!-- <Contact client:visible /> --><!-- <Guestbook client:visible /> --></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "D:/Myportofolio2026/src/pages/index.astro", void 0);
var $$file = "D:/Myportofolio2026/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page, __exportAll as t };
