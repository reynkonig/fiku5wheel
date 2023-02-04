import _ from 'lodash';
import { ratio } from 'fuzzball';
import { useState } from 'react';
import { observer } from 'mobx-react';

import store from '../../common/stores/Store';

import { IBadges, IListedItem } from '../../common/Interfaces';

import { FaTrash } from 'react-icons/fa';
import Badges from './Badges';



interface IListItemProps {
  item: IListedItem;
  badges: IBadges;
}

export function getDisplayName (item: IListedItem) {
  const { userstate } = item;
  const hasUserState = !_.isUndefined(userstate);
  if(hasUserState) {
    const hasNames = !_.isUndefined(userstate?.['display-name']) && !_.isUndefined(userstate?.username);
    if(hasNames) {
      if(ratio(userstate['display-name'] as string, userstate.username) < 0.6) {
        return `${userstate?.['display-name']} (${userstate.username})`;
      }
    }
  }

  return item.label;
}

function ListItem({ item, badges } : IListItemProps) {
  const [ copied, setCopied ] = useState(false);

  const copyLabel = async () => {
    await navigator.clipboard.writeText(item.label);
    setCopied(true);
    setTimeout(() => setCopied(false), 750);
  }

  const spanColor = copied ? 'white' : item.userstate?.color;

  return (
    <div
      key={item.label}
      className={`group text-xs px-2 cursor-pointer transition-colors border-black
      transition-all duration-100 py-1 hover:py-2
      ${copied 
        ? 'text-white bg-violet-500 border-violet-500' 
        : `border-black even:bg-white odd:bg-gray-200`
      }`}
    >
      <div
        className="flex w-full transition-all"
        onClick={copyLabel}
      >
        <div className="flex w-24 space-x-0.5">
          <Badges {...{ item, badges, size: 18 }}/>
        </div>
        <div
          className={`flex w-52 select-none pt-0.5 transition-transform`}
          style={{color: spanColor}}
        >
          <span className="truncate group-hover:underline">
            {copied ? 'Скопировано' : getDisplayName(item)}
          </span>
        </div>
        <div className="flex w-fit ml-auto">
          <button
            className={`hover:scale-125 transition-all rounded-md ${copied ? 'text-white' : 'text-red-500'}`}
            onClick={() => store.session.removeItem(item.label)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default observer(ListItem);
