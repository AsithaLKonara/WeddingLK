import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export interface AccessibleInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export interface AccessibleTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export interface AccessibleSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

// Accessible Input Component
export const AccessibleInput = forwardRef<
  HTMLInputElement,
  AccessibleInputProps
>(
  (
    {
      className,
      label,
      error,
      helperText,
      required = false,
      id,
      ariaDescribedBy,
      ariaInvalid,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const describedBy = [ariaDescribedBy, errorId, helperId]
      .filter(Boolean)
      .join(' ');

    return (
      <div className='space-y-2'>
        <label
          htmlFor={inputId}
          className='block text-sm font-medium text-foreground'
        >
          {label}
          {required && (
            <span className='text-destructive ml-1' aria-label='required'>
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalid || !!error}
          aria-required={required}
          {...props}
        />

        {helperText && (
          <p id={helperId} className='text-sm text-muted-foreground'>
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className='text-sm text-destructive' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Accessible Textarea Component
export const AccessibleTextarea = forwardRef<
  HTMLTextAreaElement,
  AccessibleTextareaProps
>(
  (
    {
      className,
      label,
      error,
      helperText,
      required = false,
      id,
      ariaDescribedBy,
      ariaInvalid,
      ...props
    },
    ref
  ) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    const describedBy = [ariaDescribedBy, errorId, helperId]
      .filter(Boolean)
      .join(' ');

    return (
      <div className='space-y-2'>
        <label
          htmlFor={textareaId}
          className='block text-sm font-medium text-foreground'
        >
          {label}
          {required && (
            <span className='text-destructive ml-1' aria-label='required'>
              *
            </span>
          )}
        </label>

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalid || !!error}
          aria-required={required}
          {...props}
        />

        {helperText && (
          <p id={helperId} className='text-sm text-muted-foreground'>
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className='text-sm text-destructive' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Accessible Select Component
export const AccessibleSelect = forwardRef<
  HTMLSelectElement,
  AccessibleSelectProps
>(
  (
    {
      className,
      label,
      options,
      error,
      helperText,
      required = false,
      placeholder,
      id,
      ariaDescribedBy,
      ariaInvalid,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    const describedBy = [ariaDescribedBy, errorId, helperId]
      .filter(Boolean)
      .join(' ');

    return (
      <div className='space-y-2'>
        <label
          htmlFor={selectId}
          className='block text-sm font-medium text-foreground'
        >
          {label}
          {required && (
            <span className='text-destructive ml-1' aria-label='required'>
              *
            </span>
          )}
        </label>

        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={ariaInvalid || !!error}
          aria-required={required}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}

          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {helperText && (
          <p id={helperId} className='text-sm text-muted-foreground'>
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} className='text-sm text-destructive' role='alert'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

// Accessible Fieldset Component
export interface AccessibleFieldsetProps {
  legend: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  error?: string;
}

export const AccessibleFieldset: React.FC<AccessibleFieldsetProps> = ({
  legend,
  children,
  className,
  required = false,
  error,
}) => {
  const fieldsetId = `fieldset-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${fieldsetId}-error` : undefined;

  return (
    <fieldset className={cn('space-y-4', className)}>
      <legend className='text-lg font-semibold text-foreground'>
        {legend}
        {required && (
          <span className='text-destructive ml-1' aria-label='required'>
            *
          </span>
        )}
      </legend>

      {children}

      {error && (
        <p id={errorId} className='text-sm text-destructive' role='alert'>
          {error}
        </p>
      )}
    </fieldset>
  );
};

// Accessible Checkbox Component
export interface AccessibleCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const AccessibleCheckbox = forwardRef<
  HTMLInputElement,
  AccessibleCheckboxProps
>(
  (
    { className, label, error, helperText, required = false, id, ...props },
    ref
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const helperId = helperText ? `${checkboxId}-helper` : undefined;

    const describedBy = [errorId, helperId].filter(Boolean).join(' ');

    return (
      <div className='flex items-start space-x-2'>
        <input
          ref={ref}
          id={checkboxId}
          type='checkbox'
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className
          )}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          aria-required={required}
          {...props}
        />

        <div className='space-y-1'>
          <label
            htmlFor={checkboxId}
            className='text-sm font-medium text-foreground'
          >
            {label}
            {required && (
              <span className='text-destructive ml-1' aria-label='required'>
                *
              </span>
            )}
          </label>

          {helperText && (
            <p id={helperId} className='text-sm text-muted-foreground'>
              {helperText}
            </p>
          )}

          {error && (
            <p id={errorId} className='text-sm text-destructive' role='alert'>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

// Accessible Radio Group Component
export interface AccessibleRadioGroupProps {
  name: string;
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const AccessibleRadioGroup: React.FC<AccessibleRadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required = false,
  className,
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${groupId}-error` : undefined;
  const helperId = helperText ? `${groupId}-helper` : undefined;

  const describedBy = [errorId, helperId].filter(Boolean).join(' ');

  return (
    <fieldset className={cn('space-y-3', className)}>
      <legend className='text-sm font-medium text-foreground'>
        {label}
        {required && (
          <span className='text-destructive ml-1' aria-label='required'>
            *
          </span>
        )}
      </legend>

      <div className='space-y-2'>
        {options.map(option => (
          <div key={option.value} className='flex items-center space-x-2'>
            <input
              id={`${groupId}-${option.value}`}
              name={name}
              type='radio'
              value={option.value}
              checked={value === option.value}
              onChange={e => onChange?.(e.target.value)}
              disabled={option.disabled}
              className='h-4 w-4 border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50'
              aria-describedby={describedBy || undefined}
            />

            <label
              htmlFor={`${groupId}-${option.value}`}
              className='text-sm text-foreground'
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {helperText && (
        <p id={helperId} className='text-sm text-muted-foreground'>
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className='text-sm text-destructive' role='alert'>
          {error}
        </p>
      )}
    </fieldset>
  );
};

AccessibleInput.displayName = 'AccessibleInput';
AccessibleTextarea.displayName = 'AccessibleTextarea';
AccessibleSelect.displayName = 'AccessibleSelect';
AccessibleCheckbox.displayName = 'AccessibleCheckbox';
