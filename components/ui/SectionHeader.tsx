import type { ReactNode } from "react";

type SectionHeaderProps = {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  center?: boolean;
};

export function SectionHeader({ kicker, title, children, center }: SectionHeaderProps) {
  return (
    <div className={`sec-head${center ? " center" : ""} rv`}>
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
