export const LINE_COLORS = {
  Red: "#EF4444",
  Yellow: "#FACC15",
  Blue: "#3B82F6",
  Green: "#22C55E",
  Violet: "#8B5CF6",
  Pink: "#EC4899",
  Magenta: "#D946EF",
  Orange: "#F97316",
  Grey: "#94A3B8",
  Aqua: "#06B6D4",
};

// label/icon shown in UI -> mode key sent to backend /api/route
export const MODES = [
  { key: "fastest", label: "Fastest", sub: "Least Time", icon: "⏱" },
  { key: "cheapest", label: "Cheapest", sub: "Least Price", icon: "₹" },
  { key: "fewest", label: "Least Station", sub: "Min Stations", icon: "🚉" },
  { key: "interchange", label: "Least Interchange", sub: "Min Changes", icon: "🔀" },
];