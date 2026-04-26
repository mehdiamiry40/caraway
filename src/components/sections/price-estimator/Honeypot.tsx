interface HoneypotProps {
  value: string;
  onChange: (next: string) => void;
}

export function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div className="absolute -left-[9999px]" aria-hidden="true">
      <label htmlFor="est-website">Website</label>
      <input
        type="text"
        id="est-website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
