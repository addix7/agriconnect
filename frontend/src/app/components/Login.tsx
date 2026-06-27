import { useState } from "react";
import axios from "axios";
import { Sprout, Eye, EyeOff, ArrowRight } from "lucide-react";

type Role = "farmer" | "middleman" | "company";

interface User {
  role: Role;
  name: string;
}

const DEMO_ACCOUNTS: { username: string; password: string; role: Role; name: string }[] = [
  { username: "farmer01", password: "demo", role: "farmer", name: "Ravi Kumar" },
  { username: "middleman01", password: "demo", role: "middleman", name: "Suresh Traders" },
  { username: "company01", password: "demo", role: "company", name: "AgroMart Corp" },
];

interface Props {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(false);
  
  const [registerName, setRegisterName] = useState("");

  const [registerPassword, setRegisterPassword] = useState("");

  const [registerRole, setRegisterRole] = useState("farmer");
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {

    const response = await axios.post(
      "http://localhost:3000/login",
      {
        name: username,
        password: password
      }
    );

    const data = response.data;

    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    onLogin({
      role: data.user.role,
      name: data.user.name
    });

  } catch (error: any) {

    setError(
      error.response?.data?.message ||
      "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

const handleRegister = async () => {

  try {

    await axios.post(
      "http://localhost:3000/register",
      {
        name: registerName,
        password: registerPassword,
        role: registerRole
      }
    );

    alert("Registration successful!");

    setIsRegister(false);

    setRegisterName("");

    setRegisterPassword("");

  }

  catch (error:any) {

    alert(
      error.response?.data?.message ||
      "Registration failed"
    );

  }

};

  const quickLogin = (role: Role) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!;
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{ background: "var(--sidebar)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--sidebar-primary)" }}
          >
            <Sprout className="w-5 h-5" style={{ color: "var(--sidebar)" }} />
          </div>
          <span
            className="text-lg"
            style={{
              color: "var(--sidebar-foreground)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            AgriConnect
          </span>
        </div>

        <div>
          <blockquote
            style={{
              color: "var(--sidebar-foreground)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <p className="text-2xl leading-snug mb-6" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
              "From farm to table, every step tracked, every stakeholder empowered."
            </p>
            <footer style={{ color: "var(--sidebar-accent-foreground)", fontSize: "0.875rem" }}>
              Agricultural Supply Chain Platform
            </footer>
          </blockquote>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Farmers", value: "12,400+" },
            { label: "Middlemen", value: "3,200+" },
            { label: "Companies", value: "840+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: "var(--sidebar-accent)" }}
            >
              <p
                className="text-2xl"
                style={{
                  color: "var(--sidebar-primary)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </p>
              <p style={{ color: "var(--sidebar-accent-foreground)", fontSize: "0.75rem", marginTop: "2px" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-8" style={{ background: "var(--background)" }}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Sprout className="w-6 h-6" style={{ color: "var(--primary)" }} />
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              AgriConnect
            </span>
          </div>

          <div className="mb-8">
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--foreground)",
                fontSize: "1.75rem",
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "var(--muted-foreground)", marginTop: "6px", fontSize: "0.9rem" }}>
              Sign in to your AgriConnect account
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <button
            type="button"
            onClick={() => setIsRegister(false)}
    
            className="flex-1 py-2 rounded-lg"
    
            style={{
      
              background: !isRegister ? "var(--primary)" : "var(--accent)",
      
              color: !isRegister
      
              ? "var(--primary-foreground)"
      
              : "var(--accent-foreground)",
      
              border: "none",
      
              cursor: "pointer",
      
              fontWeight: 600,
   
            }}
            >
              Login
              </button>

  <button
    type="button"
    onClick={() => setIsRegister(true)}
    className="flex-1 py-2 rounded-lg"
    style={{
      background: isRegister ? "var(--primary)" : "var(--accent)",
      color: isRegister
        ? "var(--primary-foreground)"
        : "var(--accent-foreground)",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Register
  </button>
</div>

          {/* Quick login buttons */}
          <div className="mb-6">
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginBottom: "8px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick demo access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["farmer", "middleman", "company"] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => quickLogin(role)}
                  className="px-3 py-2 rounded-lg text-xs transition-all hover:scale-105"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-foreground)",
                    border: "1px solid var(--border)",
                    fontWeight: 500,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {!isRegister ? (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. farmer01"
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg outline-none transition-all"
                style={{
                  background: "var(--input-background)",
                  border: "1.5px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.9rem",
                }}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{ color: "var(--foreground)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg pr-10 outline-none transition-all"
                  style={{
                    background: "var(--input-background)",
                    border: "1.5px solid var(--border)",
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="rounded-lg px-3.5 py-2.5 text-xs"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-98 mt-2"
              style={{
                background: loading ? "var(--muted)" : "var(--primary)",
                color: "var(--primary-foreground)",
                fontWeight: 600,
                fontSize: "0.9rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          ) : (

<div className="space-y-4">

  {/* Register form */}

  <div>
    <label
      style={{
        color: "var(--foreground)",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
    >
      Name
    </label>

    <input
      type="text"
      value={registerName}
      onChange={(e) => setRegisterName(e.target.value)}
      className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg"
      style={{
        background: "var(--input-background)",
        border: "1.5px solid var(--border)",
        color: "var(--foreground)",
      }}
    />
  </div>

  <div>
    <label
      style={{
        color: "var(--foreground)",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
    >
      Password
    </label>

    <input
      type="password"
      value={registerPassword}
      onChange={(e) => setRegisterPassword(e.target.value)}
      className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg"
      style={{
        background: "var(--input-background)",
        border: "1.5px solid var(--border)",
        color: "var(--foreground)",
      }}
    />
  </div>

  <div>
    <label
      style={{
        color: "var(--foreground)",
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
    >
      Role
    </label>

    <select
      value={registerRole}
      onChange={(e) => setRegisterRole(e.target.value)}
      className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg"
      style={{
        background: "var(--input-background)",
        border: "1.5px solid var(--border)",
        color: "var(--foreground)",
      }}
    >
      <option value="farmer">Farmer</option>
      <option value="middleman">Middleman</option>
      <option value="company">Company</option>
    </select>
  </div>

  <button
    onClick={handleRegister}
    className="w-full py-2.5 rounded-lg"
    style={{
      background: "var(--primary)",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    Create Account
  </button>

</div>

)}
          
        </div>
      </div>
    </div>
  );
}


