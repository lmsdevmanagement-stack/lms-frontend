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
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
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
          className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-slate-400 ${
            icon ? 'pl-12' : 'pl-4'
          } ${showPasswordToggle ? 'pr-12' : 'pr-4'} disabled:opacity-50 disabled:cursor-not-allowed`}
          placeholder={placeholder}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
