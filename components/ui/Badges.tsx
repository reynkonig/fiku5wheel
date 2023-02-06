import Image from 'next/image';
import {  useAtomValue } from 'jotai';

import { IListedItem } from '../../common/Interfaces';

import { badgesAtom } from '../../atoms/ContentAtoms';

export interface IItemBadgesProps {
  item: IListedItem;
  size: number;
}

export default function Badges({ item, size }: IItemBadgesProps) {
  const badges = useAtomValue(badgesAtom);

  const getBadgeSource = (channel: string, name: string, versionId?: string) => {
    const orderedSets = [ badges?.[channel] ?? [], badges.global ];
    for (const orderedSet of orderedSets) {
      const matchSet = orderedSet.find((set) => set.set_id === name);
      if (matchSet) {
        if (versionId) {
          const version = matchSet.versions.find((version) => version.id === versionId);

          if (version) {
            return version.image_url_4x;
          }
        } else {
          return matchSet.versions?.[0]?.image_url_4x ?? "";
        }
      }
    }

    return "";
  }

  return (
    <>{item.userstate ? (
      Object.entries(item.userstate.badges ?? {}).map(([ name, payload ]) => {
        return (
          <Image
            key={name}
            className="p-0.5 aspect-square h-5 w-5"
            src={getBadgeSource(item.channel as string, name, payload)}
            alt={name}
            width={size}
            height={size}
          />
        );
      })
     ) : (
       <span
         key="custom"
         className="bg-black text-white px-2 rounded-xl select-none"
         style={{ fontSize: '0.5rem', lineHeight: "1.2rem"}}
       >
        custom
      </span>
     )}
    </>
  );
}
