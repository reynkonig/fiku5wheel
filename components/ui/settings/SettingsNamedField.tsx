import React, { ReactNode } from 'react';

interface  ISettingsNamedField {
  name: string;
  children: ReactNode;
}

export default function SettingsNamedField({ name, children }: ISettingsNamedField) {
  return (
    <div className="flex w-full text-xs border-l-2 border-black pl-3 select-none">
      <span
        className="flex w-full my-auto pr-3"
      >
        {name}
      </span>
      <div className="flex w-fit">
        {children}
      </div>
    </div>
  )
}
