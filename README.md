# ember-web-workers

This addon provides a lightweight structure for building web workers. It
consists of two layers:

* A web worker, which is a class that gets its own thread in the worker scope.
* An `Ember.Service` that exposes a `postMessage` function for calling methods
  on your worker.

```js
// web-workers/metadata.js
importScripts('../web-worker.js');

class Metadata extends WebWorker {
  getTrack(id) {
    //
    // This can return a Transferable object or a thenable that resolves to
    // a Transferable object:
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Transferable
    //
    return this.db.tracks.get(id);
  }
}

let worker = new Metadata();
worker.listen();
```

```js
// app/services/metadata.js
import WebWorker from 'ember-web-workers/services/worker';
export default WebWorker.extend({
  //
  // The `workerName` corresponds to the web-workers/ filename. In this case,
  // it's `web-workers/metadata.js`.
  //
  workerName: 'metadata',
  getTrack(id) {
    return this.postMessage('getTrack', id);
  }
});
```

```js
// app/routes/index.js
export default Route.extend({
  metadata: Ember.inject.service(),
  setupController(controller) {
    let id = ...;
    this.get('metadata').getTrack(id).then(track => {
      controller.set('track', track);
    });
  }
});
```


## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
