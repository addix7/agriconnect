import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Package,
  ArrowRightLeft,
  DollarSign,
  Plus,
  X,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Leaf,
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
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 53000 },
  { month: "Mar", revenue: 61000 },
  { month: "Apr", revenue: 55000 },
  { month: "May", revenue: 78000 },
  { month: "Jun", revenue: 84000 },
  { month: "Jul", revenue: 91000 },
];

const productData = [
  { name: "Rice", qty: 420 },
  { name: "Wheat", qty: 310 },
  { name: "Corn", qty: 280 },
  { name: "Soybean", qty: 190 },
  { name: "Cotton", qty: 150 },
];

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  status: "available" | "pending" | "transferred";
  date: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "PRD001", name: "Organic Basmati Rice", category: "Grains", quantity: 500, unit: "kg", price: 85, status: "available", date: "2026-06-01" },
  { id: "PRD002", name: "Premium Wheat", category: "Grains", quantity: 320, unit: "kg", price: 42, status: "pending", date: "2026-06-03" },
  { id: "PRD003", name: "Yellow Corn", category: "Grains", quantity: 200, unit: "kg", price: 35, status: "transferred", date: "2026-05-28" },
  { id: "PRD004", name: "Green Soybeans", category: "Legumes", quantity: 150, unit: "kg", price: 90, status: "available", date: "2026-06-05" },
  { id: "PRD005", name: "Fresh Tomatoes", category: "Vegetables", quantity: 80, unit: "kg", price: 60, status: "available", date: "2026-06-07" },
];

const CATEGORIES = ["Grains", "Legumes", "Vegetables", "Fruits", "Spices", "Oilseeds"];
const UNITS = ["kg", "tonnes", "quintals", "bags", "boxes"];

const STATUS_CONFIG = {
  available: { label: "Available", color: "#16a34a", bg: "#dcfce7" },
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7" },
  transferred: { label: "Transferred", color: "#6b7280", bg: "#f3f4f6" },
};

interface Props {
  currentPage: string;
  name: string;
}

export function FarmerDashboard({ currentPage, name }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/my-products",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const formattedProducts = response.data.map((p: any) => ({
      id: p._id,
      name: p.cropName,
      category: "Grains",
      quantity: p.quantity,
      unit: "kg",
      price: p.price,
      status: "available",
      date: p.createdAt.split("T")[0]
    }));
    
    setProducts(formattedProducts);

  } catch (error) {
    console.log(error);
  }
};

