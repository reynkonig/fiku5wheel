import Image from 'next/image';
import { useState } from 'react';
import { observer } from 'mobx-react';

import store from '../../common/stores/Store';


export interface IFilterButtonProps {
  name: string;
}

function FilterButton({ name } : IFilterButtonProps) {
  const [ enabled, setEnabled ] = useState(false);

  const badgeSRC = store.content.getBadgeSRC(name, '')

  return (
    <button
      className={`hover:scale-125 transition-all ${enabled ? `grayscale-0` : `grayscale`}`}
      onClick={() => setEnabled(state => !state)}
    >
      <Image src={badgeSRC} width={20} height={20} alt={name} />
    </button>
  );
}


export default observer(FilterButton);
