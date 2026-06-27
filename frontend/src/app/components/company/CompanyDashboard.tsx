import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  X,
  Truck,
} from "lucide-react";
import { AnimatedCounter } from "../motion/AnimatedCounter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StockItem {
  id: string;
  product: string;
  category: string;
  middleman: string;
  location: string;
  available: number;
  unit: string;
  price: number;
  quality: "A+" | "A" | "B+";
}

interface MyOrder {
  id: string;
  product: string;
  middleman: string;
  quantity: number;
  unit: string;
  price: number;
  status: "processing" | "confirmed" | "in-transit" | "delivered";
  ordered: string;
  eta: string;
}

const STOCK: StockItem[] = [
  { id: "STK001", product: "Organic Basmati Rice", category: "Grains", middleman: "Suresh Traders", location: "Punjab", available: 800, unit: "kg", price: 92, quality: "A+" },
  { id: "STK002", product: "Premium Wheat", category: "Grains", middleman: "Ramesh Agencies", location: "Haryana", available: 620, unit: "kg", price: 45, quality: "A" },
  { id: "STK003", product: "Yellow Corn", category: "Grains", middleman: "Gopi Wholesale", location: "Bihar", available: 440, unit: "kg", price: 38, quality: "B+" },
  { id: "STK004", product: "Green Soybeans", category: "Legumes", middleman: "Suresh Traders", location: "MP", available: 280, unit: "kg", price: 95, quality: "A+" },
  { id: "STK005", product: "Fresh Tomatoes", category: "Vegetables", middleman: "Venkat Supplies", location: "Karnataka", available: 180, unit: "kg", price: 55, quality: "A" },
  { id: "STK006", product: "Red Chili", category: "Spices", middleman: "Gopi Wholesale", location: "Andhra", available: 90, unit: "kg", price: 180, quality: "A+" },
  { id: "STK007", product: "Turmeric", category: "Spices", middleman: "Ramesh Agencies", location: "Telangana", available: 120, unit: "kg", price: 210, quality: "A" },
  { id: "STK008", product: "Mustard Seeds", category: "Oilseeds", middleman: "Venkat Supplies", location: "Rajasthan", available: 350, unit: "kg", price: 65, quality: "B+" },
];
const INITIAL_ORDERS: MyOrder[] = [
  { id: "CORD001", product: "Organic Basmati Rice", middleman: "Suresh Traders", quantity: 300, unit: "kg", price: 92, status: "in-transit", ordered: "2026-06-05", eta: "2026-06-12" },
  { id: "CORD002", product: "Premium Wheat", middleman: "Ramesh Agencies", quantity: 200, unit: "kg", price: 45, status: "delivered", ordered: "2026-05-28", eta: "2026-06-04" },
  { id: "CORD003", product: "Red Chili", middleman: "Gopi Wholesale", quantity: 50, unit: "kg", price: 180, status: "confirmed", ordered: "2026-06-07", eta: "2026-06-15" },
  { id: "CORD004", product: "Turmeric", middleman: "Ramesh Agencies", quantity: 80, unit: "kg", price: 210, status: "processing", ordered: "2026-06-08", eta: "2026-06-16" },
];

const spendData = [
  { month: "Jan", spend: 128000 },
  { month: "Feb", spend: 145000 },
  { month: "Mar", spend: 162000 },
  { month: "Apr", spend: 138000 },
  { month: "May", spend: 194000 },
  { month: "Jun", spend: 176000 },
];

const categoryBreakdown = [
  { name: "Grains", value: 52 },
  { name: "Vegetables", value: 18 },
  { name: "Spices", value: 15 },
  { name: "Legumes", value: 10 },
  { name: "Oilseeds", value: 5 },
];

const CATEGORY_COLORS = ["#16a34a", "#0d9488", "#d97706", "#7c3aed", "#dc2626"];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: {
    label: "Pending",
    color: "#d97706",
    bg: "#fef3c7"
  },

  processing: {
    label: "Processing",
    color: "#d97706",
    bg: "#fef3c7"
  },

  confirmed: {
    label: "Confirmed",
    color: "#16a34a",
    bg: "#dcfce7"
  },

  "in-transit": {
    label: "In Transit",
    color: "#7c3aed",
    bg: "#ede9fe"
  },

  delivered: {
    label: "Delivered",
    color: "#6b7280",
    bg: "#f3f4f6"
  },

  rejected: {
    label: "Rejected",
    color: "#dc2626",
    bg: "#fee2e2"
  }
};

const QUALITY_CONFIG: Record<string, { color: string; bg: string }> = {
  "A+": { color: "#16a34a", bg: "#dcfce7" },
  "A": { color: "#0d9488", bg: "#ccfbf1" },
  "B+": { color: "#d97706", bg: "#fef3c7" },
};

interface Props {
  currentPage: string;
  name: string;
}

