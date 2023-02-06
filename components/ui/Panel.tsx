import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { maxItemsCountAtom } from '../../atoms/SettingsAtoms';
import { clearItemsAtom, itemsAtom, winnerAtom } from '../../atoms/ItemAtoms';
import {
  chatMembersCanJoinAtom,
  joinMessageAtom
} from '../../atoms/SessionAtoms';


import ListItem from './ListItem';
import AddButton from './AddButton';

import WinnerSection from './WinnerSection';

import {
  FaLock,
  FaEraser,
  FaLockOpen,
} from 'react-icons/fa';

export default function Panel() {
  const maxItemsCount = useAtomValue(maxItemsCountAtom);

  const clearItems = useSetAtom(clearItemsAtom);

  const items = useAtomValue(itemsAtom);
  const winner = useAtomValue(winnerAtom);
  const [ chatMembersCanJoin, setCanJoin ] = useAtom(chatMembersCanJoinAtom);
  const [ joinMessage , setJoinMessage ] = useAtom(joinMessageAtom);


  return (
    <div
      className="fixed flex w-96 p-4 z-10"
      style={{
        height: "calc(100vh - 2.25rem)"
      }}
    >
      <div className='panel-container flex-col py-2 px-2 space-y-2 shadow bg-white bg-opacity-25 rounded-lg'>
        <div className="panel-section">
          <input
            disabled={chatMembersCanJoin}
            className="rounded-md w-full outline-none px-2 pt-px bg-opacity-40"
            placeholder="Слово для участия"
            onChange={(e) => {
              setJoinMessage(e.target.value);
            }}
            value={joinMessage}
          />
          <button
            className={`text-white px-4 rounded-md text-xs aspect-square hovered-anim ${!chatMembersCanJoin ? 'bg-green-500' : 'bg-red-500'}`}
            onClick={() => setCanJoin(prev => !prev)}
          >
            { chatMembersCanJoin
              ? <FaLockOpen className="scale-125" />
              : <FaLock className="scale-125" />
            }
          </button>
        </div>
        <div className="panel-section bg-white pt-2 rounded-md flex justify-end px-2 pb-2 shadow">
              <div className="flex w-full rounded-md bg-gray-300 text-white justify-center items-center pt-px overflow-hidden">
                <span className="absolute w-auto flex">
                  {items.length}&nbsp;/&nbsp;{maxItemsCount}
                </span>
                <div className="flex h-full bg-violet-500 mr-auto transition-all duration-75" style={{ width: `${Math.round(items.length / maxItemsCount * 100)}%` }}/>
              </div>
          <AddButton />
          <button
            className="bottom-btn bg-red-500"
            onClick={() => clearItems()}
            disabled={items.length === 0}
          >
            <FaEraser />
          </button>
        </div>
        { winner && (<WinnerSection />) }
        <div className="rounded-md shadow bg-white overflow-y-auto overflow-x-hidden rounded-md">
          {items.filter((item) => item !== winner).map(
            (item) => (
              <ListItem
                key={item.label}
                item={item}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
