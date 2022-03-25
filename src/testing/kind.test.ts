import { checkKind } from "../modules/kind"

describe('Test kind checker', () => {
  test('Check kind function for incorrect METAR type', () => {
    const result = checkKind('', 'METAR')
    const expected = {
      isCorrect: false,
      result: 'Message must start with the keyword METAR'
    }
    expect(result).toStrictEqual(expected)
  })
  test('Check kind function for correct METAR type', () => {
    const result = checkKind('METAR', 'METAR')
    const expected = {
      isCorrect: true,
      result: 'Key identifier of the message kind '
    }
    expect(result).toStrictEqual(expected)
  })
  test('Check kind function for incorrect SPECI type', () => {
    const result = checkKind('test', 'SPECI')
    const expected = {
      isCorrect: false,
      result: 'Message must start with the keyword SPECI'
    }
    expect(result).toStrictEqual(expected)
  })
  test('Check kind function for correct METAR type', () => {
    const result = checkKind('SPECI', 'SPECI')
    const expected = {
      isCorrect: true,
      result: 'Key identifier of the message kind '
    }
    expect(result).toStrictEqual(expected)
  })
})