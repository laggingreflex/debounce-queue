module.exports = function debounceQueue( fn, delay, opts ) {
  if ( typeof fn !== 'function' ) {
    throw new Error( 'Required: the function to debounce' );
  }

  opts = opts || {};

  let queue = [];

  const enqueue = opts.enqueue || function( data, queue ) {
    if ( queue.indexOf( data ) === -1 ) {
      queue.push( data )
    }
    return queue;
  }

  delay = delay || 100;
  const maxWait = opts.maxWait || ( delay + 2000 );
  let time = new Date();

  function debounced( data ) {
    const ret = enqueue( data, queue.slice() );
    if ( !( ret instanceof Array ) ) {
      throw new Error( 'opts.enqueue must return a modified queue array' );
    } else {
      // if (ret.length < queue.length) {
      //   console.warn('WARNING: Returned queue has fewer items than the original');
      // }
      queue = ret;
    }
    if ( new Date( time + maxWait ) < new Date() ) {
      setNextTimer();
      time = new Date();
    }
  }

  function timeoutFn() {
    const flush = queue.slice();
    queue = [];

    let ret;
    if ( flush.length ) {
      ret = fn( flush );
    }

    if ( ret && ret.then ) {
      ret.then( setNextTimer );
    } else {
      setNextTimer();
    }
  }

  let timer;
  debounced.clearTimeout = () => {
    if ( !timer ) return;
    clearTimeout(timer);
    timer = null;
  };
  function setNextTimer() {
    debounced.clearTimeout();
    timer = setTimeout( timeoutFn, delay );
  }

  // setNextTimer();

  return debounced;
};
