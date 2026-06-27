import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { MiddlemanDashboard } from "./components/middleman/MiddlemanDashboard";
import { CompanyDashboard } from "./components/company/CompanyDashboard";
import { OverviewSkeleton } from "./components/Skeleton";
import { useTheme } from "./hooks/useTheme";

type Role = "farmer" | "middleman" | "company";

interface User {
  role: Role;
  name: string;
}

const DEFAULT_PAGE: Record<Role, string> = {
  farmer: "overview",
  middleman: "overview",
  company: "overview",
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark, toggle } = useTheme();

  useEffect(() => {

  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }

}, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentPage(DEFAULT_PAGE[u.role]);
  };

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);
  setCurrentPage("overview");

};

  const handlePageChange = (page: string) => {
    if (page === currentPage) return;
    setIsLoading(true);
    setCurrentPage(page);
    // Brief skeleton flash — 350ms feels natural without feeling slow
    setTimeout(() => setIsLoading(false), 350);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}
    >
      <Sidebar
        role={user.role}
        name={user.name}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          role={user.role}
          name={user.name}
          currentPage={currentPage}
          isDark={isDark}
          onToggleDark={toggle}
          onLogout={handleLogout}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <OverviewSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                {user.role === "farmer" && (
                  <FarmerDashboard currentPage={currentPage} name={user.name} />
                )}
                {user.role === "middleman" && (
                  <MiddlemanDashboard currentPage={currentPage} name={user.name} />
                )}
                {user.role === "company" && (
                  <CompanyDashboard currentPage={currentPage} name={user.name} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
