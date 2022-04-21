import { checkMinVisibility } from '../modules/minVisibility'

describe('Test minimum visibility module', () => {

  describe('Testing incorrect inputs', () => {

    test('Incorrect format', () => {
      const result = checkMinVisibility('', '').matches
      const expected = false
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility shorter than 800 in steps different than 50', () => {
      const result = checkMinVisibility('0730', '9999').result
      const expected = {
        isCorrect: false,
        reason: 'When visibility is lower than 800, step reporting should be 50.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 but shorter than 5000 in steps different than 100', () => {
      const result = checkMinVisibility('1050', '9999').result
      const expected = {
        isCorrect: false,
        reason: 'When visibility is bigger than 800 and lower than 5000, step reporting should be 100.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 5000', () => {
      const result = checkMinVisibility('6000', '9999').result
      const expected = {
        isCorrect: false,
        reason: `Min Visibility must be lower than 1500m, or when it's bigger, it should be lower than 5000m and less than half of the average Visibility.`,
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 5000', () => {
      const result = checkMinVisibility('6100', '9999').result
      const expected = {
        isCorrect: false,
        reason: 'When visibility is bigger than 5000, step reporting should be 1000.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 1500 and bigger than half of the average visibility', () => {
      const result = checkMinVisibility('1600', '2500').result
      const expected = {
        isCorrect: false,
        reason: `Min Visibility must be lower than 1500m, or when it's bigger, it should be lower than 5000m and less than half of the average Visibility.`,
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility and Average Visibility are the same', () => {
      const result = checkMinVisibility('1600', '1600').result
      const expected = {
        isCorrect: false,
        reason: `Minimum Visibility and Average Visibility can't have the same value.`,
      }
      expect(result).toStrictEqual(expected)
    })
  })

  describe('Testing correct inputs', () => {

    test('Min Visibility shorter than 800', () => {
      const result = checkMinVisibility('0050', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 0050 in an unknown direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility shorter than 800', () => {
      const result = checkMinVisibility('0700', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 0700 in an unknown direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility', () => {
      const result = checkMinVisibility('4000', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 in an unknown direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000N', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the N direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000S', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the S direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000E', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the E direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000W', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the W direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000NW', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the NW direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000SW', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the SW direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000NE', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the NE direction.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Min Visibility bigger than 800 and shorter than half of the average visibility in a direction', () => {
      const result = checkMinVisibility('4000NW', '9999').result
      const expected = {
        isCorrect: true,
        reason: 'Minimum Visibility is correct and its value is 4000 mainly in the NW direction.',
      }
      expect(result).toStrictEqual(expected)
    })
  })
})

