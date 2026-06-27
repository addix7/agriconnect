import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  Warehouse,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { AnimatedCounter } from "../motion/AnimatedCounter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface Order {
  id: string;
  farmer: string;
  product: string;
  quantity: number;
  unit: string;
  price: number;
  status: "pending" | "accepted" | "rejected" | "in-transit" | "delivered";
  date: string;
  delivery: string;
}



const inventoryData = [
  { product: "Rice", stock: 850, capacity: 1200 },
  { product: "Wheat", stock: 620, capacity: 1000 },
  { product: "Corn", stock: 440, capacity: 800 },
  { product: "Soybean", stock: 280, capacity: 500 },
  { product: "Tomato", stock: 160, capacity: 300 },
];

const deliveryTrend = [
  { day: "Mon", on_time: 12, delayed: 2 },
  { day: "Tue", on_time: 15, delayed: 1 },
  { day: "Wed", on_time: 11, delayed: 3 },
  { day: "Thu", on_time: 18, delayed: 0 },
  { day: "Fri", on_time: 14, delayed: 2 },
  { day: "Sat", on_time: 9, delayed: 1 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: {
    label: "Pending",
    color: "#d97706",
    bg: "#fef3c7"
  },

  confirmed: {
    label: "Confirmed",
    color: "#16a34a",
    bg: "#dcfce7"
  },

  accepted: {
    label: "Accepted",
    color: "#16a34a",
    bg: "#dcfce7"
  },

  rejected: {
    label: "Rejected",
    color: "#dc2626",
    bg: "#fee2e2"
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
};

interface Props {
  currentPage: string;
  name: string;
}

interface Stock {
  _id: string;
  quantity: number;
  priceAtTransfer: number;
  status: string;
  farmer: {
    name: string;
  };
  product: {
    cropName: string;
  };
}


export function MiddlemanDashboard({ currentPage, name }: Props) {
  const [orders, setOrders] = useState<any[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/middleman/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  fetchOrders();

}, []);

  const fetchStock = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:3000/my-stock",
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    );
    setStock(res.data);
  
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchStock();
}, []);

  const handleAccept = async (id: string) => {
  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:3000/order/${id}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setOrders(
      orders.map(o =>
        o._id === id ? { ...o, status: "confirmed" } : o
      )
    );

  } catch (error) {

    console.log(error);

  }
};
 const handleReject = async (id: string) => {
  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:3000/order/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setOrders(
      orders.map(o =>
        o._id === id ? { ...o, status: "rejected" } : o
      )
    );

  } catch (error) {

    console.log(error);

  }
};

