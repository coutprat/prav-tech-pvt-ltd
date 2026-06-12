import type { HTMLAttributes } from "react";

export function AnimatedCard(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={["card rv", props.className].filter(Boolean).join(" ")} />;
}
