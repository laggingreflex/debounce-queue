module.exports = function defaultEnqueue(data, queue) {
  if (queue.indexOf(data) === -1) {
    queue.push(data)
  }
  return queue;
}
