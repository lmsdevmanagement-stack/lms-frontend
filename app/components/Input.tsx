import React from 'react';
import { Lock, Mail, User, Building, MapPin, Eye, EyeOff, LucideIcon } from 'lucide-react';

type IconType = 'email' | 'password' | 'user' | 'building' | 'mapPin';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  icon?: IconType | React.ComponentType<{ className?: string }>;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
}

const iconMap: Record<IconType, LucideIcon> = {
  email: Mail,
  password: Lock,
  user: User,
  building: Building,
  mapPin: MapPin,
};

const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  icon,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  disabled = false,
}) => {
  const renderIcon = () => {
    if (!icon) return null;
    
    const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;
    
    if (IconComponent) {
      return (
        <IconComponent className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
      );
    }
    return null;
  };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {renderIcon()}
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : type}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 ${
            icon ? 'pl-12' : 'pl-4'
          } ${showPasswordToggle ? 'pr-12' : 'pr-4'} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500`}
          placeholder={placeholder}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