const fetchMiddlemen = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/middlemen"
    );

    setMiddlemen(response.data);

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchProducts();
  fetchMiddlemen();
}, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transferModal, setTransferModal] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "Grains", quantity: "", unit: "kg", price: "" });
  const [transferTo, setTransferTo] = useState("");
  const [middlemen, setMiddlemen] = useState([]);

  const stats = [
    { label: "Total Products", value: products.length, icon: <Package className="w-5 h-5" />, change: "+2 this week", color: "#16a34a" },
    { label: "Available Stock", value: products.filter(p => p.status === "available").length, icon: <Leaf className="w-5 h-5" />, change: "Ready to sell", color: "#0d9488" },
    { label: "Pending Transfers", value: products.filter(p => p.status === "pending").length, icon: <Clock className="w-5 h-5" />, change: "Awaiting pickup", color: "#d97706" },
    { label: "Total Revenue", value: "₹4,82,000", icon: <DollarSign className="w-5 h-5" />, change: "+12% vs last month", color: "#7c3aed" },
  ];
  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/products",
        {
          cropName: form.name,
          quantity: Number(form.quantity),
          price: Number(form.price),
          location: "Nagpur"
        },
        {
          headers: {
            authorization: `Bearer ${token}`  
           }
          }
        );
        fetchProducts();

    setShowCreateModal(false);
    setForm({
      name: "",
      category: "Grains",
      quantity: "",
      unit: "kg",
      price: ""
    });

  } catch (error) {
    console.log(error);
  }
};

 const handleTransfer = async () => {
  try {
    if (!transferModal || !transferTo) return;

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:3000/transfer",
      {
        productId: transferModal.id,
        middlemanId: transferTo,
        quantity: transferModal.quantity,
        priceAtTransfer: transferModal.price
      },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    );

    fetchProducts();

    setTransferModal(null);
    setTransferTo("");

  } catch (error) {
    console.log(error);
  }
};

  if (currentPage === "overview") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
            Good morning, {name} 👋
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>
            Here's what's happening with your farm today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: products.length, numeric: true, icon: <Package className="w-5 h-5" />, change: "+2 this week", color: "#16a34a" },
            { label: "Available Stock", value: products.filter(p => p.status === "available").length, numeric: true, icon: <Leaf className="w-5 h-5" />, change: "Ready to sell", color: "#0d9488" },
            { label: "Pending Transfers", value: products.filter(p => p.status === "pending").length, numeric: true, icon: <Clock className="w-5 h-5" />, change: "Awaiting pickup", color: "#d97706" },
            { label: "Total Revenue", value: "₹4,82,000", numeric: false, icon: <DollarSign className="w-5 h-5" />, change: "+12% vs last month", color: "#7c3aed" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.09)", borderColor: "rgba(22,163,74,0.2)", transition: { duration: 0.18 } }}
            >
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <TrendingUp className="w-3.5 h-3.5" style={{ color: "var(--muted-foreground)" }} />
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--foreground)", letterSpacing: "-0.02em" }}>
                {stat.numeric ? <AnimatedCounter to={stat.value as number} /> : stat.value}
              </p>
              <p style={{ color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 500, marginTop: "2px" }}>{stat.label}</p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem", marginTop: "4px" }}>{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-4">
          <motion.div
            className="lg:col-span-2 rounded-xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 style={{ color: "var(--foreground)", marginBottom: "16px", fontWeight: 600 }}>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart key="farmer-overview-revenue" data={revenueData}>
                <defs>
                  <linearGradient id="farmerOverviewRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#farmerOverviewRevenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="rounded-xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.37, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 style={{ color: "var(--foreground)", marginBottom: "16px", fontWeight: 600 }}>Product Mix</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart key="farmer-overview-product-mix" data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Bar dataKey="qty" name="qty" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent products */}
        <motion.div
          className="rounded-xl"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600 }}>Recent Products</h3>
            <span style={{ color: "var(--primary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: 500 }}>View all</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {products.slice(0, 4).map((product, idx) => {
              const s = STATUS_CONFIG[product.status];
              return (
                <motion.div
                  key={product.id}
                  className="flex items-center justify-between px-5 py-3.5"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.48 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ backgroundColor: "var(--muted)", transition: { duration: 0.15 } }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
                      <Leaf className="w-4 h-4" style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <p style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>{product.name}</p>
                      <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>{product.quantity} {product.unit} · {product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>
                      {s.label}
                    </span>
                    <p style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 600 }}>₹{product.price}/kg</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  if (currentPage === "create-product") {
    return (
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>
            Create Product
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>
            List a new agricultural product for sale.
          </p>
        </div>

        <div className="rounded-xl p-6 space-y-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Product Name</label>
              <input
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none"
                placeholder="e.g. Organic Basmati Rice"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              />
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Category</label>
              <select
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Unit</label>
              <select
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none"
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              >
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Quantity</label>
              <input
                type="number"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none"
                placeholder="500"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              />
            </div>

            <div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Price per {form.unit} (₹)</label>
              <input
                type="number"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none"
                placeholder="85"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={{ background: "var(--input-background)", border: "1.5px solid var(--border)", color: "var(--foreground)", fontSize: "0.9rem" }}
              />
            </div>
          </div>

          {form.name && form.quantity && form.price && (
            <div className="rounded-lg p-4" style={{ background: "var(--accent)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--accent-foreground)", fontSize: "0.85rem", fontWeight: 500 }}>
                Preview: {form.quantity} {form.unit} of {form.name} at ₹{form.price}/{form.unit}
              </p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", marginTop: "2px" }}>
                Total value: ₹{(Number(form.quantity) * Number(form.price)).toLocaleString()}
              </p>
            </div>
          )}

          <button
            onClick={handleCreateProduct}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontWeight: 600, fontSize: "0.9rem", border: "none", cursor: "pointer" }}
          >
            <Plus className="w-4 h-4" /> List Product
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === "my-products") {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>My Products</h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>{products.length} products listed</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", fontWeight: 500, fontSize: "0.85rem", border: "none", cursor: "pointer" }}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Product", "Category", "Quantity", "Price", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left" style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {products.map(p => {
                const s = STATUS_CONFIG[p.status];
                return (
                  <tr key={p.id} className="hover:bg-[var(--muted)] transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <p style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>{p.name}</p>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "0.72rem" }}>{p.id}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>{p.category}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "0.875rem" }}>{p.quantity} {p.unit}</td>
                    <td className="px-5 py-3.5" style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>₹{p.price}/{p.unit}</td>
                    <td className="px-5 py-3.5">
                      <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>{p.date}</td>
                    <td className="px-5 py-3.5">
                      {p.status === "available" && (
                        <button
                          onClick={() => setTransferModal(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                          style={{ background: "var(--accent)", color: "var(--accent-foreground)", border: "1px solid var(--border)", fontWeight: 500, cursor: "pointer" }}
                        >
                          <ArrowRightLeft className="w-3 h-3" /> Transfer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Transfer Modal */}
        {transferModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Transfer Product</h2>
                <button onClick={() => setTransferModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X className="w-5 h-5" /></button>
              </div>
              <div className="rounded-lg p-3 mb-4" style={{ background: "var(--accent)" }}>
                <p style={{ color: "var(--accent-foreground)", fontWeight: 500, fontSize: "0.9rem" }}>{transferModal.name}</p>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem" }}>{transferModal.quantity} {transferModal.unit}</p>
              </div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Transfer to Middleman</label>
              <select
              className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none mb-4"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              >
                <option value="">Select Middleman</option>
                {middlemen.map((m: any) => (
                  <option key={m._id} value={m._id}>
                    {m.user.name}
                    </option>
                  ))}
                  </select>
              <div className="flex gap-3">
                <button onClick={() => setTransferModal(null)} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button onClick={handleTransfer} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 600 }}>Confirm Transfer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === "transfer") {
    const available = products.filter(p => p.status === "available");
    return (
      <div className="p-6 space-y-4">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Transfer Product</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>Transfer available products to middlemen.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {available.map(p => (
            <div key={p.id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{p.name}</p>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem" }}>{p.id} · {p.category}</p>
                </div>
                <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: "0.72rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px" }}>Available</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>Quantity</p>
                  <p style={{ color: "var(--foreground)", fontWeight: 600 }}>{p.quantity} {p.unit}</p>
                </div>
                <div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>Price</p>
                  <p style={{ color: "var(--foreground)", fontWeight: 600 }}>₹{p.price}/{p.unit}</p>
                </div>
                <div>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem" }}>Value</p>
                  <p style={{ color: "var(--foreground)", fontWeight: 600 }}>₹{(p.quantity * p.price).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setTransferModal(p)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "0.875rem" }}
              >
                <ArrowRightLeft className="w-4 h-4" /> Transfer to Middleman
              </button>
            </div>
          ))}
          {available.length === 0 && (
            <div className="col-span-2 py-12 text-center rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--muted-foreground)" }} />
              <p style={{ color: "var(--muted-foreground)" }}>No available products to transfer.</p>
            </div>
          )}
        </div>

        {transferModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "var(--card)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: "var(--foreground)" }}>Confirm Transfer</h2>
                <button onClick={() => setTransferModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X className="w-5 h-5" /></button>
              </div>
              <label style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}>Middleman ID / Name</label>
              <select
              className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none mb-4"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              >
                <option value="">Select Middleman</option>
                {middlemen.map((m: any) => (
                  <option key={m._id} value={m._id}>
                    {m.user.name}
                    </option>
                  ))}
                  </select>
              <div className="flex gap-3">
                <button onClick={() => setTransferModal(null)} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button onClick={handleTransfer} className="flex-1 py-2.5 rounded-lg" style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", cursor: "pointer", fontWeight: 600 }}>Transfer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === "analytics") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--foreground)" }}>Analytics</h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", marginTop: "4px" }}>Track your farm's performance over time.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "16px" }}>Monthly Revenue (₹)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart key="farmer-analytics-revenue" data={revenueData}>
                <defs>
                  <linearGradient id="farmerAnalyticsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" name="revenue-analytics" stroke="#16a34a" strokeWidth={2.5} fill="url(#farmerAnalyticsRevenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--foreground)", fontWeight: 600, marginBottom: "16px" }}>Quantity Sold by Product (kg)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart key="farmer-analytics-product-bar" data={productData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7a62" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px" }} />
                <Bar dataKey="qty" name="qty-analytics" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Avg Price/kg", value: "₹62.4", delta: "+8.2%" },
            { label: "Products Sold", value: "1,250 kg", delta: "+15.3%" },
            { label: "Active Buyers", value: "34", delta: "+4" },
            { label: "Completion Rate", value: "94%", delta: "+2%" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.78rem", fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--foreground)", letterSpacing: "-0.02em", marginTop: "4px" }}>{s.value}</p>
              <p style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 500, marginTop: "2px" }}>{s.delta} vs last month</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
