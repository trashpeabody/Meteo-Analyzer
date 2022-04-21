import { checkDate } from "../modules/date"

describe('Test checkDate module', () => {

  test('Empty', () => {
    const result = checkDate('')
    const expected = {
      reason: 'Date does not follow the expected format (DDHHMMZ).',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })

  test('Incorrect format', () => {
    const result = checkDate('210526')
    const expected = {
      reason: 'Date does not follow the expected format (DDHHMMZ).',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })

  test('Day incorrect', () => {
    const result = checkDate('320000Z')
    const expected = {
      reason: 'Day must be between 1 and 31.',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
    const result2 = checkDate('000000Z')
    expect(result2).toStrictEqual(expected)
  })

  test('Hour incorrect', () => {
    const result = checkDate('242400Z')
    const expected = {
      reason: 'Hour must be between 0 and 23.',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })

  test('Minute incorrect', () => {
    const result = checkDate('241505Z')
    const expected = {
      reason: 'Min must be 0 or 30.',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })

  test('Correct', () => {
    const result = checkDate('241500Z')
    const expected = {
      reason: 'Month day and Zulu time of the message.',
      isCorrect: true
    }
    expect(result).toStrictEqual(expected)
    const result2 = checkDate('122330Z')
    expect(result2).toStrictEqual(expected)
  })
})