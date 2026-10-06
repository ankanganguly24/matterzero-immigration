import type { HTMLAttributes, ReactNode } from "react";

export function Container({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <div className={`container ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