const handleDeliver = async (id: string) => {

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:3000/order/${id}/deliver`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setOrders(
      orders.map(o =>
        o._id === id
          ? { ...o, status: "delivered" }
          : o
      )
    );

  } catch (error) {

    console.log(error);

  }

};

  const pendingOrders = orders.filter(o => o.status === "pending");
  const activeOrders = orders.filter(o => ["accepted", "in-transit"].includes(o.status));

  if (currentPage === "overview") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
            Good morning, {name} 👋
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>
            Manage your supply chain operations.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Inventory", value: 2350, numeric: true, suffix: " kg", icon: <Warehouse className="w-5 h-5" />, color: "#0d9488", change: "Across 5 products" },
            { label: "Pending Orders", value: pendingOrders.length, numeric: true, suffix: "", icon: <Clock className="w-5 h-5" />, color: "#d97706", change: "Needs your action" },
            { label: "Active Shipments", value: activeOrders.length, numeric: true, suffix: "", icon: <Truck className="w-5 h-5" />, color: "#7c3aed", change: "On the way" },
            { label: "Monthly Turnover", value: "₹6.8L", numeric: false, suffix: "", icon: <TrendingUp className="w-5 h-5" />, color: "#16a34a", change: "+18% growth" },
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
                {s.numeric ? <AnimatedCounter to={s.value as number} suffix={s.suffix} /> : s.value}
              </p>
              <p style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 500, marginTop: "2px" }}>{s.label}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem", marginTop: "4px" }}>{s.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Pending orders quick view */}
        {pendingOrders.length > 0 && (
          <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ color: "var(--foreground)", fontWeight: 600 }}>Pending Orders — Action Required</h3>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {pendingOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 500, fontSize: "0.875rem" }}>{o.product}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>{o.farmer} · {o.quantity} {o.unit} · ₹{o.price}/{o.unit}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(o.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: "#fee2e2", color: "#dc2626", border: "none", cursor: "pointer", fontWeight: 500 }}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleAccept(o.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 500 }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "16px" }}>Inventory Levels</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart key="middleman-overview-inventory" data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="product" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Bar dataKey="capacity" fill="#e9f5ec" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stock" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "16px" }}>Delivery Performance (This Week)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart key="middleman-overview-delivery" data={deliveryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="on_time" stroke="#16a34a" strokeWidth={2} dot={false} name="On Time" />
                <Line type="monotone" dataKey="delayed" stroke="#dc2626" strokeWidth={2} dot={false} name="Delayed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "inventory") {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Inventory Management</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>Track stock levels and capacity.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stock.map(item => {
            const pct = 100;
            const color = pct > 70 ? "#16a34a" : pct > 40 ? "#d97706" : "#dc2626";
            return (
              <div key={item._id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
                    <Package className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  </div>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--foreground)" }}>{pct}%</span>
                </div>
                <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{item.product.cropName}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", marginTop: "2px" }}>{item.quantity} kg</p>
                <div className="mt-3 rounded-full overflow-hidden" style={{ height: "6px", background: "var(--muted)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "999px", transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600 }}>All Orders — Inventory Impact</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Order ID", "Farmer", "Product", "Qty", "Value", "Status"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left" style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {orders.map(o => {
                const s = STATUS_CONFIG[o.status];
                return (
                  <tr key={o.id} className="hover:bg-[var(--muted)] transition-colors">
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>{o.id}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "0.875rem" }}>{o.farmer}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>{o.product}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "0.875rem" }}>{o.quantity} {o.unit}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>₹{(o.quantity * o.price).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (currentPage === "orders") {
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Order Management</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>Review and manage incoming orders from farmers.</p>
        </div>

        <div className="space-y-3">
          {orders.map(o => {
            const s = STATUS_CONFIG[o.status];
            return (
              <div key={o._id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{o.middlemanStock.product.cropName}</p>
                      <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>{s.label}</span>
                    </div>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>
                      {o._id.slice(-6)} · Company: {o.company.name} · {o.quantity} kg · ₹{o.price}/kg · Total: ₹{(o.quantity * o.price).toLocaleString()}
                    </p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginTop: "2px" }}>
                      Order Date: {o.createdAt.split("T")[0]}
                    </p>
                  </div>
                  {o.status === "pending" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleReject(o._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                        style={{ background: "#fee2e2", color: "#dc2626", border: "none", cursor: "pointer", fontWeight: 500 }}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleAccept(o._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 500 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (currentPage === "delivery") {
    const trackingOrders = orders.filter(o =>
      ["confirmed", "delivered"].includes(o.status)
    );

    const STEPS = [
      "Order Placed",
      "Confirmed",
      "Delivered"
    ];
    
    const getStep = (status: string) => {
      if (status === "delivered") return 3;
      
      if (status === "confirmed") return 2;
      
      return 1;
    
    };

    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Delivery Tracking</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>Real-time tracking for all shipments.</p>
        </div>

        <div className="space-y-4">
          {trackingOrders.map(o => {
            const step = getStep(o.status);
            return (
              <div key={o._id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{o.middlemanStock.product.cropName}</p>
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem" }}>{o._id.slice(-6)} · Company: {o.company.name} · {o.quantity} kg  </p>
                  </div>
                  <div className="text-right">
                    <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem" }}>Order Date</p>
                    <p style={{ color: "var(--foreground)", fontWeight: 500, fontSize: "0.85rem" }}>{o.createdAt.split("T")[0]}</p>
                  </div>
                </div>

                {o.status === "confirmed" && (
                  <div className="mt-4 flex justify-end">
                    <button
                    onClick={() => handleDeliver(o._id)}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                    >
                      Mark Delivered
                      </button>
                      </div>
                    )}
                <div className="flex items-center gap-0">
                  {STEPS.map((s, i) => {
                    const done = i < step;
                    const active = i === step - 1;
                    return (
                      <div key={s} className="flex-1 flex flex-col items-center">
                        <div className="flex items-center w-full">
                          {i > 0 && <div style={{ flex: 1, height: "2px", background: done || i < step ? "var(--primary)" : "var(--muted)" }} />}
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              background: done ? "var(--primary)" : active ? "var(--accent)" : "var(--muted)",
                              border: active ? "2px solid var(--primary)" : "none",
                            }}
                          >
                            {done && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "white" }} />}
                          </div>
                          {i < STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: i < step - 1 ? "var(--primary)" : "var(--muted)" }} />}
                        </div>
                        <p style={{ fontSize: "0.65rem", color: done ? "var(--primary)" : "var(--muted-foreground)", marginTop: "4px", textAlign: "center", fontWeight: done ? 600 : 400 }}>{s}</p>
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
