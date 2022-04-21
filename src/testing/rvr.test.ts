import { checkRVR } from "../modules/rvr"

describe('Test rvr module', () => {

  describe('Testing incorrect inputs', () => {

    test('Incorrect format', () => {
      const result = checkRVR('')
      const expected = {
        isCorrect: false,
        reason: 'Format expected for average visibility is RDD(R|L|C)/(P|M)VVVV(N|D|U).',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Runway shorter than 01', () => {
      const result = checkRVR('R00/1500')
      const expected = {
        isCorrect: false,
        reason: 'Runway must be between 01 and 36.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Runway bigger than 36', () => {
      const result = checkRVR('R37/1500')
      const expected = {
        isCorrect: false,
        reason: 'Runway must be between 01 and 36.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Value shorter than 400 in steps different than 25', () => {
      const result = checkRVR('R34/0356')
      const expected = {
        isCorrect: false,
        reason: 'When RVR value is lower than 400 it should be reported in steps of 25m.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Value bigger than 400 and shorter than 800 in steps different than 50', () => {
      const result = checkRVR('R34/0675')
      const expected = {
        isCorrect: false,
        reason: 'When RVR value is between 400 and 800 it should be reported in steps of 50m.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('Value bigger than 800 in steps different than 100', () => {
      const result = checkRVR('R34/1050')
      const expected = {
        isCorrect: false,
        reason: 'When RVR value is bigger than 800 it should be reported in steps of 100m.',
      }
      expect(result).toStrictEqual(expected)
    })
  })

  describe('Testing correct inputs', () => {

    test('RVR correct with the minimum parameters', () => {
      const result = checkRVR('R05/1500')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05. The measured value is 1500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with paralel runways (L)', () => {
      const result = checkRVR('R05L/1500')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05L. The measured value is 1500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with paralel runways (R)', () => {
      const result = checkRVR('R05R/1500')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05R. The measured value is 1500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with paralel runways (C)', () => {
      const result = checkRVR('R05C/1500')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05C. The measured value is 1500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with value shorter than minimum available', () => {
      const result = checkRVR('R05C/M1500')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05C. Actual value is smaller than the maximum measurable value by the available systems. The measured value is 1500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with value bigger than minimum available', () => {
      const result = checkRVR('R05C/P1500')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05C. Actual value is bigger than the maximum measurable value by the available systems. The measured value is 1500.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with no trend', () => {
      const result = checkRVR('R05C/P1500N')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05C. Actual value is bigger than the maximum measurable value by the available systems. The measured value is 1500. Not significant change has been detected in the last 10 minutes.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with descending trend', () => {
      const result = checkRVR('R05C/P1500D')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05C. Actual value is bigger than the maximum measurable value by the available systems. The measured value is 1500. Average RVR has descended more than 100m in the last 10 minutes.',
      }
      expect(result).toStrictEqual(expected)
    })

    test('RVR correct with ascending trend', () => {
      const result = checkRVR('R05C/P1500U')
      const expected = {
        isCorrect: true,
        reason: 'RVR is correct and reported for rwy 05C. Actual value is bigger than the maximum measurable value by the available systems. The measured value is 1500. Average RVR has increased more than 100m in the last 10 minutes.',
      }
      expect(result).toStrictEqual(expected)
    })
  })
})