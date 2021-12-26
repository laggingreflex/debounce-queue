const assert = require('assert');
const debounce = require('.');

describe('basic', () => {
  it('should work', async () => {
    const [debounced, spy] = mock();
    debounced(1);
    debounced(2)
    debounced(3)
    await delay(1000);
    assert(spy.calls.length, 1);
    assert.deepEqual(spy.calls[0][0], [
      [1],
      [2],
      [3]
    ]);
  });
});

describe('opts.wait', () => {
  it('should wait', async () => {
    const [debounced, spy] = mock({ wait: 1000 });
    debounced(1);
    debounced(2)
    debounced(3)
    await delay(1000);
    assert(spy.calls.length, 0);
    await delay(1000);
    assert(spy.calls.length, 1);
    assert.deepEqual(spy.calls[0][0], [
      [1],
      [2],
      [3]
    ]);
  });
});

describe('opts.leading', () => {
  it('called before opts.wait', async () => {
    const [debounced, spy] = mock({ wait: 500, leading: true });
    debounced(1);
    assert(spy.calls.length, 1);
    assert.deepEqual(spy.calls[0][0], [
      [1],
    ]);
  });
  it('called before opts.wait & after', async () => {
    const [debounced, spy] = mock({ wait: 500, leading: true });
    debounced(1);
    debounced(2);
    debounced(3);
    await delay(1000);
    assert(spy.calls.length, 2);
    assert.deepEqual(spy.calls, [
      [
        [
          [1]
        ]
      ],
      [
        [
          [2],
          [3],
        ]
      ]
    ]);
  });
  it('called before opts.wait & after & later', async () => {
    const [debounced, spy] = mock({ wait: 500, leading: true });
    debounced(1);
    debounced(2);
    debounced(3);
    await delay(1000);
    debounced(4);
    debounced(5);
    debounced(6);
    await delay(1000);
    assert(spy.calls.length, 4);
    // console.log(spy.calls)
    assert.deepEqual(spy.calls, [
      [
        [
          [1]
        ]
      ],
      [
        [
          [2],
          [3],
        ]
      ],
      [
        [
          [4]
        ]
      ],
      [
        [
          [5],
          [6],
        ]
      ],
    ]);
  });
});

describe('opts.maxWait', () => {
  it('called before maxWait', async () => {
    // console.log(`ctx:`, ctx)
    // this.timeout(5000)
    const [debounced, spy] = mock({ wait: 500, maxWait: 1000 });
    debounced(1);
    await delay(400);
    debounced(2);
    await delay(400);
    debounced(3);
    await delay(400);
    debounced(4);
    await delay(400);
    debounced(5);
    await delay(1000);
    // console.dir(spy, { depth: 10 })
    assert(spy.calls.length, 2);
    assert.deepEqual(spy.calls[0][0], [
      [1],
      [2],
      [3],
      [4],
    ]);
    assert.deepEqual(spy.calls[1][0], [
      [5],
    ]);
  });
});

/* Utils */

function mock(debounceOpts, spyOpts) {
  const s = spy(spyOpts);
  const debounced = debounce(s.fn, debounceOpts);
  return [debounced, s];
}

function spy(opts = {}) {
  if (typeof opts === 'function') opts = { returns: opts };
  const spy = { calls: [], returns: opts.returns || (() => {}), fn };
  return spy;

  function fn(...args) {
    spy.calls.push(args);
    // console.dir({ args }, { depth: 10 })
    return spy.returns(...args);
  }
}

function delay(timeout) {
  return new Promise(x => setTimeout(x, timeout));
}
