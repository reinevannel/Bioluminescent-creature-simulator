import {
  createContext,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

type NavState = {
  path: string;
  navigate: (to: string) => void;
};

const PathContext = createContext<NavState | null>(null);

function normalize(path: string) {
  const clean = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

function useNav() {
  const ctx = useContext(PathContext);
  if (!ctx) throw new Error("Navigation is only available inside <Router>.");
  return ctx;
}

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function navigate(to: string) {
    const next = normalize(to);
    if (next !== normalize(window.location.pathname)) {
      window.history.pushState(null, "", next);
    }
    setPath(next);
  }

  return <PathContext.Provider value={{ path, navigate }}>{children}</PathContext.Provider>;
}

export function useNavigate() {
  return useNav().navigate;
}

export function usePath() {
  return useNav().path;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  to: string;
  children: ReactNode;
  end?: boolean;
};

export function Link({ to, end, children, onClick, ...rest }: LinkProps) {
  const { path, navigate } = useNav();
  const active = end || to === "/" ? path === to : path === to || path.startsWith(`${to}/`);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }

  return (
    <a
      href={to}
      aria-current={active ? "page" : undefined}
      data-status={active ? "active" : undefined}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
}
