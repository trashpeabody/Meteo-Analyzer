import { getArray } from '../modules/format'

const message: String = 'METAR LEMD 210900Z 34003KT 310V020 CAVOK M01/M03 Q1026 NOSIG='
const messageArray: String[] = ['METAR', 'LEMD', '210900Z', '34003KT', '310V020', 'CAVOK', 'M01/M03', 'Q1026', 'NOSIG']

describe('Test conversor from string to array', () => {

  test('Correct lists of items', () => {
    const result: String[] = getArray(message).array
    expect(result).toHaveLength(9)
    expect(result).toStrictEqual(messageArray)
  })

  test('Empty array', () => {
    const result: String[] = getArray('').array
    expect(result).toHaveLength(0)
    expect(result).toStrictEqual([])
  })

  test('String with several blanks between terms', () => {
    const messageBlanks: String = 'METAR      LEMD 210900Z 34003KT     310V020 CAVOK M01/M03 Q1026 NOSIG='
    const result: String[] = getArray(messageBlanks).array
    expect(result).toHaveLength(9)
    expect(result).toStrictEqual(messageArray)
  })

  test('String with line feeds', () => {
    const messageLF: String = `METAR      LEMD 210900Z 34003KT     310V020 CAVOK M01/M03 Q1026 
      NOSIG=
    `
    const result: String[] = getArray(messageLF).array
    expect(result).toHaveLength(9)
    expect(result).toStrictEqual(messageArray)
  })
})