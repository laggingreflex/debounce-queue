# debounce-queue

[![npm](https://img.shields.io/npm/v/debounce-queue.svg)](https://www.npmjs.com/package/debounce-queue)

Like [`lodash.debounce`][1] but you get an array of all previous (unique) events instead of just the last/first one.

[1]: https://lodash.com/docs/4.16.6#debounce

## Example

```js
import {watch} from 'chokidar';
import debounce from 'debounce-queue';

function onChange(files) {
  // files is now an array of (unique) files that were changed since (t-1000)ms
}

const debounced = debounce(onChange, 1000);

watch('.')
  .on('change', debounced)

```

You can customize which items get enqueued (this is the default):

```js
function enqueue( data, queue ) {
  if ( queue.indexOf( data ) === -1 ) {
    queue.push( data )
  }
  return queue;
}

const debounced = debounce(onChange, 1000, {
  enqueue: enqueue
});
```

## Extras

### Promise support

Your debounced function can return a promise
```js
function onChange(files) {
  return Promise.map(files, () => {
    return Promise.delay(1000);
  });
  // Next onChange will fire after (delay+(n(files)*1000))ms
}
```