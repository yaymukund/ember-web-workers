class WebWorker {
  trigger(eventName, ...args) {
    postMessage([eventName, ...args]);
  }

  listen() {
    addEventListener('message', event => {
      let [eventName, func, ...args] = event.data,
          result;

      if (typeof this[func] !== 'function') {
        throw new Error(`postMessage('${func}') was called but `+
          `${this.constructor.name}.${func} is not a method.`);
      } else {
        result = this[func](...args);
      }

      if (result && typeof result === 'object' && result['then']) {
        result.then(val => {
          this.trigger('callback', eventName, val);
        });
      } else {
        this.trigger('callback', eventName, result);
      }
    });
  }
}
