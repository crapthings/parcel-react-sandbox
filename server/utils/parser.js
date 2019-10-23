const parser = str => {
  let ops = []
  let method, arg
  let isMethod = true
  let open = []

  for (const char of str) {
    // skip whitespace
    // if (char === ' ') continue

    // append method or arg string
    if (char !== '(' && char !== ')') {
      if (isMethod) {
        (method ? (method += char) : (method = char))
      } else {
        (arg ? (arg += char) : (arg = char))
      }
    }

    if (char === '(') {
      // nested parenthesis should be a part of arg
      if (!isMethod) arg += char
      isMethod = false
      open.push(char)
    } else if (char === ')') {
      open.pop()
      // check end of arg
      if (open.length < 1) {
        isMethod = true
        ops.push({ method: method.trim(), arg: arg.trim() })
        method = arg = undefined
      } else {
        arg += char
      }
    }
  }

  return ops
}

module.exports = parser
