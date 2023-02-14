import _ from 'lodash';

import { useAtom } from 'jotai';

import { IWheelColorPalette } from '../../../common/interfaces';
import { translate } from '../../../common/translations';

import { paletteAtom } from '../../../atoms/SettingsAtoms';

import SettingsSection from './SettingsSection';

export default function ColorSettings() {
  const [ colors, setColors ] = useAtom(paletteAtom);

  const colorNames = _.keys(colors) as Array<keyof IWheelColorPalette>;
  const colCount = 2;
  const rowsCount = _.ceil(colorNames.length / colCount);

  return (
    <SettingsSection name="Цвета">
      { _.map(_.range(0, rowsCount), (y) => {
        const curRowColCount =
          (y + 1) === rowsCount ? colCount - (rowsCount * colCount - colorNames.length) : colCount
        ;
        return (
          <div key={y} className="flex py-2 px-2 w-full space-x-4">
            {
              _.map(_.range(0, curRowColCount), (x) => {
                const i = y * colCount + x;
                const color = colors[colorNames[i]];
                return (
                  <div key={x} className="flex w-full h-full rounded-r-md bg-white border-l-2 border-black">
                      <span className="flex w-full text-xs m-auto px-3 pt-px select-none">
                          {translate(colorNames[i])}
                      </span>
                    <div className="flex w-full rounded-r-md overflow-hidden border-l-2 border-black">
                      <input
                        className="flex w-full cursor-pointer outline-none"
                        type="color"
                        value={color}
                        onChange={(event) => {
                          setColors((prev) => (
                            _.set(_.cloneDeep(prev), colorNames[i], event.target.value)
                          ))
                        }}
                      />
                    </div>
                  </div>
                );
              })
            }
          </div>
        );
      })}
    </SettingsSection>
  );
}
