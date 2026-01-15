import { useState } from "react";
export default function Button({
  children,
  whiteText,
  centered,
  classes,
  onClick,
  blackText,
  greener,
  red,
  yellow,
  transparent,
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    if (onClick) onClick();
  };
  return (
    <button
      onClick={handleClick}
      className={` ${
        transparent
          ? "bg-root-green-8"
          : greener
          ? "bg-[#3AD17F]"
          : red
          ? "bg-root-red-8 text-root-red"
          : yellow
          ? "bg-root-yellow-8 text-root-yellow"
          : "bg-root-green"
      } ${classes} transform flex flex-col items-center justify-center ${
        isPressed ? "scale-[97%]" : "hover:scale-[103%]"
      }
        active:shadow-inner
        hover:shadow-md ${
          centered ? "self-center" : "self-start"
        } rounded-xl px-6 py-3 transition-all duration-150 ${
        transparent
          ? "text-root-green"
          : whiteText
          ? "text-white"
          : blackText
          ? "text-[#262626]"
          : "text-bkg"
      } font-semibold text-sm`}
    >
      {children}
    </button>
  );
}
