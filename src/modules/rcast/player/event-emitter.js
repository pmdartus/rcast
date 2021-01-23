/**
 * Code from:
 * https://github.com/insane-jo/event-emitter
 */

const DEFAULT_VALUES = {
    emitDelay: 10,
    strictMode: false,
};

/**
 * @typedef {object} EventEmitterListenerFunc
 * @property {boolean} once
 * @property {function} fn
 */

/**
 * @class EventEmitter
 *
 * @private
 * @property {Object.<string, EventEmitterListenerFunc[]>} _listeners
 * @property {string[]} events
 */
export default class EventEmitter {
    /**
     * @constructor
     * @param {{}}      [opts]
     * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
     * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
     */
    constructor(opts = DEFAULT_VALUES) {
        let emitDelay, strictMode;

        if ('emitDelay' in opts) {
            emitDelay = opts.emitDelay;
        } else {
            emitDelay = DEFAULT_VALUES.emitDelay;
        }
        this._emitDelay = emitDelay;

        if ('strictMode' in opts) {
            strictMode = opts.strictMode;
        } else {
            strictMode = DEFAULT_VALUES.strictMode;
        }
        this._strictMode = strictMode;

        this._listeners = {};
        this.events = [];
    }

    /**
     * @protected
     * @param {string} type
     * @param {function} listener
     * @param {boolean} [once = false]
     */
    _addListenner(type, listener, once) {
        if (typeof listener !== 'function') {
            throw TypeError('listener must be a function');
        }

        if (this.events.indexOf(type) === -1) {
            this._listeners[type] = [
                {
                    once: once,
                    fn: listener,
                },
            ];
            this.events.push(type);
        } else {
            this._listeners[type].push({
                once: once,
                fn: listener,
            });
        }
    }

    /**
     * Subscribes on event type specified function
     * @param {string} type
     * @param {function} listener
     */
    on(type, listener) {
        this._addListenner(type, listener, false);
    }

    /**
     * Subscribes on event type specified function to fire only once
     * @param {string} type
     * @param {function} listener
     */
    once(type, listener) {
        this._addListenner(type, listener, true);
    }

    /**
     * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
     * @param {string} eventType
     * @param {function} [listenerFunc]
     */
    off(eventType, listenerFunc) {
        let typeIndex = this.events.indexOf(eventType);
        let hasType = eventType && typeIndex !== -1;

        if (hasType) {
            if (!listenerFunc) {
                delete this._listeners[eventType];
                this.events.splice(typeIndex, 1);
            } else {
                let removedEvents = [];
                let typeListeners = this._listeners[eventType];

                typeListeners.forEach(
                    /**
                     * @param {EventEmitterListenerFunc} fn
                     * @param {number} idx
                     */
                    function (fn, idx) {
                        if (fn.fn === listenerFunc) {
                            removedEvents.unshift(idx);
                        }
                    },
                );

                removedEvents.forEach(function (idx) {
                    typeListeners.splice(idx, 1);
                });

                if (!typeListeners.length) {
                    this.events.splice(typeIndex, 1);
                    delete this._listeners[eventType];
                }
            }
        }
    }

    /**
     * Applies arguments to specified event type
     * @param {string} eventType
     * @param {*[]} eventArguments
     * @protected
     */
    _applyEvents(eventType, eventArguments) {
        let typeListeners = this._listeners[eventType];

        if (!typeListeners || !typeListeners.length) {
            if (this._strictMode) {
                throw 'No listeners specified for event: ' + eventType;
            } else {
                return;
            }
        }

        let removableListeners = [];
        typeListeners.forEach(function (eeListener, idx) {
            eeListener.fn.apply(null, eventArguments);
            if (eeListener.once) {
                removableListeners.unshift(idx);
            }
        });

        removableListeners.forEach(function (idx) {
            typeListeners.splice(idx, 1);
        });
    }

    /**
     * Emits event with specified type and params.
     * @param {string} type
     * @param eventArgs
     */
    emit(type, ...eventArgs) {
        if (this._emitDelay) {
            setTimeout(() => {
                this._applyEvents(type, eventArgs);
            }, this._emitDelay);
        } else {
            this._applyEvents(type, eventArgs);
        }
    }

    /**
     * Emits event with specified type and params synchronously.
     * @param {string} type
     * @param eventArgs
     */
    emitSync(type, ...eventArgs) {
        this._applyEvents(type, eventArgs);
    }

    /**
     * Destroys EventEmitter
     */
    destroy() {
        this._listeners = {};
        this.events = [];
    }
}
