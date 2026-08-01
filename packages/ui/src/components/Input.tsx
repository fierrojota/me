import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import './input.css';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="input-field">
      <label className="input-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input className="input-field__control" id={inputId} {...rest} />
    </div>
  );
}
