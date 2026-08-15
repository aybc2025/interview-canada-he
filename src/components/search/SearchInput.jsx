import { useEffect, useRef } from 'react';

export default function SearchInput({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor="q" className="sr-only">
        חיפוש בכל המדריך
      </label>
      <input
        id="q"
        ref={ref}
        type="search"
        dir="auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="חיפוש בכל המדריך"
        className="w-full bg-white border-2 border-petrol-mid rounded-xl px-4 py-3 text-base min-h-[44px] focus:border-tie"
      />
    </div>
  );
}
