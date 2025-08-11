export default function Input({
  label,
  readOnly,
  onFocus,
  onInput,
  value,
  onChange,
  onError,
  className,
  onBlur,
  pattern,
  type,
  inputMode,
  inputProps = {},
  whiteBg,
}) {
  return (
    <div
      className={`${className} floating-label text-bl w-full h-[56px] flex flex-col items-end justify-end  rounded-xl `}
    >
      <input
        type={type ? type : "text"}
        className="w-full  px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#e3b8ff]/50 focus:ring-1 focus:ring-[#e3b8ff]/20 focus:bg-white/10 transition"
        id="input"
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        autoComplete="off"
        pattern={pattern}
        onInput={onInput}
        readOnly={readOnly}
        inputMode={inputMode}
        onError={onError}
        onBlur={onBlur}
        placeholder=" "
        {...inputProps} // Spread inputProps to pass additional attributes
      />
      <label htmlFor="input" className="text-gr font-medium">
        {label}
      </label>
    </div>
  );
}
