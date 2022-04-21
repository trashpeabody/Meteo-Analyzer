import { Result, CheckCompulsory } from './types'

export interface WindData {
  windDirection: string,
  windSpeed: string,
}

export const checkWind: CheckCompulsory = (wind: string): Result => {
  const windRegExp: RegExp = /^(\d{3}|VRB)(P)?(\d{2})(G)?(P)?(\d{2})?(KT)$/
  let calm: boolean = false

  const checkDirection = (direction: string, wind: string): Result => {
    console.log(direction, wind)
    if (direction === 'VRB') {
      return {
        isCorrect: true,
        reason: ''
      }
    }
    if (parseInt(direction) > 360) {
      return {
        isCorrect: false,
        reason: 'Wind direction cannot be bigger than 360º.'
      }
    }
    if (parseInt(direction) === 0) {
      if (wind.length !== 7) {
        return {
          isCorrect: false,
          reason: '0 degrees direction can only be used for calm wind (00000KT).'
        }
      }
      calm = true
      return {
        isCorrect: true,
        reason: ''
      }
    }
    if (parseInt(direction.charAt(2)) !== 0) {
      return {
        isCorrect: false,
        reason: 'Wind direction must be reported in steps of 10º.'
      }
    }
    return {
      isCorrect: true,
      reason: ''
    }
  }

  const checkSpeed = (speed: string, containsP: boolean, isVar: boolean = false): Result => {

    if (speed === '00') {
      if (isVar) {
        return {
          isCorrect: false,
          reason: 'Speed guts cannot be of 00kt.'
        }
      }
      if (calm) {
        return {
          isCorrect: true,
          reason: ''
        }
      }
      return {
        isCorrect: false,
        reason: 'Wind speed can only be 00 when wind direction is 000.'
      }
    }
    if (calm && !isVar) {
      calm = false
      return {
        isCorrect: false,
        reason: 'Wind speed must be 00 when wind direction is 000.'
      }
    }
    if (containsP) {
      if (parseInt(speed) === 99) {
        return {
          isCorrect: true,
          reason: ''
        }
      }
      return {
        isCorrect: false,
        reason: 'Letter P should be used only for speed over 99 knots.'
      }
    }
    return {
      isCorrect: true,
      reason: ''
    }
  }

  if (!windRegExp.test(wind))
    return {
      isCorrect: false,
      reason: 'Format expected for average wind is nnn|VRB[P]nnG[P]nnKT.',
      info: {
        windDirection: '',
        windSpeed: ''
      }
    }

  let result: Result
  let windDirection: string = wind.slice(0, 0 + 3)

  let index = 3
  result = checkDirection(windDirection, wind)
  if (!result.isCorrect)
    return {
      isCorrect: result.isCorrect,
      reason: result.reason,
      info: {
        windDirection: windDirection,
        windSpeed: ''
      }
    }

  let windSpeed: string
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
  if (!result.isCorrect)
    return {
      isCorrect: result.isCorrect,
      reason: result.reason,
      info: {
        windDirection: windDirection,
        windSpeed: windSpeed
      }
    }

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
    if (!result.isCorrect)
      return {
        isCorrect: result.isCorrect,
        reason: result.reason,
        info: {
          windDirection: windDirection,
          windSpeed: windSpeed,
        }
      }
    return {
      isCorrect: true,
      reason: `Average wind direction is ${windDirection}, average wind speed is ${(averageP) ? 'over 99 knots' : windSpeed + ' knots'} and there are guts of ${(variableP) ? 'over 99 knots' : speedVar + ' knots'}.`,
      info: {
        windDirection: windDirection,
        windSpeed: windSpeed,
      }
    }
  }

  return {
    isCorrect: true,
    reason: `Average wind direction is ${windDirection}, average wind speed is ${(averageP) ? 'over 99 knots' : windSpeed + ' knots'}.`,
    info: {
      windDirection: windDirection,
      windSpeed: windSpeed
    }
  }
}
