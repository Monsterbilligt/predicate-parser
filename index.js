/**
 * Create a regular expression for predicate strings
 * @param {Object} options Optional options object, where keys can be accessed in the predicate
 * @returns {RegExp} A regular expression that can test predicate strings
 */
function createPredicateRegExp (options) {
  const optionString = Object.keys(options).join('|') || '\\d+'
  return new RegExp(`^((?:(?:${optionString}|\\d+)\\s*\\+\\s*)*(?:${optionString}|\\d+))\\s*(<=|>=|<|>)\\s*(${optionString}|\\d+)\\s*$`)
}

/**
 * Parses predicate strings
 * @param {String} query The predicate string that should be parsed
 * @param {Object} options Optional options object, where keys can be accessed in the predicate
 * @returns {Boolean} Is the predicate true?
 */
function parsePredicate (query, options = {}) {
  const reg = createPredicateRegExp(options)
  if (!reg.test(query)) {
    throw new Error('Not valid')
  }

  const [, left, operand, right] = query.match(reg)

  function mapPart (part) {
    return options[part] || parseInt(part, 10)
  }

  const expectedValue = mapPart(right)

  const sum = left
    .split(/\s*\+\s*/)
    .map(mapPart)
    .reduce(
      (acc, part) => acc + part,
      0
    )

  switch (operand) {
    case '<':
      return sum < expectedValue
    case '>':
      return sum > expectedValue
    case '<=':
      return sum <= expectedValue
    case '>=':
      return sum >= expectedValue
    default:
      throw new Error('Operand unknown: ' + operand)
  }
}

module.exports = {
  parsePredicate,
  createPredicateRegExp
}
