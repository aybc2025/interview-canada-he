export default function ReadingProgress({ pct }) {
  return (
    <div className="no-print h-[3px] bg-petrol-mid" aria-hidden="true">
      <div
        className="h-[3px] bg-[#8FD3D8] transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
