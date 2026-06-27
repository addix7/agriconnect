import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Check,
  Package,
  Truck,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

type Role = "farmer" | "middleman" | "company";

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

const NOTIFICATIONS: Record<Role, Notification[]> = {
  farmer: [
    { id: "n1", title: "Transfer Accepted", body: "Suresh Traders accepted your Organic Basmati Rice transfer.", time: "2m ago", read: false, icon: <Check className="w-3.5 h-3.5" />, color: "#16a34a" },
    { id: "n2", title: "New Order Request", body: "AgroMart Corp wants 200 kg of Premium Wheat.", time: "18m ago", read: false, icon: <ShoppingCart className="w-3.5 h-3.5" />, color: "#7c3aed" },
    { id: "n3", title: "Price Alert", body: "Tomato prices up 12% in your region.", time: "1h ago", read: false, icon: <AlertCircle className="w-3.5 h-3.5" />, color: "#d97706" },
    { id: "n4", title: "Delivery Complete", body: "Yellow Corn batch delivered successfully.", time: "3h ago", read: true, icon: <Truck className="w-3.5 h-3.5" />, color: "#6b7280" },
  ],
  middleman: [
    { id: "n1", title: "New Incoming Transfer", body: "Ravi Kumar initiated transfer of 500 kg Basmati Rice.", time: "5m ago", read: false, icon: <Package className="w-3.5 h-3.5" />, color: "#16a34a" },
    { id: "n2", title: "Order Pending Action", body: "AgroMart Corp is waiting for your confirmation.", time: "22m ago", read: false, icon: <AlertCircle className="w-3.5 h-3.5" />, color: "#d97706" },
    { id: "n3", title: "Delivery Delayed", body: "Corn shipment to Bihar is delayed by 1 day.", time: "2h ago", read: true, icon: <Truck className="w-3.5 h-3.5" />, color: "#dc2626" },
  ],
  company: [
    { id: "n1", title: "Order Shipped", body: "Your Basmati Rice order (CORD001) is now in transit.", time: "8m ago", read: false, icon: <Truck className="w-3.5 h-3.5" />, color: "#7c3aed" },
    { id: "n2", title: "Order Confirmed", body: "Red Chili order confirmed by Gopi Wholesale.", time: "35m ago", read: false, icon: <Check className="w-3.5 h-3.5" />, color: "#16a34a" },
    { id: "n3", title: "Price Drop", body: "Wheat prices dropped 8% — great time to buy.", time: "4h ago", read: false, icon: <AlertCircle className="w-3.5 h-3.5" />, color: "#d97706" },
    { id: "n4", title: "Order Delivered", body: "Premium Wheat (CORD002) delivered successfully.", time: "1d ago", read: true, icon: <Check className="w-3.5 h-3.5" />, color: "#6b7280" },
  ],
};

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Your dashboard at a glance" },
  "create-product": { title: "Create Product", subtitle: "List a new agricultural product" },
  "my-products": { title: "My Products", subtitle: "Manage your product listings" },
  transfer: { title: "Transfer Product", subtitle: "Send products to middlemen" },
  analytics: { title: "Analytics", subtitle: "Farm performance insights" },
  inventory: { title: "Inventory", subtitle: "Track your stock levels" },
  orders: { title: "Orders", subtitle: "Manage incoming orders" },
  delivery: { title: "Delivery Tracking", subtitle: "Monitor active shipments" },
  browse: { title: "Browse Stock", subtitle: "Find available products" },
  "place-order": { title: "Place Order", subtitle: "Order from middlemen" },
  "my-orders": { title: "My Orders", subtitle: "Track your procurement" },
};

const ROLE_COLORS: Record<Role, { bg: string; text: string; label: string }> = {
  farmer: { bg: "#dcfce7", text: "#15803d", label: "Farmer" },
  middleman: { bg: "#fef3c7", text: "#b45309", label: "Middleman" },
  company: { bg: "#dbeafe", text: "#1d4ed8", label: "Company" },
};

