/* globals describe, it */

const { evaluatePredicateString, createPredicateRegExp } = require('./index')
const expect = require('expect.js')

describe('predicate regexp', function () {
  it('should fail when missing options obj', function () {
    expect(() => createPredicateRegExp()).to.throwError()
  })

  it('should return working regexp without options', function () {
    expect(createPredicateRegExp({}).test('24 = 24')).to.equal(true)
    expect(createPredicateRegExp({}).test('test = 24')).to.equal(false)
    expect(createPredicateRegExp({}).test('24 = test')).to.equal(false)
  })

  it('should return working regexp with options', function () {
    expect(createPredicateRegExp({ foo: 0 }).test('foo = 24')).to.equal(true)
    expect(createPredicateRegExp({ foo: 0 }).test('24 = foo')).to.equal(true)
    expect(createPredicateRegExp({ foo: 0 }).test('bar = test')).to.equal(false)
  })

  it('should support number suffix', function () {
    expect(createPredicateRegExp({ numberSuffix: 'days', duration: 24 }).test('duration = 24 days')).to.equal(true)
    expect(createPredicateRegExp({ numberSuffix: 'days', duration: 24 }).test('56 days > 24 days')).to.equal(true)
    expect(createPredicateRegExp({ numberSuffix: 'days', duration: 24 }).test('45 days < 24 days')).to.equal(true)
    expect(createPredicateRegExp({ numberSuffix: 'days', duration: 24 }).test('foo < 24 days')).to.equal(false)
  })

  it('should not allow fractions', function () {
    expect(createPredicateRegExp({ numberSuffix: 'days', duration: 24 }).test('duration < 24.5 days')).to.equal(false)
  })
})

describe('parse predicate', function () {
  it('should throw when missing option prop', function () {
    expect(() => evaluatePredicateString('missingProp = 24')).to.throwError()
    expect(() => evaluatePredicateString('missingProp = 24'), {}).to.throwError()
    expect(() => evaluatePredicateString('missingProp = 24'), { prop: 'foo' }).to.throwError()
  })

  it('should return correctly on constant expressions', function () {
    expect(evaluatePredicateString('24 = 24')).to.equal(true)
    expect(evaluatePredicateString('24 < 54')).to.equal(true)
    expect(evaluatePredicateString('24 <= 54')).to.equal(true)
    expect(evaluatePredicateString('67 >= 54')).to.equal(true)
    expect(evaluatePredicateString('67 > 54')).to.equal(true)
    expect(evaluatePredicateString('54 >= 54')).to.equal(true)
    expect(evaluatePredicateString('54 <= 54')).to.equal(true)

    expect(evaluatePredicateString('24 = 45')).to.equal(false)
    expect(evaluatePredicateString('24 > 54')).to.equal(false)
    expect(evaluatePredicateString('24 >= 54')).to.equal(false)
    expect(evaluatePredicateString('67 <= 54')).to.equal(false)
    expect(evaluatePredicateString('67 < 54')).to.equal(false)
  })

  it('should return correctly on variable expressions', function () {
    expect(evaluatePredicateString('val = 24', { val: 24 })).to.equal(true)
    expect(evaluatePredicateString('val = val', { val: 24 })).to.equal(true)
    expect(evaluatePredicateString('50 = val', { val: 24 })).to.equal(false)
  })

  it('should return correctly on composite expressions', function () {
    expect(evaluatePredicateString('val + 24 > 24', { val: 24 })).to.equal(true)
    expect(evaluatePredicateString('val > val + 1', { val: 24 })).to.equal(false)
    expect(evaluatePredicateString('50 < val + 27', { val: 24 })).to.equal(true)
  })

  it('should return correctly on multivariable expressions', function () {
    expect(evaluatePredicateString('val + bar + 24 > 24', { val: 24, bar: 25 })).to.equal(true)
    expect(evaluatePredicateString('50 + bar < val + 27', { val: 24, bar: 10 })).to.equal(false)
    expect(evaluatePredicateString('val + bar > val + 10', { val: 24, bar: -8 })).to.equal(false)
  })

  it('should support number suffix', function () {
    expect(evaluatePredicateString('duration = 24 days', { numberSuffix: 'days', duration: 24 })).to.equal(true)
    expect(evaluatePredicateString('56 days > 24 days', { numberSuffix: 'days', duration: 24 })).to.equal(true)
    expect(evaluatePredicateString('56 days < 24 days', { numberSuffix: 'days', duration: 24 })).to.equal(false)
  })

  it('should not allow fractions', function () {
    expect(() => evaluatePredicateString({ numberSuffix: 'days', duration: 24 }).test('duration < 24.5 days')).to.throwError()
  })
})
