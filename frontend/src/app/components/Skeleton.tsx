import { motion } from "motion/react";

function SkeletonBlock({ width = "100%", height = 16, rounded = 8, className = "" }: {
  width?: string | number;
  height?: number;
  rounded?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: "var(--muted)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between">
        <SkeletonBlock width={28} height={28} rounded={8} />
        <SkeletonBlock width={20} height={20} rounded={4} />
      </div>
      <SkeletonBlock width="55%" height={28} rounded={6} />
      <SkeletonBlock width="70%" height={12} rounded={4} />
      <SkeletonBlock width="50%" height={10} rounded={4} />
    </div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <SkeletonBlock width="35%" height={16} rounded={4} />
      <div style={{ height, position: "relative", display: "flex", alignItems: "flex-end", gap: 8 }}>
        {[65, 80, 50, 90, 70, 85, 60].map((h, i) => (
          <motion.div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: "4px 4px 0 0",
              background: "var(--muted)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.08 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-3.5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {[25, 15, 15, 12, 15, 10].map((w, i) => (
          <SkeletonBlock key={i} width={`${w}%`} height={10} rounded={3} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: i < rows - 1 ? "1px solid var(--border)" : "none" }}
        >
          <div className="flex items-center gap-3" style={{ width: "25%" }}>
            <SkeletonBlock width={32} height={32} rounded={8} />
            <div className="flex-1 space-y-2">
              <SkeletonBlock width="80%" height={11} rounded={3} />
              <SkeletonBlock width="55%" height={9} rounded={3} />
            </div>
          </div>
          {[15, 15, 12, 15, 10].map((w, j) => (
            <SkeletonBlock key={j} width={`${w}%`} height={10} rounded={3} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <SkeletonBlock width="40%" height={22} rounded={6} />
        <SkeletonBlock width="28%" height={12} rounded={4} />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
      </div>
      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><ChartSkeleton height={200} /></div>
        <ChartSkeleton height={200} />
      </div>
      {/* Table */}
      <TableSkeleton rows={4} />
    </div>
  );
}
