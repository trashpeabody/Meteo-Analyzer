import { checkVisibility } from '../modules/averageVisibility'

describe('Test average wind module', () => {

  describe('Testing incorrect inputs', () => {

    test('Incorrect format', () => {
      const result = checkVisibility('')
      const expected = {
        isCorrect: false,
        reason: 'Format expected for average visibility is VVVV.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility shorter than 800 in steps different than 50', () => {
      const result = checkVisibility('0730')
      const expected = {
        isCorrect: false,
        reason: 'When visibility is lower than 800, step reporting should be 50.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility bigger than 800 but shorter than 5000 in steps different than 100', () => {
      const result = checkVisibility('1050')
      const expected = {
        isCorrect: false,
        reason: 'When visibility is bigger than 800 and lower than 5000, step reporting should be 100.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility bigger than 5000 in steps different than 1000', () => {
      const result = checkVisibility('6100')
      const expected = {
        isCorrect: false,
        reason: 'When visibility is bigger than 5000, step reporting should be 1000.',
      }
      expect(result).toStrictEqual(expected)
    })
  })

  describe('Testing correct inputs', () => {

    test('Visibility shorter than 800', () => {
      const result = checkVisibility('0050')
      const expected = {
        isCorrect: true,
        reason: 'Average visibility value is 0050.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility shorter than 800', () => {
      const result = checkVisibility('0700')
      const expected = {
        isCorrect: true,
        reason: 'Average visibility value is 0700.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility bigger than 800 and shorter than 5000', () => {
      const result = checkVisibility('3500')
      const expected = {
        isCorrect: true,
        reason: 'Average visibility value is 3500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility bigger than 5000', () => {
      const result = checkVisibility('7000')
      const expected = {
        isCorrect: true,
        reason: 'Average visibility value is 7000.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Visibility bigger than 10km', () => {
      const result = checkVisibility('9999')
      const expected = {
        isCorrect: true,
        reason: 'Average visibility value is 9999.',
      }
      expect(result).toStrictEqual(expected)
    })
  })
})