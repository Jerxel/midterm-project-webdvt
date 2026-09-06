import { NavLink, Outlet, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/add", label: "Transaction" },
  { to: "/summary", label: "Summary" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <Link
            to="/about"
            className="text-base sm:text-lg font-bold hover:underline whitespace-nowrap"
          >
            Budget Tracker
          </Link>
          <div className="flex flex-wrap items-center gap-1.5">
            <nav className="flex flex-wrap gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "px-2 py-1 rounded-lg text-[0.7rem] sm:text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}