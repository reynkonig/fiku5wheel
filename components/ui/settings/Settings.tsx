import _ from 'lodash';
import { useAtom, useSetAtom } from 'jotai';

import { useEffect, useState } from 'react';

import {
  defaultChannelsAtom,
  maxItemsCountAtom,
} from '../../../atoms/SettingsAtoms';
import { twitchClientMachineAtom } from '../../../atoms/TwitchClientAtoms';

import SettingsSection from './SettingsSection';

import { FaPlus, FaTrash } from 'react-icons/fa';
import ColorSettings from './ColorSettings';
import SettingsNamedField from './SettingsNamedField';

export default function Settings() {
  const [ twitchClient, send ] = useAtom(twitchClientMachineAtom);
  const [ newChannel, setNewChannel ] = useState('')
  const [ maxItemsCount, setMaxItemsCount ] = useAtom(maxItemsCountAtom);

  const setDefaultChannels = useSetAtom(defaultChannelsAtom);



  useEffect(() => {
    setDefaultChannels(twitchClient.context.channels);
  }, [ twitchClient, setDefaultChannels ]);

  const addNewChannel = () => {
    if(newChannel.length) {
      send({ type: 'JOIN', value: newChannel })
      setNewChannel('');
    }
  }

  return (
    <div className="w-full h-full rounded-md py-4 pt-6 space-y-8">
      <SettingsSection name="Общие">
        <SettingsNamedField name="Макс.&nbsp;количество&nbsp;участников">
          <input
            className="flex w-full pl-6 pr-2 pb-0.5 pt-1 text-center border-2 border-black rounded-md outline-none text-sm"
            type="number"
            value={maxItemsCount}
            onChange={(event) => setMaxItemsCount(
              _.clamp(
                event.target.valueAsNumber ?
                  event.target.valueAsNumber: 1,
                1,
                512
              )
            )}
          />
        </SettingsNamedField>
        <SettingsNamedField name="Каналы">
          <div className="flex w-full flex-col space-y-1.5 text-sm">
            {twitchClient.context.channels.map((channel) => {
              const pending = twitchClient.context.pendingChannel === channel;
              return (
                <div
                  key={channel}
                  className="flex bg-black text-white pt-1 pb-0.5 px-2 rounded-md select-none"
                >
                <span
                  className="truncate">
                  {channel}
                </span>
                  <button
                    className="hover:scale-125 pb-1 pr-0.5 ml-auto text-xs"
                    onClick={() => send({ type: 'PART', value: channel })}
                    hidden={pending}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
            <div className="flex border-2 border-black px-2 rounded-md">
              <input
                className="flex w-56 pt-1 pb-0.5 px-1 outline-none"
                placeholder="Название канала"
                value={newChannel}
                onChange={(event) => setNewChannel(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && (addNewChannel())}
              />
              <button
                className="group hover:scale-125"
                onClick={addNewChannel}
                disabled={!newChannel.length}
              >
                <FaPlus className="group-disabled:opacity-0"/>
              </button>
            </div>
          </div>
        </SettingsNamedField>
      </SettingsSection>
      <ColorSettings />
    </div>
  )
}
