import Link from "next/link";
import {
  Home,
  type LucideIcon,
} from "lucide-react";

export type PageSidebarItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  active?: boolean;
};

export function PageSidebar({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: PageSidebarItem[];
}) {
  const navItems: PageSidebarItem[] = [
    { label: "Accueil", href: "/", icon: Home },
    ...items,
  ];

  return (
    <aside className="page-sidebar sidebar-shell sidebar-premium fixed left-0 top-0 z-30 flex h-24 w-full flex-row items-center gap-2.5 overflow-visible border-b border-violet-200/8 bg-[#050513]/96 px-3 py-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.44),0_0_20px_rgba(76,29,149,0.05)] backdrop-blur-md lg:h-screen lg:w-60 lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:px-4 lg:py-3 lg:shadow-[18px_0_58px_rgba(0,0,0,0.52),0_0_18px_rgba(76,29,149,0.055)]">
      <Link
        className="relative z-10 flex w-16 shrink-0 items-center justify-center py-0 lg:mb-2 lg:w-full"
        href="/"
        aria-label="Accueil Lunaeria"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Lunaeria"
          className="relative z-10 w-[140%] max-w-none object-contain drop-shadow-[0_0_10px_rgba(167,139,250,0.14)] lg:w-[157%]"
          src="/newlogo2.png"
        />
      </Link>

      <div aria-hidden="true" className="lunaeria-sidebar-divider hidden lg:flex">
        <span />
      </div>

      <nav
        aria-label={`${title} - ${subtitle}`}
        className="relative z-10 flex min-w-0 flex-1 snap-x flex-row gap-2 overflow-x-auto overflow-y-visible px-1 pb-1 pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:min-w-0 lg:snap-none lg:flex-col lg:gap-1 lg:overflow-visible lg:p-0 lg:pr-0"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={`group/nav relative flex h-12 min-w-[4.35rem] snap-start items-center justify-center gap-1 overflow-visible rounded-xl border px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] transition duration-300 lg:h-9 lg:min-w-0 lg:w-full lg:flex-row lg:justify-start lg:gap-2.5 lg:overflow-hidden lg:px-3 lg:py-0 lg:text-xs lg:font-medium lg:normal-case lg:tracking-normal ${
                item.active
                  ? "border-violet-300/24 bg-violet-400/[0.12] text-violet-50 shadow-[inset_0_1px_8px_rgba(196,181,253,0.045),0_0_14px_rgba(139,92,246,0.12)]"
                  : "border-transparent text-violet-100/58 hover:border-violet-200/12 hover:bg-violet-100/[0.045] hover:text-violet-50"
              }`}
              href={item.href}
              key={`${item.href}-${item.label}`}
            >
              {Icon ? <Icon className="shrink-0" size={16} /> : null}
              <span className="block max-w-[4.1rem] text-center leading-3 lg:max-w-none lg:flex-1 lg:text-left lg:leading-normal">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div aria-hidden="true" className="lunaeria-sidebar-divider lunaeria-sidebar-divider--footer hidden lg:flex">
        <span />
      </div>

      <div className="relative z-10 hidden rounded-xl border border-violet-200/8 bg-violet-100/[0.035] p-3 text-xs text-violet-100/76 shadow-[inset_0_0_12px_rgba(196,181,253,0.025)] lg:block">
        <p className="font-semibold tracking-wide text-violet-50/90">
          Développement & Design
        </p>
        <p className="mt-1 text-[11px] leading-4 text-cyan-100/60">
          <span className="font-semibold text-violet-200/90">BY AZELYA</span>
        </p>
      </div>
    </aside>
  );
}
