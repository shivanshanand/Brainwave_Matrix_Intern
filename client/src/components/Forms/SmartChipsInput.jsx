import { useEffect, useRef, useState } from "react";

const norm = (s) => s?.trim().toLowerCase();

export default function SmartChipsInput({
  label,
  placeholder = "Type and press Enter…",
  value = [],
  onChange,
  fetchOptions,
  maxItems = 4,
  itemMin = 2,
  itemMax = 40,
  disabled = false,
  allowNew = true,
  helper,
}) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inputError, setInputError] = useState("");
  const blurTimeout = useRef();

  const onBlur = () => {
    blurTimeout.current = setTimeout(() => setFocused(false), 120);
  };
  const onFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setFocused(true);
  };
  const onDropdownInteract = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
  };

  const cleanList = (list) => {
    const cleaned = (list || [])
      .map(norm)
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
    return cleaned.slice(0, maxItems);
  };
  const canAddMore = value.length < maxItems;

  const handleAdd = (raw) => {
    const v = norm(raw);
    if (!v) return;
    if (value.includes(v)) return setInputError("Already added");
    if (v.length < itemMin || v.length > itemMax)
      return setInputError(`Must be ${itemMin}-${itemMax} chars`);
    if (!canAddMore) return;
    setInputError("");
    onChange(cleanList([...value, v]));
    setInput("");
  };
  useEffect(() => {
    if (!input) setInputError("");
  }, [input]);
  const handleRemove = (v) => {
    onChange(value.filter((x) => x !== v));
  };

  const queryOptions = async (q) => {
    if (!fetchOptions) return setOptions([]);
    try {
      setLoading(true);
      const data = await fetchOptions(q);
      const cleaned = cleanList(data);
      setOptions(cleaned.filter((opt) => !value.includes(opt)));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!focused) return;
    const t = setTimeout(() => queryOptions(input), 150);
    return () => clearTimeout(t);
  }, [input, focused]);
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (allowNew) handleAdd(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      handleRemove(value[value.length - 1]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-neutral-200 font-semibold mb-2">
          {label}
        </label>
      )}
      <div
        className={`rounded-xl border bg-neutral-900 border-neutral-700 px-3 py-2 flex flex-wrap gap-2 focus-within:border-teal-500 transition`}
        tabIndex={-1}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {value.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border bg-neutral-800 border-teal-500/50 text-teal-300 font-semibold hover:bg-teal-700/80 transition"
          >
            #{chip}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleRemove(chip)}
              className="ml-1 text-teal-300 hover:text-white font-bold text-lg"
              aria-label={`Remove ${chip}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          className="flex-1 min-w-[120px] bg-transparent outline-none text-white placeholder:text-neutral-500 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={canAddMore ? placeholder : `Limit reached (${maxItems})`}
          disabled={disabled || !canAddMore}
        />
      </div>

      {/* Dropdown */}
      {focused && (options.length > 0 || loading) && (
        <div
          className="mt-1 rounded-xl border border-teal-800 bg-neutral-950/95 overflow-hidden shadow-lg z-40"
          onMouseDown={onDropdownInteract}
        >
          {loading && (
            <div className="px-3 py-2 text-teal-300/80 text-sm">Loading…</div>
          )}
          {!loading &&
            options.map((opt) => (
              <button
                type="button"
                key={typeof opt === "string" ? opt : opt.name}
                className="w-full text-left px-3 py-2 text-white hover:bg-teal-900/40 hover:text-teal-300 transition"
                onMouseDown={onDropdownInteract}
                onClick={() =>
                  handleAdd(typeof opt === "string" ? opt : opt.name)
                }
              >
                #{typeof opt === "string" ? opt : opt.name}
              </button>
            ))}
          {inputError && (
            <div className="text-xs py-1 text-pink-400 border-t border-neutral-800 text-center">
              {inputError}
            </div>
          )}
        </div>
      )}

      <div className="mt-1 text-xs text-neutral-400 select-none">
        {helper ||
          `Max ${maxItems}. ${itemMin}-${itemMax} chars each. ${
            maxItems - value.length
          } left.`}
      </div>
    </div>
  );
}
