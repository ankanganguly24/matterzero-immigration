import type { SelectHTMLAttributes } from "react";
import styles from "./select-control.module.css";

type SelectControlProps = SelectHTMLAttributes<HTMLSelectElement> & {
  density?: "compact" | "comfortable" | "spacious";
};

export function SelectControl({
  className = "",
  density = "comfortable",
  ...props
}: SelectControlProps) {
  return (
    <select
      {...props}
      className={`${styles.select} ${styles[density]} ${className}`.trim()}
    />
  );
}