interface Props {
  role: Role;
  name: string;
  currentPage: string;
  isDark: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
  onMobileMenuOpen: () => void;
}

export function TopBar({ role, name, currentPage, isDark, onToggleDark, onLogout, onMobileMenuOpen }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS[role]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;
  const page = PAGE_TITLES[currentPage] ?? { title: currentPage, subtitle: "" };
  const roleColor = ROLE_COLORS[role];

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6"
      style={{
        height: 60,
        background: isDark ? "rgba(14,24,18,0.88)" : "rgba(247,250,248,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}
    >
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "var(--muted)", border: "none", cursor: "pointer", color: "var(--foreground)" }}
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "-0.01em",
              color: "var(--foreground)",
              lineHeight: 1.2,
            }}
          >
            {page.title}
          </h2>
          {page.subtitle && (
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem", lineHeight: 1 }}>
              {page.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <motion.button
          onClick={onToggleDark}
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            background: "var(--muted)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            color: "var(--muted-foreground)",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <motion.button
            onClick={() => { setShowNotifications(v => !v); setShowProfile(false); }}
            className="flex items-center justify-center w-8 h-8 rounded-lg relative"
            style={{
              background: showNotifications ? "var(--accent)" : "var(--muted)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              color: "var(--muted-foreground)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Bell className="w-3.5 h-3.5" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex items-center justify-center rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {unread}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 mt-2 rounded-xl overflow-hidden"
                style={{
                  top: "100%",
                  width: 320,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 100,
                }}
              >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.875rem" }}>Notifications</p>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {notifications.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.18 }}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                      style={{
                        borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none",
                        background: n.read ? "transparent" : isDark ? "rgba(34,197,94,0.05)" : "rgba(22,163,74,0.03)",
                      }}
                      onClick={() => setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                        style={{ width: 28, height: 28, background: n.read ? "var(--muted)" : `${n.color}18`, color: n.read ? "var(--muted-foreground)" : n.color }}
                      >
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: "0.8rem", fontWeight: n.read ? 500 : 600, color: "var(--foreground)", lineHeight: 1.3 }}>{n.title}</p>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#22c55e" }} />}
                        </div>
                        <p style={{ fontSize: "0.73rem", color: "var(--muted-foreground)", marginTop: 2, lineHeight: 1.4 }}>{n.body}</p>
                        <p style={{ fontSize: "0.68rem", color: "var(--muted-foreground)", marginTop: 3, opacity: 0.7 }}>{n.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button
            onClick={() => { setShowProfile(v => !v); setShowNotifications(false); }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
            style={{
              background: showProfile ? "var(--accent)" : "var(--muted)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
            >
              <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {name.charAt(0)}
              </span>
            </div>
            <span className="hidden sm:block" style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 500, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {name.split(" ")[0]}
            </span>
            <span
              className="hidden sm:block px-1.5 py-0.5 rounded-full"
              style={{ background: roleColor.bg, color: roleColor.text, fontSize: "0.62rem", fontWeight: 700 }}
            >
              {roleColor.label}
            </span>
            <ChevronDown
              className="w-3 h-3 hidden sm:block"
              style={{ color: "var(--muted-foreground)", transform: showProfile ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }}
            />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 mt-2 rounded-xl overflow-hidden"
                style={{
                  top: "100%",
                  width: 220,
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 100,
                }}
              >
                {/* Header */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                    >
                      <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "0.85rem", lineHeight: 1.2 }}>{name}</p>
                      <span
                        className="inline-block px-1.5 py-0.5 rounded-full mt-0.5"
                        style={{ background: roleColor.bg, color: roleColor.text, fontSize: "0.62rem", fontWeight: 700 }}
                      >
                        {roleColor.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                {[
                  { icon: <User className="w-3.5 h-3.5" />, label: "My Profile" },
                  { icon: <Settings className="w-3.5 h-3.5" />, label: "Settings" },
                ].map(item => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--foreground)",
                      fontSize: "0.83rem",
                      fontWeight: 500,
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{ color: "var(--muted-foreground)" }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={() => { setShowProfile(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: "0.83rem",
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
