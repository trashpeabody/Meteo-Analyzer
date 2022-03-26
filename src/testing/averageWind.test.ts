import { checkWind } from "../modules/averageWind";
import { WindResult } from "../modules/averageWind";

describe('Test average wind module', () => {

  describe('Testing incorrect inputs', () => {

    test('Incorrect format', () => {
      const result = checkWind('')
      const expected: WindResult = {
        windDirection: '',
        windSpeed: '',
        result: {
          isCorrect: false,
          result: 'Format expected for average wind is nnn|VRB[P]nnG[P]nnKT'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction does not follow steps of 10º', () => {
      const result = checkWind('30408KT')
      const expected = {
        windDirection: '304',
        windSpeed: '',
        result: {
          isCorrect: false,
          result: 'Wind direction must be reported in steps of 10º'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction is bigger than 360º', () => {
      const result = checkWind('37008KT')
      const expected = {
        windDirection: '370',
        windSpeed: '',
        result: {
          isCorrect: false,
          result: 'Wind direction cannot be bigger than 360º'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction calm but speed with P', () => {
      const result = checkWind('000P99KT')
      const expected = {
        windDirection: '000',
        windSpeed: '',
        result: {
          isCorrect: false,
          result: '0 degrees direction can only be used for calm wind (00000KT)'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Direction not calm and speed 0 kt', () => {
      const result = checkWind('15000KT')
      const expected = {
        windDirection: '150',
        windSpeed: '00',
        result: {
          isCorrect: false,
          result: 'Wind speed can only be 00 when wind direction is 000'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Calm direction and speed not calm', () => {
      const result = checkWind('00002KT')
      const expected = {
        windDirection: '000',
        windSpeed: '02',
        result: {
          isCorrect: false,
          result: 'Wind speed must be 00 when wind direction is 000'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Speed using P but value less than 99', () => {
      const result = checkWind('150P55KT')
      const expected = {
        windDirection: '150',
        windSpeed: '55',
        result: {
          isCorrect: false,
          result: 'Letter P should be used only for speed over 99 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Speed guts (G) is 00', () => {
      const result = checkWind('15024G00KT')
      const expected = {
        windDirection: '150',
        windSpeed: '24',
        result: {
          isCorrect: false,
          result: 'Speed guts cannot be of 00kt'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Speed guts (G) using P but value less than 99', () => {
      const result = checkWind('15024GP50KT')
      const expected = {
        windDirection: '150',
        windSpeed: '24',
        result: {
          isCorrect: false,
          result: 'Letter P should be used only for speed over 99 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })
  })

  describe('Testing correct inputs', () => {

    test('Direction VRB', () => {
      const result = checkWind('VRB24KT')
      const expected = {
        windDirection: 'VRB',
        windSpeed: '24',
        result: {
          isCorrect: true,
          result: 'Average wind direction is VRB, average wind speed is 24 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Calm wind', () => {
      const result = checkWind('00000KT')
      const expected = {
        windDirection: '000',
        windSpeed: '00',
        result: {
          isCorrect: true,
          result: 'Average wind direction is 000, average wind speed is 00 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction and speed', () => {
      const result = checkWind('15024KT')
      const expected = {
        windDirection: '150',
        windSpeed: '24',
        result: {
          isCorrect: true,
          result: 'Average wind direction is 150, average wind speed is 24 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction and speed over 99 kt', () => {
      const result = checkWind('150P99KT')
      const expected = {
        windDirection: '150',
        windSpeed: '99',
        result: {
          isCorrect: true,
          result: 'Average wind direction is 150, average wind speed is over 99 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction, speed and guts', () => {
      const result = checkWind('15005G24KT')
      const expected = {
        windDirection: '150',
        windSpeed: '05',
        result: {
          isCorrect: true,
          result: 'Average wind direction is 150, average wind speed is 05 knots and there are guts of 24 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction, normal speed and guts over 99kt', () => {
      const result = checkWind('15005GP99KT')
      const expected = {
        windDirection: '150',
        windSpeed: '05',
        result: {
          isCorrect: true,
          result: 'Average wind direction is 150, average wind speed is 05 knots and there are guts of over 99 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })

    test('Normal direction, speed and guts over 99kt', () => {
      const result = checkWind('150P99GP99KT')
      const expected = {
        windDirection: '150',
        windSpeed: '99',
        result: {
          isCorrect: true,
          result: 'Average wind direction is 150, average wind speed is over 99 knots and there are guts of over 99 knots'
        }
      }
      expect(result).toStrictEqual(expected)
    })
  })
})