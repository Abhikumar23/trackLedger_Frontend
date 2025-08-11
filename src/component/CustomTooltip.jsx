export default function CustomTooltip ({ active, payload, label }){
  if (active && payload && payload.length > 0) {
    const entry = payload[0]; // Only show the hovered bar's data
    return (
      <div className="bg-white p-2 px-4 py-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-semibold">{label}</p>
        <p style={{ color: entry.fill }}>
          {entry.name}: ₹{entry.value}
        </p>
      </div>
    );
  }
  return null;
};
