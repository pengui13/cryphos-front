import { useId } from "react";

export default function Input({
  label,
  readOnly,
  onFocus,
  onInput,
  value,
  onChange,
  onError,
  className = "",
  onBlur,
  pattern,
  type,
  inputMode,
  inputProps = {},
  whiteBg, // optional: if true, adds a subtle fill
}) {
  const autoId = useId();
  const id = inputProps.id || autoId;

  const baseFill = whiteBg ? "bg-white/5 focus:bg-white/7.5" : "bg-transparent";
  const error = inputProps.error || inputProps["aria-invalid"] || false;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        type={type || "text"}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onInput={onInput}
        onBlur={onBlur}
        onError={onError}
        readOnly={readOnly}
        inputMode={inputMode}
        pattern={pattern}
        placeholder=" " /* needed for floating label */
        autoComplete="off"
        aria-invalid={!!error}
        className={[
          "peer h-11 w-full rounded-md",
          "px-3",
          baseFill,
          "text-white placeholder-transparent",
          "border border-[#e3b8ff]/35",
          "outline-none transition-[border,box-shadow,background]",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
            : "focus:border-[#e3b8ff] focus:ring-2 focus:ring-[#e3b8ff]/60",
        ].join(" ")}
        {...inputProps}
      />

      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-3",
          "text-white/60 transition-all",
          // floating behavior
          "top-1/2 -translate-y-1/2",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
          "peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs",
          "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-0 peer-not-placeholder-shown:text-xs",
          error ? "text-red-300" : "",
        ].join(" ")}
      >
        {label}
      </label>
    </div>
  );
}
