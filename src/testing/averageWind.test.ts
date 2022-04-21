import { checkWind } from "../modules/averageWind";

describe('Test average wind module', () => {

  describe('Testing incorrect inputs', () => {

    test('Incorrect format', () => {
      const result = checkWind('')
      const expected = {
        isCorrect: false,
        reason: 'Format expected for average wind is nnn|VRB[P]nnG[P]nnKT.',
        info: {
          windDirection: '',
          windSpeed: '',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction does not follow steps of 10º', () => {
      const result = checkWind('30408KT')
      const expected = {
        isCorrect: false,
        reason: 'Wind direction must be reported in steps of 10º.',
        info: {
          windDirection: '304',
          windSpeed: '',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction is bigger than 360º', () => {
      const result = checkWind('37008KT')
      const expected = {
        isCorrect: false,
        reason: 'Wind direction cannot be bigger than 360º.',
        info: {
          windDirection: '370',
          windSpeed: '',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction calm but speed with P', () => {
      const result = checkWind('000P99KT')
      const expected = {
        isCorrect: false,
        reason: '0 degrees direction can only be used for calm wind (00000KT).',
        info: {
          windDirection: '000',
          windSpeed: '',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction not calm and speed 0 kt', () => {
      const result = checkWind('15000KT')
      const expected = {
        isCorrect: false,
        reason: 'Wind speed can only be 00 when wind direction is 000.',
        info: {
          windDirection: '150',
          windSpeed: '00',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Calm direction and speed not calm', () => {
      const result = checkWind('00002KT')
      const expected = {
        isCorrect: false,
        reason: 'Wind speed must be 00 when wind direction is 000.',
        info: {
          windDirection: '000',
          windSpeed: '02',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Speed using P but value less than 99', () => {
      const result = checkWind('150P55KT')
      const expected = {
        isCorrect: false,
        reason: 'Letter P should be used only for speed over 99 knots.',
        info: {
          windDirection: '150',
          windSpeed: '55',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Speed guts (G) is 00', () => {
      const result = checkWind('15024G00KT')
      const expected = {
        isCorrect: false,
        reason: 'Speed guts cannot be of 00kt.',
        info: {
          windDirection: '150',
          windSpeed: '24',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Speed guts (G) using P but value less than 99', () => {
      const result = checkWind('15024GP50KT')
      const expected = {
        isCorrect: false,
        reason: 'Letter P should be used only for speed over 99 knots.',
        info: {
          windDirection: '150',
          windSpeed: '24',
        }
      }
      expect(result).toStrictEqual(expected)
    })
  })

  describe('Testing correct inputs', () => {

    test('Direction VRB', () => {
      const result = checkWind('VRB24KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is VRB, average wind speed is 24 knots.',
        info: {
          windDirection: 'VRB',
          windSpeed: '24',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Calm wind', () => {
      const result = checkWind('00000KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is 000, average wind speed is 00 knots.',
        info: {
          windDirection: '000',
          windSpeed: '00',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction and speed', () => {
      const result = checkWind('15024KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is 150, average wind speed is 24 knots.',
        info: {
          windDirection: '150',
          windSpeed: '24',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction and speed over 99 kt', () => {
      const result = checkWind('150P99KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is 150, average wind speed is over 99 knots.',
        info: {
          windDirection: '150',
          windSpeed: '99',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction, speed and guts', () => {
      const result = checkWind('15005G24KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is 150, average wind speed is 05 knots and there are guts of 24 knots.',
        info: {
          windDirection: '150',
          windSpeed: '05',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction, normal speed and guts over 99kt', () => {
      const result = checkWind('15005GP99KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is 150, average wind speed is 05 knots and there are guts of over 99 knots.',
        info: {
          windDirection: '150',
          windSpeed: '05',
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction, speed and guts over 99kt', () => {
      const result = checkWind('150P99GP99KT')
      const expected = {
        isCorrect: true,
        reason: 'Average wind direction is 150, average wind speed is over 99 knots and there are guts of over 99 knots.',
        info: {
          windDirection: '150',
          windSpeed: '99',
        }
      }
      expect(result).toStrictEqual(expected)
    })
  })
})