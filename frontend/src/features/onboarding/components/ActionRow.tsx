"use client";

import type { ReactNode } from "react";

interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: "filled" | "outline" | "link";
  icon?: ReactNode;
  disabled?: boolean;
}

interface ActionRowProps {
  primary: ActionButton;
  secondary?: ActionButton;
  align?: "center" | "space-between";
}

function buttonClasses(variant: ActionButton["variant"] = "filled") {
  switch (variant) {
    case "outline":
      return "border border-charcoal/20 text-charcoal hover:bg-charcoal/5";
    case "link":
      return "text-charcoal/60 hover:text-charcoal underline-offset-4 hover:underline";
    case "filled":
    default:
      return "bg-terracotta text-cream hover:bg-terracotta-dark";
  }
}

function Button({ label, onClick, variant = "filled", icon, disabled }: ActionButton) {
  const isPill = variant !== "link";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        isPill ? "rounded-full px-8 py-3 text-sm font-medium" : "text-sm"
      } ${buttonClasses(variant)}`}
    >
      {label}
      {icon}
    </button>
  );
}

export function ActionRow({ primary, secondary, align = "center" }: ActionRowProps) {
  if (!secondary) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Button {...primary} />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center gap-4 ${
        align === "space-between" ? "sm:flex-row sm:justify-between" : "sm:flex-row sm:justify-center"
      }`}
    >
      <Button {...secondary} />
      <Button {...primary} />
    </div>
  );
}
