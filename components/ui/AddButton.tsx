import { ChangeEvent, useRef, useState } from 'react';
import { observer } from 'mobx-react';

import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import store from '../../common/stores/Store';

function AddButton() {
  const [ label, setLabel ] = useState<string>("");
  const [ active, setActive ] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null!);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  }

  const validLabel = label.length !== 0;

  const addLabel = () => {
    store.session.addItem(label);
    setLabel('');
    setActive(false);
  }

  const closeAndDiscardChanges = () => {
    setActive(false);
    setLabel("");
  }

  const switchActive = () => {
    setActive(prevState => !prevState);
    if(!active) {
      inputRef.current.focus();
    }
  }

  return (
    <div className="group z-20">
      <button
        className="bottom-btn bg-green-500"
        onClick={switchActive}
      >
        <FaPlus />
      </button>
      <div
        className={`flex absolute translate-y-2 border shadow bg-white p-2 rounded
        transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <input
          ref={inputRef}
          className="text-black px-2 py-2 w-full rounded-md outline-none text-xl w-72"
          placeholder="Текст..."
          value={label}
          onChange={handleInput}
          onKeyDown={(e) => {
            if(e.key === 'Enter') {
              addLabel();
            }
            if(e.key === 'Escape') {
              closeAndDiscardChanges();
            }
          }}
        />
        <button
          type="button"
          className="text-green-500 bg-transparent px-4 text-lg hover:enabled:scale-125 transition-all disabled:opacity-0"
          disabled={!validLabel}
          onClick={addLabel}
        >
          <FaCheck />
        </button>
        <div className="border-l-2"/>
        <button
          className="text-red-500 bg-transparent px-4 text-lg hover:scale-125 transition-all"
          onClick={closeAndDiscardChanges}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}

export default observer(AddButton);
