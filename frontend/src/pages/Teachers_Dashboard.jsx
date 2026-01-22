import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Folder,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3,
  Calendar,
  HelpCircle,
  Search,
  Sun,
  Moon,
} from "lucide-react";

/**
 * Drop this component anywhere in your app. It renders a responsive layout with:
 * - Mobile drawer sidebar (with overlay)
 * - Desktop collapsible sidebar (expanded / mini)
 * - Active link styles, groups, search, and dark mode toggle
 * - Accessible keyboard + ARIA attributes
 *
 * Tailwind classes assume a basic setup with dark mode class strategy.
 */
export default function SidebarLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mini, setMini] = useState(false); // desktop mini mode
  const [openGroups, setOpenGroups] = useState({ projects: true, org: false });
  const [dark, setDark] = useState(false);
  const overlayRef = useRef(null);

  // Persist mini + theme
  useEffect(() => {
    const m = localStorage.getItem("sidebar:mini");
    if (m) setMini(m === "1");
    const d = localStorage.getItem("theme:dark");
    if (d) setDark(d === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar:mini", mini ? "1" : "0");
  }, [mini]);
  useEffect(() => {
    localStorage.setItem("theme:dark", dark ? "1" : "0");
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // Close on ESC (mobile)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nav = useMemo(
    () => [
      { label: "Home", icon: Home, href: "#", active: true },
      { label: "Dashboard", icon: BarChart3, href: "#" },
      {
        label: "Projects",
        key: "projects",
        children: [
          { label: "All Projects", href: "#" },
          { label: "Starred", href: "#" },
          { label: "Archived", href: "#" },
        ],
      },
      {
        label: "Organization",
        key: "org",
        children: [
          { label: "Calendar", icon: Calendar, href: "#" },
          { label: "Help Center", icon: HelpCircle, href: "#" },
          { label: "Settings", icon: Settings, href: "#" },
        ],
      },
    ],
    []
  );

  function Group({ item }) {
    const isOpen = openGroups[item.key] ?? false;
    return (
      <div className="">
        <button
          onClick={() =>
            setOpenGroups((g) => ({ ...g, [item.key]: !isOpen }))
          }
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-expanded={isOpen}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
          {!mini && <span className="text-sm font-medium">{item.label}</span>}
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="pl-8 pr-2 py-1 space-y-1"
            >
              {item.children?.map((c, i) => (
                <li key={i}>
                  <a
                    href={c.href}
                    className="block text-sm px-3 py-2 rounded-lg hover:bg-muted/70"
                  >
                    {!mini && (
                      <span className="inline-flex items-center gap-2">
                        {c.icon && <c.icon className="h-4 w-4" />}
                        {c.label}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function LinkItem({ item }) {
    const Icon = item.icon;
    return (
      <a
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          item.active ? "bg-primary/10 text-primary" : ""
        }`}
        aria-current={item.active ? "page" : undefined}
      >
        {Icon && <Icon className="h-5 w-5" />}
        {!mini && <span className="text-sm font-medium">{item.label}</span>}
      </a>
    );
  }

  const Sidebar = (
    <div
      className={`flex h-full flex-col ${mini ? "w-16" : "w-72"} transition-[width] duration-300`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 p-3">
        <div className="h-9 w-9 rounded-2xl bg-primary/15 grid place-items-center">
          <Folder className="h-5 w-5" />
        </div>
        {!mini && (
          <div className="leading-tight">
            <div className="font-semibold">Your App</div>
            <div className="text-xs text-muted-foreground">v1.0</div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-3">
        <label className="group relative block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
          <input
            placeholder="Search..."
            className={`w-full bg-muted/40 border border-border rounded-xl pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              mini ? "opacity-0 pointer-events-none select-none h-0 py-0 my-0" : ""
            }`}
          />
        </label>
      </div>

      {/* Nav */}
      <nav className="mt-2 px-2 space-y-1 overflow-y-auto">
        {nav.map((item, idx) =>
          item.children ? (
            <Group key={idx} item={item} />
          ) : (
            <LinkItem key={idx} item={item} />
          )
        )}
      </nav>

      <div className="mt-auto p-2">
        <div className="h-px bg-border my-2" />
        <div className="flex items-center justify-between px-2">
          {/* Theme toggle */}
          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl hover:bg-muted/70"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!mini && <span>{dark ? "Light" : "Dark"}</span>}
          </button>
          {/* Collapse/Expand */}
          <button
            onClick={() => setMini((m) => !m)}
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl hover:bg-muted/70"
            aria-label="Toggle sidebar width"
            title={mini ? "Expand" : "Collapse"}
          >
            <ChevronDown className={`h-4 w-4 ${mini ? "rotate-90" : "-rotate-90"}`} />
            {!mini && <span>Collapse</span>}
          </button>
        </div>
        <button className="w-full mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-destructive/10 text-destructive">
          <LogOut className="h-4 w-4" />
          {!mini && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-14 border-b bg-background/80 backdrop-blur">
        <div className="h-full max-w-7xl mx-auto flex items-center gap-3 px-4">
          {/* mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border hover:bg-muted/60"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-semibold">Responsive Sidebar Layout</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[auto,1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden md:block sticky top-14 h-[calc(100vh-3.5rem)] border-r bg-card">
          {Sidebar}
        </aside>

        {/* Content */}
        <main className="min-h-[calc(100vh-3.5rem)] p-4">
          <div className="grid gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-sm text-muted-foreground">Card {i + 1}</div>
                  <div className="mt-2 h-24 rounded-xl bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile drawer + overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              ref={overlayRef}
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] border-r bg-card"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              role="dialog"
              aria-modal="true"
              aria-label="Sidebar"
            >
              <div className="h-14 flex items-center justify-between px-3 border-b">
                <div className="font-semibold">Menu</div>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border hover:bg-muted/60"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">{Sidebar}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
// ----------------------------------- add it in global css file
//   @layer base {
//     :root {
//       --background: 255 255 255; /* white */
//       --foreground: 17 24 39; /* gray-900 */
//       --card: 255 255 255;
//       --muted: 249 250 251; /* gray-50 */
//       --border: 229 231 235; /* gray-200 */
//       --primary: 59 130 246; /* blue-500 */
//       --destructive: 239 68 68; /* red-500 */
//     }
//     .dark {
//       --background: 17 24 39; /* gray-900 */
//       --foreground: 243 244 246; /* gray-100 */
//       --card: 24 24 27; /* zinc-900 */
//       --muted: 39 39 42; /* zinc-800 */
//       --border: 63 63 70; /* zinc-700 */
//       --primary: 96 165 250; /* blue-400 */
//       --destructive: 248 113 113; /* red-400 */
//     }
//     * { @apply border-border; }
//     body { @apply bg-background text-foreground; }
//   }
//   @layer utilities {
//     .bg-background { background-color: rgb(var(--background)); }
//     .text-foreground { color: rgb(var(--foreground)); }
//     .bg-card { background-color: rgb(var(--card)); }
//     .bg-muted { background-color: rgb(var(--muted)); }
//     .border-border { border-color: rgb(var(--border)); }
//     .text-muted-foreground { color: rgb(148 163 184 / .9); }
//     .bg-primary\/10 { background-color: rgb(var(--primary) / .1); }
//     .ring-primary\/40 { --tw-ring-color: rgb(var(--primary) / .4); }
//     .text-destructive { color: rgb(var(--destructive)); }
//     .hover\:bg-destructive\/10:hover { background-color: rgb(var(--destructive) / .1); }
//   } 