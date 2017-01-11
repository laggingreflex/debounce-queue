const defaultEnqueue = require('./enqueue');

module.exports = function debounceQueue(callback, delay, opts) {
  if (typeof callback !== 'function') {
    throw new Error('Required: the function to debounce');
  }

  if (typeof delay !== 'number' && !opts) {
    opts = delay
    delay = opts.delay
  }

  opts = opts || {};
  delay = delay || 100;

  let queue = [];

  const enqueue = opts.enqueue || defaultEnqueue;

  const maxWait = opts.maxWait || (delay + 2000);
  let time = new Date();

  function debounced(data) {
    const queueCopy = queue.slice()
    const ret = enqueue(data, queueCopy, (_data = data, queue = queueCopy) => defaultEnqueue(_data, queue));
    if (!(ret instanceof Array)) {
      throw new Error('opts.enqueue must return a modified queue array');
    } else {
      // if (ret.length < queue.length) {
      //   console.warn('WARNING: Returned queue has fewer items than the original');
      // }
      queue = ret;
    }
    if (new Date(time + maxWait) < new Date()) {
      setNextTimer();
      time = new Date();
    }
  }

  function timeoutFn() {
    const flush = queue.slice();
    queue = [];

    let ret;
    if (flush.length) {
      ret = callback(flush);
    }

    if (ret && ret.then) {
      ret.then(setNextTimer);
    } else {
      setNextTimer();
    }

    return ret
  }

  let timer;
  debounced.clearTimeout = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
  };

  function setNextTimer() {
    debounced.clearTimeout();
    timer = setTimeout(timeoutFn, delay);
  }

  // start timer at the beginning?
  // or let the first invocation start it?
  // setNextTimer();

  return debounced;
};
