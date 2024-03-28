type Listeners<T> = {
  [P in keyof T]: ((praram: T[P]) => void)[];
};

type Listener<E> = (param: E) => void;

class EventListenersManager<ListEvents> {
  listeners: Listeners<ListEvents>;

  constructor(events: ListEvents) {
    this.listeners = {} as Listeners<ListEvents>;
    for (const event in events) {
      this.listeners[event] = [];
    }
  }

  protected callListeners<K extends keyof ListEvents>(
    event: K,
    params: ListEvents[K]
  ) {
    this.listeners[event].map((listener) => listener(params));
  }

  addListener<K extends keyof ListEvents>(
    event: K,
    listener: Listener<ListEvents[K]>
  ) {
    if (this.listeners[event]) {
      this.listeners[event].push(listener);

      return () => {
        this.removeListener(event, listener);
      };
    } else {
      throw new Error(`${this} is doesn't have event "${event}"`);
    }
  }

  removeListener<K extends keyof ListEvents>(
    event: K,
    listener: Listener<ListEvents[K]>
  ) {
    if (this.listeners[event]) {
      const index = this.listeners[event].findIndex((ltn) => ltn === listener);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    } else {
      throw new Error(`${this} is doesn't have event "${event}"`);
    }
  }
}

export default EventListenersManager;
