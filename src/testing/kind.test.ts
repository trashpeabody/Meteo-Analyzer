import { checkKind } from "../modules/kind"

describe('Test checkKind module', () => {

  test('Incorrect METAR', () => {
    const result = checkKind('', 'METAR')
    const expected = {
      isCorrect: false,
      result: 'Message must start with the keyword METAR'
    }
    expect(result).toStrictEqual(expected)
  })

  test('Correct METAR', () => {
    const result = checkKind('METAR', 'METAR')
    const expected = {
      isCorrect: true,
      result: 'Key identifier of the message kind '
    }
    expect(result).toStrictEqual(expected)
  })

  test('Incorrect SPECI', () => {
    const result = checkKind('test', 'SPECI')
    const expected = {
      isCorrect: false,
      result: 'Message must start with the keyword SPECI'
    }
    expect(result).toStrictEqual(expected)
  })

  test('Correct SPECI', () => {
    const result = checkKind('SPECI', 'SPECI')
    const expected = {
      isCorrect: true,
      result: 'Key identifier of the message kind '
    }
    expect(result).toStrictEqual(expected)
  })
})