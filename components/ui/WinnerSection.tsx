import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { getDisplayName } from './ListItem';

import { removeItemAtom, winnerAtom } from '../../atoms/ItemAtoms';

import { FaTrash } from 'react-icons/fa';

import Badges from './Badges';


export default function WinnerSection() {
  const winner = useAtomValue(winnerAtom);
  const removeItem = useSetAtom(removeItemAtom);

  const [ copied, setCopied ] = useState(false);

  if(winner === undefined) {
    return null;
  }

  const displayName = copied ? 'Скопировано' : getDisplayName(winner);

  const copyNickname = () => {
    navigator.clipboard.writeText(winner.label).then(() => {
      setCopied(true);
      setTimeout(() =>  setCopied(false), 500);
    })
  }

  return (
    <div className="panel-section">
      <div className="flex w-full rounded-md bg-violet-500 shadow">
        <div className="flex space-x-1 py-3 px-2 h-full w-32">
          <Badges item={winner} size={20} />
        </div>
        <span
          className="p-3 w-full truncate text-white cursor-pointer hover:animate-pulse select-none"
          onClick={copyNickname}
        >
          {displayName}
        </span>
        <button
          className="p-2 px-4 text-white hover:scale-110"
          onClick={() => removeItem(winner.label)}
        >
          <FaTrash/>
        </button>
      </div>
    </div>
  );
}
