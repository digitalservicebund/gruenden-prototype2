export function printIndex(value) {
  return value + 1;
}

export function join() {
  let arg = Array.prototype.slice.call(arguments, 0);

  arg.pop();
  return arg.join("");
}

export function is(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
}

export function isnt(a, b, options) {
  if (a !== b) {
    return options.fn(this);
  }
  return options.inverse(this);
}
