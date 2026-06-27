import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  BarChart3,
  Warehouse,
  ShoppingCart,
  Truck,
  ClipboardList,
  Search,
  LogOut,
  PanelLeftOpen,
  Settings,
  Leaf,
  ChevronRight,
  X,
} from "lucide-react";

type Role = "farmer" | "middleman" | "company";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const FARMER_SECTIONS: NavSection[] = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-[15px] h-[15px]" /> },
      { id: "my-products", label: "My Products", icon: <Leaf className="w-[15px] h-[15px]" />, badge: "5" },
      { id: "create-product", label: "Create Product", icon: <Package className="w-[15px] h-[15px]" /> },
      { id: "transfer", label: "Transfer Product", icon: <ArrowRightLeft className="w-[15px] h-[15px]" /> },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-[15px] h-[15px]" /> },
    ],
  },
];

const MIDDLEMAN_SECTIONS: NavSection[] = [
  {
    label: "Operations",
    items: [
      { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-[15px] h-[15px]" /> },
      { id: "inventory", label: "Inventory", icon: <Warehouse className="w-[15px] h-[15px]" /> },
      { id: "orders", label: "Orders", icon: <ClipboardList className="w-[15px] h-[15px]" />, badge: "2" },
    ],
  },
  {
    label: "Logistics",
    items: [
      { id: "delivery", label: "Delivery Tracking", icon: <Truck className="w-[15px] h-[15px]" /> },
    ],
  },
];

const COMPANY_SECTIONS: NavSection[] = [
  {
    label: "Procurement",
    items: [
      { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-[15px] h-[15px]" /> },
      { id: "browse", label: "Browse Stock", icon: <Search className="w-[15px] h-[15px]" /> },
      { id: "place-order", label: "Place Order", icon: <ShoppingCart className="w-[15px] h-[15px]" /> },
    ],
  },
  {
    label: "Orders",
    items: [
      { id: "my-orders", label: "My Orders", icon: <ClipboardList className="w-[15px] h-[15px]" />, badge: "4" },
    ],
  },
];

const SECTIONS_MAP: Record<Role, NavSection[]> = {
  farmer: FARMER_SECTIONS,
  middleman: MIDDLEMAN_SECTIONS,
  company: COMPANY_SECTIONS,
};

const ROLE_INFO: Record<Role, { label: string; color: string }> = {
  farmer: { label: "Farmer Portal", color: "#22c55e" },
  middleman: { label: "Middleman Hub", color: "#f59e0b" },
  company: { label: "Company Portal", color: "#60a5fa" },
};

interface Props {
  role: Role;
  name: string;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarInner({
  role, name, currentPage, onPageChange, onLogout, collapsed, setCollapsed, isMobile = false, onMobileClose,
}: {
  role: Role; name: string; currentPage: string;
  onPageChange: (p: string) => void; onLogout: () => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  isMobile?: boolean; onMobileClose?: () => void;
}) {
  const [logoHovered, setLogoHovered] = useState(false);
  const sections = SECTIONS_MAP[role];
  const roleInfo = ROLE_INFO[role];
  const isCollapsed = isMobile ? false : collapsed;

  const handleNav = (page: string) => {
    onPageChange(page);
    onMobileClose?.();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 68 : isMobile ? 260 : 248 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: "var(--sidebar)",
        minWidth: 0,
        borderRight: "1px solid var(--sidebar-border)",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5"
        style={{
          borderBottom: "1px solid var(--sidebar-border)",
          gap: isCollapsed ? 0 : 10,
          justifyContent: isCollapsed ? "center" : "flex-start",
          minHeight: 60,
        }}
      >
        <motion.div
          className="flex items-center justify-center rounded-xl flex-shrink-0 cursor-pointer"
          style={{
            width: 34,
            height: 34,
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            boxShadow: logoHovered
              ? "0 4px 16px rgba(34,197,94,0.6)"
              : "0 2px 8px rgba(34,197,94,0.4)",
          }}
          onHoverStart={() => setLogoHovered(true)}
          onHoverEnd={() => setLogoHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div
            animate={{ rotate: logoHovered ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <Sprout className="w-[17px] h-[17px]" style={{ color: "#fff" }} />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden flex-1"
            >
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  color: "#ffffff",
                  fontSize: "0.925rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                AgriConnect
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: roleInfo.color }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                />
                <p style={{ color: "rgba(209,250,229,0.6)", fontSize: "0.67rem", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {roleInfo.label}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(209,250,229,0.6)", marginLeft: "auto", padding: 4 }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" style={{ scrollbarWidth: "none" }}>
        {sections.map((section, sectionIdx) => (
          <div key={section.label} className="mb-5">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.p
                  className="px-2 mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    color: "rgba(209,250,229,0.4)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const active = currentPage === item.id;
                const globalIdx = sectionIdx * 10 + itemIdx;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className="w-full flex items-center rounded-lg text-left relative overflow-hidden"
                    style={{
                      gap: isCollapsed ? 0 : 10,
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      padding: isCollapsed ? "9px" : "9px 10px",
                      border: "none",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: globalIdx * 0.04 + 0.08, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {active && (
                      <motion.div
                        layoutId={`sidebar-active-bg-${isMobile ? "mobile" : "desktop"}`}
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08))" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {active && (
                      <motion.div
                        layoutId={`sidebar-active-bar-${isMobile ? "mobile" : "desktop"}`}
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                        style={{ width: 3, height: "60%", background: "#22c55e" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    <motion.span
                      className="relative flex-shrink-0"
                      animate={{ color: active ? "#22c55e" : "var(--sidebar-foreground)", opacity: active ? 1 : 0.6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.icon}
                    </motion.span>

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                          className="relative flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{
                            color: active ? "#ffffff" : "var(--sidebar-foreground)",
                            opacity: active ? 1 : 0.72,
                            fontSize: "0.83rem",
                            fontWeight: active ? 600 : 450,
                          }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {!isCollapsed && item.badge && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="relative ml-auto rounded-full px-1.5 py-0.5"
                          style={{
                            background: active ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)",
                            color: active ? "#22c55e" : "rgba(209,250,229,0.6)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            minWidth: 18,
                            textAlign: "center",
                          }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom utility buttons */}
      <div className="px-3 py-3 space-y-0.5" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        {[
          { icon: <Settings className="w-[15px] h-[15px]" />, label: "Settings" },
        ].map((item) => (
          <motion.button
            key={item.label}
            className="w-full flex items-center rounded-lg"
            style={{
              gap: isCollapsed ? 0 : 10,
              justifyContent: isCollapsed ? "center" : "flex-start",
              padding: isCollapsed ? "9px" : "9px 10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--sidebar-foreground)",
            }}
            title={isCollapsed ? item.label : undefined}
            whileHover={{ opacity: 1, x: isCollapsed ? 0 : 2 }}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.15 }}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ fontSize: "0.83rem", fontWeight: 450 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        <motion.button
          onClick={onLogout}
          className="w-full flex items-center rounded-lg"
          style={{
            gap: isCollapsed ? 0 : 10,
            justifyContent: isCollapsed ? "center" : "flex-start",
            padding: isCollapsed ? "9px" : "9px 10px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#f87171",
          }}
          title={isCollapsed ? "Log out" : undefined}
          whileHover={{ opacity: 1, x: isCollapsed ? 0 : 2 }}
          initial={{ opacity: 0.75 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 0.15 }}
        >
          <LogOut className="w-[15px] h-[15px] flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: "0.83rem", fontWeight: 450 }}
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <motion.button
            onClick={() => setCollapsed(!isCollapsed)}
            className="w-full flex items-center rounded-lg mt-1"
            style={{
              justifyContent: isCollapsed ? "center" : "flex-end",
              padding: "8px 10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(209,250,229,0.4)",
            }}
            whileHover={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.5 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <PanelLeftOpen className="w-4 h-4" />
            </motion.div>
          </motion.button>
        )}

        {/* User profile */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1"
              style={{ background: "var(--sidebar-accent)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <span style={{ color: "white", fontSize: "0.72rem", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {name.charAt(0)}
                </span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p style={{ color: "#ffffff", fontSize: "0.8rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>
                  {name}
                </p>
                <p style={{ color: "rgba(209,250,229,0.5)", fontSize: "0.67rem", textTransform: "capitalize", marginTop: 1 }}>
                  {role} account
                </p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(209,250,229,0.4)" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

export function Sidebar({ role, name, currentPage, onPageChange, onLogout, mobileOpen = false, onMobileClose }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen sticky top-0">
        <SidebarInner
          role={role} name={name} currentPage={currentPage}
          onPageChange={onPageChange} onLogout={onLogout}
          collapsed={collapsed} setCollapsed={setCollapsed}
        />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
              onClick={onMobileClose}
            />
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
              style={{ height: "100dvh" }}
            >
              <SidebarInner
                role={role} name={name} currentPage={currentPage}
                onPageChange={onPageChange} onLogout={onLogout}
                collapsed={false} setCollapsed={setCollapsed}
                isMobile onMobileClose={onMobileClose}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
