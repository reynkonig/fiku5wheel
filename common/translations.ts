import _ from 'lodash';

const translations: Record<string, string> = {
  sectorA: 'Цвет А',
  sectorB: 'Цвет B',
  sectorC: 'Цвет C',
  outline: 'Обводка'
}

export const translate = (val: string) => {
  return _.get(translations, val) ?? val;
}
