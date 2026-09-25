import { Link } from "../../lib/nav";
import { ArrowRight, Circle, Diamond, LayoutGrid, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { useLab } from "./lab-context";

const NAV = [
  { to: "/", label: "Lab", icon: Circle },
  { to: "/archive", label: "Archive", icon: LayoutGrid },
  { to: "/evolution", label: "Evolution", icon: ArrowRight },
  { to: "/design", label: "Design UI", icon: Diamond },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const lab = useLab();
  const variant = lab.ready ? lab.spec.variant : "standard";

  return (
    <div data-variant={variant} className="min-h-screen bg-abyss text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-cyan"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-cyan/10 bg-abyss/80 px-4 backdrop-blur-xl md:px-8">
        <Link to="/" end className="flex items-center gap-3" aria-label="Aequor Lab, home">
          <span className="relative grid size-8 place-items-center text-glow">
            <span className="motion-pulse absolute inset-0 rounded-full bg-glow/25" />
            <LogoMark />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xs font-bold tracking-[0.16em] text-fg">AEQUOR LAB</span>
            <span className="block text-[8px] tracking-[0.18em] text-glow/70">OCEANIC GENOMICS</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              end
              className="nav-link inline-flex min-h-11 items-center gap-2 rounded-full border border-transparent px-4 text-sm text-muted/70 transition-colors hover:text-fg"
            >
              <item.icon className="size-3.5 opacity-80" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="ml-auto hidden font-mono text-xs text-muted/35 md:inline">Research</span>

        <button
          type="button"
          onClick={lab.newSpecimen}
          className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-glow-soft bg-glow-soft px-4 text-xs font-semibold tracking-wide text-glow shadow-glow transition-transform hover:scale-[1.03] active:scale-95 md:ml-4"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">New Specimen</span>
          <span className="sm:hidden">New</span>
        </button>
      </header>

      <main id="main" className="pt-16 pb-20 md:pb-0">
        <p className="sr-only" aria-live="polite">
          {lab.announcement}
        </p>
        {lab.ready ? children : <BootScreen />}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-cyan/10 bg-abyss/95 backdrop-blur-xl md:hidden"
        aria-label="Primary"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            end
            className="nav-mobile flex min-h-14 flex-1 flex-col items-center justify-center gap-1 font-mono text-[10px] text-muted/50"
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label === "Design UI" ? "Design" : item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="11" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.6" />
      <path d="M8 7 C10 11 12 9 13 13 C14 17 16 15 18 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 11 L18 11 M8 15 L18 15" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" />
    </svg>
  );
}

function BootScreen() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center" aria-busy="true">
      <p className="font-mono text-[10px] tracking-hero text-cyan/70">DEEP SEA RESEARCH LABORATORY</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-fg">Decode the Abyss</h1>
      <p className="mt-3 font-mono text-xs text-muted/50">Sequencing specimen…</p>
    </div>
  );
}
