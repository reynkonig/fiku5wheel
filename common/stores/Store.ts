import WheelStore from './WheelStore';
import SessionStore from './SessionStore';
import SettingsStore from './SettingsStore';

export class Store {

  public wheel: WheelStore;
  public session: SessionStore;
  public settings: SettingsStore

  constructor() {
    this.wheel = new WheelStore(this);
    this.session = new SessionStore(this);
    this.settings = new SettingsStore(this);
  }
}

const store = new Store();

export default store;
