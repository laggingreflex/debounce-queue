module.exports = function debounceQueue(callback, opts = {}) {
  if (typeof callback !== 'function') {
    throw new Error('Required: the function to debounce');
  }

  if (typeof opts === 'number') {
    opts = { delay: opts };
  }

  const delay = opts.delay = opts.delay || 100;

  let queue = [];
  let sleeping = false;

  const maxWait = opts.maxWait || (delay + 2000);
  let time = new Date();

  function debounced(...args) {
    if (sleeping) return;
    queue.push(args);
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
      if (opts.sleep) {
        sleeping = true;
      }
      ret = callback(flush);
    }

    if (ret && ret.then) {
      ret.then(() => {
        sleeping = false;
      });
    } else {
      sleeping = false;
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
