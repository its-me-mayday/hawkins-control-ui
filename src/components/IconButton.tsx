type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string };

export default function IconButton({ label, className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        "inline-flex items-center justify-center",
        "rounded-full border px-0 py-0",
        "border-[rgba(255,17,51,0.6)] text-(--hawkins-ink)",
        "transition-all duration-150",
        "shadow-[0_0_18px_rgba(255,17,51,0.25)]",
        "hover:shadow-[0_0_28px_rgba(255,17,51,0.45)]",
        "hover:bg-(--hawkins-red) hover:text-[#07080c]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,17,51,.6)]",
        className || "",
      ].join(" ")}
      {...rest}
    />
  );
}
