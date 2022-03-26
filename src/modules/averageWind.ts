import { Result } from './interfaces'

export interface WindResult {
  windDirection: string,
  windSpeed: string,
  result: Result
}

export const checkWind = (wind: string): WindResult => {
  const windRegExp: RegExp = /^(\d{3}|VRB)(P)?(\d{2})(G)?(P)?(\d{2})?(KT)(=)?$/
  let index: number = 0
  let result: Result
  let windDirection: string = ''
  let windSpeed: string = ''
  let calm: boolean = false

  const checkDirection = (direction: string, wind: string): Result => {
    if (direction === 'VRB') {
      return {
        isCorrect: true,
        result: ''
      }
    }
    if (parseInt(direction) > 360) {
      return {
        isCorrect: false,
        result: 'Wind direction cannot be bigger than 360º'
      }
    }
    if (parseInt(direction) === 0) {
      if (wind.length !== 7) {
        return {
          isCorrect: false,
          result: '0 degrees direction can only be used for calm wind (00000KT)'
        }
      }
      calm = true
      return {
        isCorrect: true,
        result: ''
      }
    }
    if (parseInt(direction.charAt(2)) !== 0) {
      return {
        isCorrect: false,
        result: 'Wind direction must be reported in steps of 10º'
      }
    }
    return {
      isCorrect: true,
      result: ''
    }
  }

  const checkSpeed = (speed: string, containsP: boolean, isVar: boolean = false): Result => {
    if (speed === '00') {
      if (isVar) {
        return {
          isCorrect: false,
          result: 'Speed guts cannot be of 00kt'
        }
      }
      if (calm) {
        return {
          isCorrect: true,
          result: ''
        }
      }
      return {
        isCorrect: false,
        result: 'Wind speed can only be 00 when wind direction is 000'
      }
    }
    if (calm && !isVar) {
      calm = false
      return {
        isCorrect: false,
        result: 'Wind speed must be 00 when wind direction is 000'
      }
    }
    if (containsP) {
      if (parseInt(speed) === 99) {
        return {
          isCorrect: true,
          result: ''
        }
      }
      return {
        isCorrect: false,
        result: 'Letter P should be used only for speed over 99 knots'
      }
    }
    return {
      isCorrect: true,
      result: ''
    }
  }

  if (windRegExp.test(wind)) {
    windDirection = wind.slice(index, index + 3)
    index += 3
    result = checkDirection(windDirection, wind)
    if (result.isCorrect) {
      let averageP: boolean = false
      if (wind.charAt(index) === 'P') {
        averageP = true
        windSpeed = wind.slice(index + 1, index + 3)
        index += 3
      } else {
        windSpeed = wind.slice(index, index + 2)
        index += 2
      }
      result = checkSpeed(windSpeed, averageP)
      if (result.isCorrect) {
        let variableP: boolean = false
        if (wind.charAt(index) === 'G') {
          let speedVar: string = ''
          if (wind.charAt(index + 1) === 'P') {
            variableP = true
            speedVar = wind.slice(index + 2, index + 4)
            index += 4
          } else {
            speedVar = wind.slice(index + 1, index + 3)
            index += 3
          }
          result = checkSpeed(speedVar, variableP, true)
          if (result.isCorrect) {
            return {
              windDirection: windDirection,
              windSpeed: windSpeed,
              result: {
                isCorrect: true,
                result: `Average wind direction is ${windDirection}, average wind speed is ${(averageP) ? 'over 99 knots' : windSpeed + ' knots'} and there are guts of ${(variableP) ? 'over 99 knots' : speedVar + ' knots'}`
              }
            }
          }
          return {
            windDirection: windDirection,
            windSpeed: windSpeed,
            result: result
          }
        }
        return {
          windDirection: windDirection,
          windSpeed: windSpeed,
          result: {
            isCorrect: true,
            result: `Average wind direction is ${windDirection}, average wind speed is ${(averageP) ? 'over 99 knots' : windSpeed + ' knots'}`
          }
        }
      }
    }
    return {
      windDirection: windDirection,
      windSpeed: windSpeed,
      result: result
    }
  }
  return {
    windDirection: windDirection,
    windSpeed: windSpeed,
    result: {
      isCorrect: false,
      result: 'Format expected for average wind is nnn|VRB[P]nnG[P]nnKT'
    }
  }
}
