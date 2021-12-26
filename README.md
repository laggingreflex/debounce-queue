# debounce-queue

[![npm](https://img.shields.io/npm/v/debounce-queue.svg)](https://www.npmjs.com/package/debounce-queue)

[Debounce] that gives you an array of **all** previous events instead of just the last one.

[debounce]: https://lodash.com/docs/4.16.6#debounce

## Install

```sh
npm install debounce-queue --save
```

## Usage

### Example

```js
import { watch } from 'fs'
import debounce from 'debounce-queue'

watch('.', debounce(list => {
  for(const [eventType, filename] of list) {
    ...
  }
}))
```

### API

```js
debounce(func, opts)
```

* **`func`** `<function>(required)` The function to debounce
* **`opts`** `[number|object]` Options or wait
* **`opts.wait`** `[number=0]` The number of milliseconds to delay
* **`opts.leading`** `[boolean=false]` Specify invoking on the leading edge of the timeout.
* **`opts.maxWait`** `[number]` The maximum time func is allowed to be delayed before it's invoked.
* **`opts.trailing`** `[boolean=true]` Specify invoking on the trailing edge of the timeout.
