import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  worker: null,
  __invocationCount__: 0,
  __deferreds__: null,

  __setupWorker__: Ember.on('init', function() {
    let name = this.get('workerName'),
        worker = new Worker(`assets/web-workers/${name}.js`);

    this.set('worker', worker);
    this.set('__deferreds__', {});

    worker.addEventListener('message', event => {
      let [name, ...args] = event.data;
      this.trigger(name, ...args);
    });
  }),

  _processCallback: Ember.on('callback', function(eventName, result) {
    let deferreds = this.get('__deferreds__');
    deferreds[eventName].resolve(result);
    delete deferreds[eventName];
  }),

  postMessage(name, ...args) {
    let id = this.incrementProperty('__invocationCount__'),
        eventName = `callback.${id}`,
        deferred = Ember.RSVP.defer();

    this.get('__deferreds__')[eventName] = deferred;
    this.get('worker').postMessage([eventName, name, ...args]);

    return deferred.promise;
  }
});
