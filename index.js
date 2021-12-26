const defaultOpts = {
  wait: 0,
  maxWait: Infinity,
  leading: false,
  trailing: true
};
const debug = () => {}; // console.debug

module.exports = debounceQueue

function debounceQueue(func, opts = {}) {
  if (typeof func !== 'function') {
    throw new Error('Required: the function to debounce');
  }

  if (typeof opts === 'number') {
    opts = { wait: opts };
  }

  opts = Object.assign({}, defaultOpts, opts);

  const queue = [];
  const time = { lastCall: new Date(0), lastFlush: new Date, };
  let timer;

  return function debounced(...args) {
    clearTimeout(timer);
    queue.push(args);
    const vars = { now: new Date, ...time };
    time.lastCall = vars.now;
    vars.sinceLastCall = vars.now - vars.lastCall;
    vars.sinceLastFlush = vars.now - vars.lastFlush;

    debug('[0] Data:', {
      opts,
      vars,
      [`sinceLastFlush (${vars.sinceLastFlush}) >= (${opts.maxWait}) maxWait`]: vars.sinceLastFlush >= opts.maxWait,
      [`sinceLastCall (${vars.sinceLastCall}) >= (${opts.wait}) wait`]: vars.sinceLastCall >= opts.wait,
      [`leading (${opts.leading}) && (sinceLastCall >= wait)`]: opts.leading && (vars.sinceLastCall >= opts.wait),
    });

    if (false
      || (vars.sinceLastFlush >= opts.maxWait)
      || (opts.leading && (vars.sinceLastCall >= opts.wait))
    ) {
      debug('[1] Calling now');
      return func(flush(vars.now, queue));
    }

    if (opts.trailing !== false) {
      debug('[2] Setting timer');
      timer = setTimeout(() => {
        debug('[3] Timer launching');
        return func(flush(vars.now, queue));
      }, opts.wait);
    }
  }

  function flush(now = new Date, q = queue) {
    time.lastFlush = now;
    return q.splice(0, q.length);
  }
};
