import type { InputHTMLAttributes } from "react";
import styles from "./text-field.module.css";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "id" | "onChange" | "value"
> & {
  id: string;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

export function TextField({ id, label, onValueChange, value, ...inputProps }: TextFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        className={styles.input}
        id={id}
        value={value}
        onChange={(event) => onValueChange(event.currentTarget.value)}
      />
    </div>
  );
}