export function CompanyDashboard({ currentPage, name }: Props) {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategory] = useState("All");
  const [orderModal, setOrderModal] = useState<any>(null);
  const [orderQty, setOrderQty] = useState("");
  const [stock, setStock] = useState<any[]>([]);

  useEffect(() => {

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const formattedOrders = response.data.map((order: any) => ({
        id: order._id,
        product: order.middlemanStock.product.cropName,
        middleman: order.middlemanStock.middleman.user.name,
        quantity: order.quantity,
        unit: "kg",
        price: order.price,
        status: order.status,
        ordered: order.createdAt?.split("T")[0] || "",
        eta: "Pending"
      }));

      setOrders(formattedOrders);

    } catch (error) {

      console.error(error);

    }

  };

  const fetchProducts = async () => {
  try {

    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:3000/stock",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("STOCK:", response.data);

    setStock(response.data);  

  } catch (error) {
    console.log(error);
  }
};

  fetchOrders();
  fetchProducts();
}, []);

  const categories = ["All"];
 const filtered = stock.filter((s: any) => {
  return s.product?.cropName
    ?.toLowerCase()
    .includes(search.toLowerCase());
});

const handlePlaceOrder = async () => {

  if (!orderModal || !orderQty) return;

  try {

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:3000/order",
      {
        middlemanStockId: orderModal._id,
        quantity: Number(orderQty),
        price: orderModal.priceAtTransfer
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Order placed successfully!");

    setOrderModal(null);
    setOrderQty("");

  } catch (error) {

    console.error(error);
    alert("Failed to place order");

  }

};

  if (currentPage === "overview") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
            Welcome, {name} 👋
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>
            Procurement dashboard — manage your agricultural supply.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: orders.length, numeric: true, icon: <ShoppingCart className="w-5 h-5" />, color: "#16a34a", sub: "All time" },
            { label: "In Transit", value: orders.filter(o => o.status === "in-transit").length, numeric: true, icon: <Truck className="w-5 h-5" />, color: "#7c3aed", sub: "Shipments active" },
            { label: "Processing", value: orders.filter(o => o.status === "processing").length, numeric: true, icon: <Clock className="w-5 h-5" />, color: "#d97706", sub: "Being prepared" },
            { label: "Monthly Spend", value: "₹17.6L", numeric: false, icon: <TrendingUp className="w-5 h-5" />, color: "#0d9488", sub: "-9% vs last month" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)", borderColor: "rgba(22,163,74,0.2)", transition: { duration: 0.18 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: s.color }}>{s.icon}</span>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--foreground)", letterSpacing: "-0.02em" }}>
                {s.numeric ? <AnimatedCounter to={s.value as number} /> : s.value}
              </p>
              <p style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 500, marginTop: "2px" }}>{s.label}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem", marginTop: "4px" }}>{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "16px" }}>Monthly Procurement Spend (₹)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart key="company-overview-spend" data={spendData}>
                <defs>
                  <linearGradient id="companyOverviewSpendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Spend"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Area type="monotone" dataKey="spend" name="spend" stroke="#0d9488" strokeWidth={2} fill="url(#companyOverviewSpendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "16px" }}>Spend by Category</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart key="company-overview-pie">
                <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {categoryBreakdown.map((entry, i) => (
                    <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {categoryBreakdown.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: CATEGORY_COLORS[i] }} />
                    <span style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>{c.name}</span>
                  </div>
                  <span style={{ color: "var(--foreground)", fontSize: "0.75rem", fontWeight: 500 }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600 }}>Recent Orders</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {orders.map(o => {
              const s = STATUS_CONFIG[o.status];
              return (
                <div key={o.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 500, fontSize: "0.875rem" }}>{o.product}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>{o.middleman} · {o.quantity} {o.unit} · ETA {o.eta}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>{s.label}</span>
                    <p style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "0.875rem" }}>₹{(o.quantity * o.price).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "browse") {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Browse Available Stock</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>{STOCK.length} products available from verified middlemen.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted-foreground)" }} />
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-lg outline-none"
              placeholder="Search products or middlemen…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: "var(--card)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.875rem" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-3 py-2 rounded-lg text-sm transition-all"
                style={{
                  background: categoryFilter === c ? "var(--primary)" : "var(--card)",
                  color: categoryFilter === c ? "var(--primary-foreground)" : "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            return (
              <div key={item.id} className="rounded-xl p-5 flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{item.product.cropName}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem" }}>{item.product.cropName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-lg p-2.5" style={{ background: "var(--secondary)" }}>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.68rem" }}>Available</p>
                    <p style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "0.9rem" }}>{item.quantity}kg</p>
                  </div>
                  <div className="rounded-lg p-2.5" style={{ background: "var(--secondary)" }}>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.68rem" }}>Price</p>
                    <p style={{ color: "var(--foreground)", fontWeight: 600, fontSize: "0.9rem" }}>₹{item.priceAtTransfer}/kg</p>
                  </div>
                </div>
                <p
                style={{
                  color: "var(--muted-foreground)",
                  fontSize: "0.75rem",
                  marginBottom: "12px"
                  }}
                  >
                    Farmer: {item.farmer.name}
                    <br />
                    Middleman: {item.middleman.user.name}
                    </p>
                <button
                  onClick={() => setOrderModal(item)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg mt-auto"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "0.875rem" }}
                >
                  <ShoppingCart className="w-4 h-4" /> Place Order
                </button>
              </div>
            );
          })}
        </div>

        {orderModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Place Order</h2>
                <button onClick={() => setOrderModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X className="w-5 h-5" /></button>
              </div>
              <div className="rounded-lg p-3 mb-4" style={{ background: "var(--accent)" }}>
                <p style={{ color: "var(--accent-foreground)", fontWeight: 600 }}>{orderModal.product.cropName}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem" }}>
                 {orderModal.middleman.user.name} · ₹{orderModal.priceAtTransfer}/kg · {orderModal.available} {orderModal.unit} available
                </p>
              </div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Quantity (kg)</label>
              <input
                type="number"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none mb-2"
                placeholder={`Max ${orderModal.quantity}`}
                value={orderQty}
                max={orderModal.quantity}
                onChange={e => setOrderQty(e.target.value)}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              />
              {orderQty && (
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", marginBottom: "16px" }}>
                  Total: ₹{(Number(orderQty) * orderModal.priceAtTransfer).toLocaleString()}
                </p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setOrderModal(null)} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button onClick={handlePlaceOrder} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 600 }}>Confirm Order</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === "place-order") {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Place Order</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>Quick-order from available stock.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {STOCK.slice(0, 4).map(item => (
            <div key={item.id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between mb-2">
                <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{item.product}</p>
                <span style={{ background: QUALITY_CONFIG[item.quality].bg, color: QUALITY_CONFIG[item.quality].color, fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: "999px" }}>{item.quality}</span>
              </div>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", marginBottom: "12px" }}>{item.middleman} · {item.location}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: "var(--foreground)", fontWeight: 700 }}>₹{item.price}/{item.unit}</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>{item.available} {item.unit} available</p>
                </div>
                <button
                  onClick={() => setOrderModal(item)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "0.875rem" }}
                >
                  <Plus className="w-4 h-4" /> Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {orderModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Place Order</h2>
                <button onClick={() => setOrderModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X className="w-5 h-5" /></button>
              </div>
              <div className="rounded-lg p-3 mb-4" style={{ background: "var(--accent)" }}>
                <p style={{ color: "var(--accent-foreground)", fontWeight: 600 }}>{orderModal.product.cropName}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem" }}>{orderModal.middleman} · ₹{orderModal.price}/{orderModal.unit}</p>
              </div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Quantity (kg)</label>
              <input
                type="number"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none mb-4"
                placeholder="Enter quantity"
                value={orderQty}
                onChange={e => setOrderQty(e.target.value)}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              />
              <div className="flex gap-3">
                <button onClick={() => setOrderModal(null)} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button onClick={handlePlaceOrder} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 600 }}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === "my-orders") {
    const STEPS = ["Processing", "Confirmed", "In Transit", "Delivered"];
    const getStep = (s: string) => {
      if (s === "delivered") return 3;
      if (s === "in-transit") return 2;
      if (s === "confirmed") return 1;
      return 0;
    };

    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>My Orders</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>{orders.length} orders placed.</p>
        </div>

        <div className="space-y-4">
          {orders.map(o => {
            const s = STATUS_CONFIG[o.status];
            const step = getStep(o.status);
            return (
              <div key={o.id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{o.product}</p>
                      <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>{s.label}</span>
                    </div>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem" }}>
                      {o.id} · {o.middleman} · {o.quantity} {o.unit} · ₹{(o.quantity * o.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem" }}>ETA</p>
                    <p style={{ color: "var(--foreground)", fontWeight: 500, fontSize: "0.85rem" }}>{o.eta}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {STEPS.map((label, i) => {
                    const done = i <= step;
                    const active = i === step;
                    return (
                      <div key={label} className="flex-1 flex flex-col items-center">
                        <div className="flex items-center w-full">
                          {i > 0 && <div style={{ flex: 1, height: "2px", background: i <= step ? "var(--primary)" : "var(--muted)" }} />}
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: done ? "var(--primary)" : "var(--muted)",
                              border: active ? "2px solid var(--primary)" : "none",
                            }}
                          >
                            {done && <CheckCircle2 className="w-3 h-3" style={{ color: "white" }} />}
                          </div>
                          {i < STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: i < step ? "var(--primary)" : "var(--muted)" }} />}
                        </div>
                        <p style={{ fontSize: "0.62rem", color: done ? "var(--primary)" : "var(--muted-foreground)", marginTop: "4px", textAlign: "center", fontWeight: done ? 600 : 400 }}>{label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
