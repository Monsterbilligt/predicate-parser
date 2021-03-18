/**
 * Create a regular expression for predicate strings. Use this to test whether a predicate string is valid. Example: `createPredicateString({}).test('24 = 12') === true`
 * @param {{ numberSuffix?: string }} options Options object whose keys can be accessed in the predicate. Optionally provide `numberSuffix`.
 * @returns {RegExp} A regular expression that can test predicate strings
 */
function createPredicateRegExp (options) {
  const number = options.numberSuffix ? `(?:\\d+\\s${options.numberSuffix})` : '\\d+'
  const optionString = Object.keys(options).join('|') || number
  const part = `((?:(?:${optionString}|${number})\\s*\\+\\s*)*(?:${optionString}|${number}))`
  return new RegExp(`^${part}\\s*(<=|>=|<|>|=)\\s*${part}\\s*$`)
}

/**
 * Evaluares a predicate string. Example: `evaluatePredicateString('24 > 12') === true`
 * @param {String} query The predicate string that should be parsed
 * @param {{ numberSuffix?: string }} options Optional options object, where keys can be accessed in the predicate. Optionally provide `numberSuffix`.
 * @returns {Boolean} Is the predicate true?
 */
function evaluatePredicateString (query, options = {}) {
  const reg = createPredicateRegExp(options)
  if (!reg.test(query)) {
    if (options.numberSuffix) {
      console.log(reg)
    }
    throw new Error('Not valid')
  }

  const [, left, operand, right] = query.match(reg)

  function mapPart (part) {
    return options[part] || parseInt(part, 10)
  }

  const leftSum = left
    .split(/\s*\+\s*/)
    .map(mapPart)
    .reduce(
      (acc, part) => acc + part,
      0
    )

  const rightSum = right
    .split(/\s*\+\s*/)
    .map(mapPart)
    .reduce(
      (acc, part) => acc + part,
      0
    )

  switch (operand) {
    case '<':
      return leftSum < rightSum
    case '>':
      return leftSum > rightSum
    case '<=':
      return leftSum <= rightSum
    case '>=':
      return leftSum >= rightSum
    case '=':
      return leftSum === rightSum
    default:
      throw new Error('Operand unknown: ' + operand)
  }
}

module.exports = {
  evaluatePredicateString,
  createPredicateRegExp
}
