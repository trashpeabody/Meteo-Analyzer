import { checkAirport } from '../modules/airport'

describe('Test check airport module', () => {

  test('Empty', () => {
    const result = checkAirport('')
    const expected = {
      isCorrect: false,
      result: 'Airport code does not follow ICAO format (ZZZZ)'
    }
    expect(result).toStrictEqual(expected)
  })

  test('Incorrect format', () => {
    const result = checkAirport('GGGGG')
    const expected = {
      isCorrect: false,
      result: 'Airport code does not follow ICAO format (ZZZZ)'
    }
    expect(result).toStrictEqual(expected)
    const result2 = checkAirport('lemd')
    expect(result2).toStrictEqual(expected)
  })

  test('Correct format', () => {
    const result = checkAirport('LEMD')
    const expected = {
      isCorrect: true,
      result: 'Airport ICAO code'
    }
    expect(result).toStrictEqual(expected)
  })
})