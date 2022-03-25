import { checkAirport } from '../modules/airport'

describe('Test check airport function', () => {
  test('Empty airport returns error', () => {
    const result = checkAirport('')
    const expected = {
      isCorrect: false,
      result: 'Airport code does not follow ICAO format (ZZZZ)'
    }
    expect(result).toStrictEqual(expected)
  })
  test('Airport not following expected format returns error', () => {
    const result = checkAirport('GGGGG')
    const expected = {
      isCorrect: false,
      result: 'Airport code does not follow ICAO format (ZZZZ)'
    }
    expect(result).toStrictEqual(expected)
  })
  test('Airport following expected format returns correct result', () => {
    const result = checkAirport('LEMD')
    const expected = {
      isCorrect: true,
      result: 'Airport ICAO code'
    }
    expect(result).toStrictEqual(expected)
  })
  test('Airport following expected format in lowercase returns error', () => {
    const result = checkAirport('lemd')
    const expected = {
      isCorrect: false,
      result: 'Airport code does not follow ICAO format (ZZZZ)'
    }
    expect(result).toStrictEqual(expected)
  })
})