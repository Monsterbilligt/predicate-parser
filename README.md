# predicate-parser

Parses predicate strings. Developed to support parsing simple predicate strings (containing numbers, variables and +'s) and evaluate their truthfulness.

## Install

`npm i @monsterbilligt/predicate-parser`

## Usage

Use `evaluatePredicateString()` to evaluate a predicate string. Validates the string before parsing. Use as a predicate (ie. returns either true or false).

Use `createPredicateRegExp()` to create a regular expression that can validate user input as a predicate string.

Example:

```js
import { evaluatePredicateString } from '@monsterbilligt/predicate-parser'

console.log(
  evaluatePredicateString('duration > 24 days', { duration: 26, numberSuffix: 'days' })
)

// > true
```

## Develop

`npm i && npm test`
