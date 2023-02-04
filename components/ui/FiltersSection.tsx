import { observer } from 'mobx-react';
import FilterButton from './FilterButton';

function FiltersSection() {

  return (
    <div className="panel-section bg-white rounded-md h-10 space-x-2 px-2">
      <FilterButton name="vip" />
      <FilterButton name="moderator" />
      <FilterButton name="subscriber" />
    </div>
  )
}


export default observer(FiltersSection);
