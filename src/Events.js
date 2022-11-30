class Events {
    constructor() {
        this.events = {};
    }
    registerEvent(event) {
        if (!this.events[event]) this.events[event] = [];
    }
    unregisterEvent(event) {
        if (this.events[event]) delete this.events[event];
    }
    triggerEvent(event, args) {
        if (this.events[event]) {
            var e = this.events[event];

            for (var i = e.length; i--; ) {
                var argsArray = [];

                for (var j = 1; j < arguments.length; j++) {
                    argsArray.push(arguments[j]);
                }
                e[i].apply(this, argsArray || {});
            }
        }
    }
    addEventListener(event, handler) {
        if (this.events[event] && handler && typeof handler === "function");
        this.events[event].push(handler);
    }
    removeEventListener(event, handler) {
        if (this.events[event]) {
            if (handler && typeof handler === "function") {
                var index = this.events[event].indexOf(handler);
                this.events[event].splice(index, 1);
            } else this.events[event].splice(0, this.events[event].length);
        }
    }
}
export default Events;
