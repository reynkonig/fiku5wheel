import { useState } from 'react';
import { observer } from 'mobx-react';
import { FaTrash } from 'react-icons/fa';

import { getDisplayName } from './ListItem';

import Badges from './Badges';
import store from '../../common/stores/Store';


function WinnerSection() {
  const { winner } = store.session;
  const { badges } = store.content;

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
        <div className="flex space-x-1 py-3 px-2 h-full w-20">
          <Badges item={winner} badges={badges} size={20} />
        </div>
        <span
          className="p-3 w-full text-white cursor-pointer hover:animate-pulse select-none"
          onClick={copyNickname}
        >
          {displayName}
        </span>
        <button
          className="p-2 px-4 text-white hover:scale-110"
          onClick={() => store.session.removeItem(winner.label)}
        >
          <FaTrash/>
        </button>
      </div>
    </div>
  );
}

export default observer(WinnerSection);
