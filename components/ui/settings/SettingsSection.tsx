import React, { ReactNode } from 'react';


interface ISettingsSectionProps {
  name: string;
  children: ReactNode;
}

export default function SettingsSection({ name, children }: ISettingsSectionProps) {
  return (
    <div
      className="w-full rounded-md p-2 space-y-2 bg-white"
    >
      <label
        className="absolute flex w-24 text-white justify-center -mt-6 ml-2
        pb-1 pt-1.5 rounded-lg select-none font-bold bg-black font-bold text-sm"
      >
        { name }
      </label>
      <div className="content pt-2 pb-3 px-2.5 space-y-2">
        { children }
      </div>
    </div>
  );
}
