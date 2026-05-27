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
    <aside className="sidebar-shell sidebar-premium fixed left-0 top-0 z-30 flex h-28 w-full flex-row items-center gap-3 overflow-visible border-b border-violet-200/8 bg-[#040719]/94 px-3 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.44),0_0_24px_rgba(76,29,149,0.065)] backdrop-blur-md lg:h-screen lg:w-72 lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:px-5 lg:py-2 lg:shadow-[24px_0_76px_rgba(0,0,0,0.54),0_0_24px_rgba(76,29,149,0.065)]">
      <Link
        className="relative z-10 flex w-20 shrink-0 items-center justify-center py-0 lg:-mt-2 lg:mb-2 lg:w-full"
        href="/"
        aria-label="Accueil Lunaeria"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Lunaeria"
          className="relative z-10 w-full max-w-none object-contain drop-shadow-[0_0_12px_rgba(167,139,250,0.16)] lg:w-[136%]"
          src="/newlogo.png"
        />
      </Link>

      <div className="relative z-10 mx-auto mb-3 hidden h-px w-4/5 overflow-hidden rounded-full bg-gradient-to-r from-transparent via-violet-200/28 to-transparent shadow-[0_0_14px_rgba(167,139,250,0.18)] lg:block" />

      <nav
        aria-label={`${title} - ${subtitle}`}
        className="relative z-10 flex min-w-0 flex-1 snap-x flex-row gap-2.5 overflow-x-auto overflow-y-visible px-1 pb-1 pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:min-w-0 lg:snap-none lg:flex-col lg:gap-0 lg:overflow-visible lg:p-0 lg:pr-0"
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={`group/nav relative flex h-16 min-w-[4.7rem] snap-start flex-col items-center justify-center gap-1 overflow-visible rounded-[1.35rem] border px-2.5 py-2 text-[11px] font-black uppercase tracking-[0.08em] transition duration-300 lg:h-12 lg:min-w-14 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:overflow-hidden lg:rounded-2xl lg:px-3 lg:py-0 lg:text-sm lg:font-bold lg:normal-case lg:tracking-normal ${
                item.active
                  ? "border-violet-200/16 bg-[linear-gradient(90deg,rgba(124,58,237,0.13),rgba(91,33,182,0.055))] text-violet-50 shadow-[inset_0_1px_14px_rgba(196,181,253,0.045),0_0_13px_rgba(109,40,217,0.075)]"
                  : "border-transparent text-slate-400 hover:border-violet-200/12 hover:bg-violet-100/[0.035] hover:text-violet-100"
              }`}
              href={item.href}
              key={`${item.href}-${item.label}`}
            >
              {Icon ? <Icon className="shrink-0" size={19} /> : null}
              <span className="block max-w-[4.2rem] text-center leading-3 lg:max-w-none lg:flex-1 lg:text-left lg:leading-normal">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 hidden rounded-[1.6rem] border border-violet-200/10 bg-[linear-gradient(145deg,rgba(124,58,237,0.075),rgba(49,46,129,0.065))] p-4 text-sm text-violet-100 shadow-[inset_0_0_16px_rgba(196,181,253,0.035),0_0_14px_rgba(76,29,149,0.055)] lg:block">
        <p className="font-black tracking-wide text-violet-50">
          Développement & Design
        </p>
        <p className="mt-1 text-xs leading-5 text-cyan-100/70">
          <span className="font-black text-violet-200">BY AZELYA</span>
        </p>
      </div>
    </aside>
  );
}
