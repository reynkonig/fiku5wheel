import { useState } from 'react';
import { observer } from 'mobx-react';

import store from '../../common/stores/Store';

import { FaTrash } from 'react-icons/fa';

import { IBadgesImageSets, ILabeledItem } from '../../common/Interfaces';


interface IListItemProps {
  item: ILabeledItem;
  badges: IBadgesImageSets;
}

function ListItem({ item, badges } : IListItemProps) {
  const [ copied, setCopied ] = useState(false);

  const copyLabel = async () => {
    await navigator.clipboard.writeText(item.label);
    setCopied(true);
    setTimeout(() => setCopied(false), 750);
  }

  const getBadgeSRC = (name: string, payload?: string): string => {
    const sources = [ badges.local, badges.global ];

    for(const source of sources) {
      const matchSet = source.find((set) => set.set_id === name);
      if(matchSet) {
        if(payload) {
          const version = matchSet.versions.find((version) => version.id === payload);

          if(version) {
            return version.image_url_1x;
          }
        }
        else {
          return matchSet.versions?.[0]?.image_url_2x ?? "";
        }
      }
    }

    return "";
  }

  const spanColor = copied ? 'white' : item.userstate?.color;

  return (
    <div
      key={item.label}
      className={`group text-xs px-2 py-1 cursor-pointer transition-transform border-black hover:py-2
      ${copied 
        ? 'text-white bg-violet-500 border-violet-500' 
        : 'border-black even:bg-white odd:bg-gray-200'
      }`}
    >
      <div
        className="flex w-full transition-all"
        onClick={copyLabel}
      >
        <div className="flex w-24 space-x-0.5">
          {item.userstate
            ? Object.entries(item.userstate.badges ?? {}).map(([name, payload]) => {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="p-0.5 aspect-square h-5"
                  key={name}
                  src={getBadgeSRC(name, payload as string)}
                  alt={name}
                />
              );
            })
            : null
          }
        </div>
        <span
          className="flex w-full select-none pt-0.5 transition-transform group-hover:underline"
          style={{color: spanColor}}
        >
          {copied ? 'Скопировано' : item.label}
        </span>
        <button
          className={`hover:scale-125 transition-all rounded-md ${copied ? 'text-white' : 'text-red-500'}`}
          onClick={() => store.session.removeLabel(item.label)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default observer(ListItem);
