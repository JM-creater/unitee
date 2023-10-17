type Listener = (...args: unknown[]) => void;

class EventEmitter {
    private events: Record<string, Listener[]>;

    constructor() {
        this.events = {};
    }

    on(event: string, listener: Listener): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, ...args: unknown[]): void {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }

    off(event: string, listener: Listener): void {
        if (this.events[event]) {
            const idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
}

const notifEventEmitter = new EventEmitter();

export default notifEventEmitter;
