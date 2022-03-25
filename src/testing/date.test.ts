import { checkDate } from "../modules/date"

describe('Test checkDate function', () => {
  test('Return incorrect result when date is empty', () => {
    const result = checkDate('')
    const expected = {
      result: 'Date does not follow the expected format (DDHHMMZ)',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })
  test('Return incorrect result when input not matching format expected', () => {
    const result = checkDate('210526')
    const expected = {
      result: 'Date does not follow the expected format (DDHHMMZ)',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })
  test('Format correct, day incorrect, result incorrect', () => {
    const result = checkDate('320000Z')
    const expected = {
      result: 'Day must be between 1 and 31',
      isCorrect: false
    }
    expect(result).toStrictEqual(expected)
  })
})