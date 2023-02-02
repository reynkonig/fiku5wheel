import axios from 'axios';
import useSWR from 'swr';
import { observer } from 'mobx-react';

import store from '../../common/stores/Store';

import {
  FaLock,
  FaEraser,
  FaTwitch,
  FaLockOpen,
} from 'react-icons/fa';

import ListItem from './ListItem';
import AddButton from './AddButton';

import { useEffect } from 'react';
import { IBadgesImageSets } from '../../common/Interfaces';


const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function Panel() {
  const { channel, maxLabelsCount } = store.settings;
  const { ready, labeledItems, joinMessage } = store.session;

  useEffect(() => {
    if(channel && !ready) {
      store.session.joinChannel(channel).then();
    }
  }, [ channel, ready ])

  const { data } = useSWR<IBadgesImageSets>(`/api/badges/${channel}`, fetcher);

  return (
    <div className="absolute">
      <div className={`absolute z-10 bg-violet-500 h-16 rounded-md m-4 text-white flex transition-all
      duration-1000
       ${ ready ? 'w-0' : 'w-96'}`}
      >
        <div className="p-2 flex w-full h-full justify-center">
          <FaTwitch className="animate-ping mt-4" />
        </div>
      </div>
      <div className={`fixed w-96 h-screen pl-4 py-5 z-10 transition-all delay-1000 duration-500
      ${ready ? '' : '-translate-x-96'}`}
      >
        <div className="rounded-xl w-full h-full py-2 px-2 space-y-2 flex flex-col shadow bg-white bg-opacity-25">
          <div className="panel-section">
            <input
              disabled={store.session.open}
              className="rounded-md w-full outline-none px-2 pt-px bg-opacity-40"
              placeholder="Слово для участия"
              onChange={(e) => {
                store.session.setJoinMessage(e.target.value);
              }}
              value={joinMessage}
            />
            <button
              className={`text-white px-4 rounded-md text-xs aspect-square hovered-anim
              ${!store.session.open ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={() => store.session.switchOpen()}
            >
              { store.session.open
                ? <FaLockOpen className="scale-125" />
                : <FaLock className="scale-125" />
              }
            </button>
          </div>
          <div
            className="panel-section bg-white pt-2 rounded-md flex justify-end px-2 pb-2 shadow"
          >
            <span className="flex w-full rounded-md bg-violet-500 text-white justify-center items-center pt-px">
                {labeledItems.length}&nbsp;/&nbsp;{maxLabelsCount}
              </span>
            <AddButton />
            <button
              className="bottom-btn bg-red-500"
              onClick={() => store.session.clearLabels()}
              disabled={store.session.labeledItems.length === 0}
            >
              <FaEraser />
            </button>
          </div>
          <div className="overflow-y-auto overflow-x-hidden rounded-md shadow">
            {labeledItems.map(
              (item) => (
                <ListItem
                  key={item.label}
                  item={item}
                  badges={data as IBadgesImageSets}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(Panel);
