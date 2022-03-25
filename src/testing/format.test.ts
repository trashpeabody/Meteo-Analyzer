import { getArray } from '../modules/format'

const message: String = 'METAR LEMD 210900Z 34003KT 310V020 CAVOK M01/M03 Q1026 NOSIG='
const messageArray: String[] = ['METAR', 'LEMD', '210900Z', '34003KT', '310V020', 'CAVOK', 'M01/M03', 'Q1026', 'NOSIG=']

describe('Test conversor from string to array', () => {
  test('Return array of items when called getArray', () => {
    const result: String[] = getArray(message)
    expect(result).toHaveLength(9)
    expect(result).toStrictEqual(messageArray)
  })
  test('When message is empty, received empty array', () => {
    const result: String[] = getArray('')
    expect(result).toHaveLength(0)
    expect(result).toStrictEqual([])
  })
  test('When there are more than one blank between words, filter them', () => {
    const messageBlanks: String = 'METAR      LEMD 210900Z 34003KT     310V020 CAVOK M01/M03 Q1026 NOSIG='
    const result: String[] = getArray(messageBlanks)
    expect(result).toHaveLength(9)
    expect(result).toStrictEqual(messageArray)
  })
  test('When message includes line feed, filter them', () => {
    const messageLF: String = `METAR      LEMD 210900Z 34003KT     310V020 CAVOK M01/M03 Q1026 
      NOSIG=
    `
    const result: String[] = getArray(messageLF)
    expect(result).toHaveLength(9)
    expect(result).toStrictEqual(messageArray)
  })
})