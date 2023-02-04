import { observer } from 'mobx-react';
import Image from 'next/image';

import { IListedItem } from '../../common/Interfaces';


import store from '../../common/stores/Store';

export interface IItemBadgesProps {
  item: IListedItem;
  size: number;
}


function Badges({ item, size }: IItemBadgesProps) {
  return (
    <>{item.userstate ? (
      Object.entries(item.userstate.badges ?? {}).map(([ name, payload ]) => {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <Image
            key={name}
            className="p-0.5 aspect-square h-5 w-5"
            src={store.content.getBadgeSRC(name, payload)}
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


export default observer(Badges);
