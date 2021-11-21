const event = {}
function addEvent (name, func) {
  event[name] = func
}
function emitEvent (name, param) {
  if (typeof event[name] === 'function') {
    event[name](param)
  }
}

export { addEvent, emitEvent }
