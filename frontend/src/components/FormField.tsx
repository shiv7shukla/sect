import React from 'react';
import type { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  touched: boolean;
}

function FormField<T extends FieldValues>({ 
  name, label, type, placeholder, register, errors, touched 
}: FormFieldProps<T>) {
  const error = errors[name];
  
  return (
    <div className='flex flex-col gap-2 m-2'>
      <label className='block'>{label}</label>
      <input 
        className='p-3 bg-zinc-950 rounded-sm' 
        placeholder={placeholder} 
        type={type} 
        {...register(name)} 
      />
      {touched && error && (
        <p className="text-red-500">{String(error.message)}</p>
      )}
    </div>
  );
}

export default FormField;