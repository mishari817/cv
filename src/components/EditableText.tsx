import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  as?: React.ElementType;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  multiline = false,
  className,
  placeholder = 'Click to edit',
  as: Component = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: localValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalValue(e.target.value);
        if (multiline && e.target instanceof HTMLTextAreaElement) {
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }
      },
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: cn(
        'bg-blue-50 border-b-2 border-blue-500 outline-none w-full text-inherit font-inherit p-0 m-0 print:hidden',
        className
      ),
    };

    return multiline ? (
      <textarea {...commonProps} className={cn(commonProps.className, 'resize-none overflow-hidden')} rows={1} />
    ) : (
      <input type="text" {...commonProps} />
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={cn(
        'cursor-text hover:bg-gray-100/50 rounded px-1 -mx-1 transition-colors border border-transparent hover:border-gray-200 print:hover:bg-transparent print:hover:border-transparent print:px-0 print:mx-0',
        !value && 'text-gray-400 italic print:hidden',
        className
      )}
    >
      {value || placeholder}
    </Component>
  );
};
