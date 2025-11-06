export default function InfoBox({ label, value }) {
  return (
    <div className="p-5 rounded-2xl w-full bg-[rgba(255,255,255,0.03)]">
      <p className="text-sm text-neutral300">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
