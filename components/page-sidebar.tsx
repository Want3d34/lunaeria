import Link from "next/link";
import {
  Home,
  type LucideIcon,
} from "lucide-react";
import { LunaeriaLogo } from "@/components/lunaeria-logo";

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
    <aside className="sidebar-shell fixed left-0 top-0 z-30 flex h-28 w-full flex-row items-center gap-3 overflow-x-auto border-b border-violet-200/8 bg-[#040719]/94 px-3 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.44),0_0_24px_rgba(76,29,149,0.065)] backdrop-blur-md [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:h-screen lg:w-72 lg:flex-col lg:items-stretch lg:overflow-visible lg:border-b-0 lg:border-r lg:px-5 lg:py-5 lg:shadow-[24px_0_76px_rgba(0,0,0,0.54),0_0_24px_rgba(76,29,149,0.065)]">
      <Link
        className="relative z-10 flex shrink-0 items-center justify-center gap-3 rounded-[1.35rem] border border-violet-200/9 bg-violet-100/[0.028] p-2 shadow-[inset_0_1px_0_rgba(196,181,253,0.05),inset_0_0_16px_rgba(196,181,253,0.025),0_0_16px_rgba(76,29,149,0.055)] lg:mb-7 lg:w-full lg:justify-start lg:p-3"
        href="/"
      >
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-100/18 bg-[linear-gradient(135deg,#d8c9ff,#9d86df_52%,#7f72ba)] text-[#0a0820] shadow-[0_0_18px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(237,233,254,0.42)] lg:size-12">
          <LunaeriaLogo size={27} />
        </div>
        <div className="hidden min-w-0 lg:block">
          <p className="text-lg font-black tracking-[0.24em] text-violet-50 drop-shadow-[0_0_7px_rgba(196,181,253,0.2)]">
            {title}
          </p>
          <p className="text-xs uppercase tracking-[0.28em] text-violet-100/70">
            {subtitle}
          </p>
        </div>
      </Link>

      <nav className="relative z-10 flex min-w-0 flex-1 flex-row gap-2.5 overflow-x-auto overflow-y-visible pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:min-w-0 lg:flex-col lg:gap-2 lg:overflow-y-auto lg:overflow-x-visible lg:pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              className={`group/nav relative flex h-16 min-w-[4.7rem] flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.35rem] border px-2.5 py-2 text-[11px] font-black uppercase tracking-[0.08em] transition duration-300 lg:h-12 lg:min-w-14 lg:w-full lg:flex-row lg:justify-start lg:gap-3 lg:rounded-2xl lg:px-3 lg:py-0 lg:text-sm lg:font-bold lg:normal-case lg:tracking-normal ${
                item.active
                  ? "border-violet-200/16 bg-violet-200/8 text-violet-50 shadow-[inset_0_1px_14px_rgba(196,181,253,0.045),0_0_13px_rgba(109,40,217,0.075)]"
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
    </aside>
  );
}
