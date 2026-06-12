import Link from "next/link";
import type { ComponentProps } from "react";

type GradientButtonProps = ComponentProps<typeof Link>;

export function GradientButton({ className, ...props }: GradientButtonProps) {
  return <Link {...props} className={["btn btn-grad", className].filter(Boolean).join(" ")} />;
}
