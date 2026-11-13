import React from 'react';
import { Check } from 'lucide-react';

interface NocturneCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  id?: string;
}

export const NocturneCheckbox: React.FC<NocturneCheckboxProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  id,
}) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className="group flex items-start gap-3 min-h-[44px] py-2 px-2.5 -mx-2.5 rounded-lg cursor-pointer hover:bg-[#0B2438]/80 transition-colors duration-150 select-none"
    >
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-all duration-150 ${
            checked
              ? 'bg-[#167D8D] border-2 border-[#167D8D] ring-[3px] ring-[#167D8D]/20'
              : 'bg-transparent border-2 border-[#167D8D]/50 group-hover:border-[#167D8D]'
          } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#B9E4E8]`}
        >
          {checked && <Check className="w-3.5 h-3.5 text-[#EEEEEE]" strokeWidth={3} />}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={`block text-[13.5px] leading-[19px] transition-colors ${
            checked ? 'text-[#EEEEEE]/50 line-through' : 'text-[#EEEEEE]'
          }`}
        >
          {label}
        </span>
        {sublabel && (
          <span className="block text-[11px] tabular-mono text-[#EEEEEE]/45 mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </label>
  );
};

interface NocturneRadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}

export const NocturneRadio: React.FC<NocturneRadioProps> = ({
  name,
  value,
  checked,
  onChange,
  label,
  description,
}) => {
  const id = React.useId();

  return (
    <label
      htmlFor={id}
      className="group flex items-start gap-3 min-h-[44px] py-2 px-2.5 -mx-2.5 rounded-lg cursor-pointer hover:bg-[#0B2438]/80 transition-colors duration-150 select-none"
    >
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 ${
            checked
              ? 'bg-[#167D8D] border-2 border-[#167D8D] ring-[3px] ring-[#167D8D]/20'
              : 'bg-transparent border-2 border-[#167D8D]/50 group-hover:border-[#167D8D]'
          } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#B9E4E8]`}
        >
          {checked && <span className="w-2 h-2 rounded-full bg-[#EEEEEE]" />}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-[13.5px] font-medium leading-[19px] text-[#EEEEEE]">
          {label}
        </span>
        {description && (
          <span className="block text-[12px] leading-[16px] text-[#EEEEEE]/55 mt-0.5">
            {description}
          </span>
        )}
      </div>
    </label>
  );
};
