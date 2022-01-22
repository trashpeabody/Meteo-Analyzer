import {Result} from './interfaces'

let calm: boolean
let windExplanation: string = ''
let error: string = ''

const checkDirection = (direction: string, wind: string): Result => {
  if (direction === 'VRB') {
    calm = false
    return {
      isCorrect: true,
      result: 'Variations from the mean wind direction during the past 10 minutes are either bigger than 180º or they are between 60º and 180º with a wind speed slower than 3 knots. '
    }
  } else {
    if (parseInt(direction) > 360) {
      return {
        isCorrect: false,
        result: 'Wind direction cannot be bigger than 360º'
      }
    } else if (parseInt(direction) === 0) {
      if (wind.length !== 7) {
        return {
          isCorrect: false,
          result: '000 direction in wind can only be used when speed is also 0 knots (00000KT)'
        }
      } else {
        calm = true
        return {
          isCorrect: true,
          result: 'Wind direction is 0 degrees (it is calm)'
        }
      }
    } else {
      if (parseInt(direction.charAt(2)) !== 0) {
        return {
          isCorrect: false,
          result: 'Wind direction must be reported in steps of 10º'
        }
      } else {
        calm = false
        return {
          isCorrect: true,
          result: 'Wind direction is ' + direction + ' degrees'
        }
      }
    }
  }
}

const checkSpeed = (speed: string, containsP: boolean, isVariable: boolean = false): Result => {
  const varSpeed: string = isVariable ? 'There are meaningful speed guts. ' : ''
  if (parseInt(speed) === 0) {
    if (calm){
      return {
        isCorrect: true,
        result: varSpeed + 'Wind speed is 0 knots'
      }
    } else {
      return {
        isCorrect: false,
        result: varSpeed + 'Wind speed can only be 00 when wind direction is 000'
      }
    }
  } else {
    if (calm) {
      calm = false
      return {
        isCorrect: false,
        result: varSpeed + 'Wind speed can only be 00 when wind direction is 000'
      }    
    } else {
      if (containsP){
        if (parseInt(speed) === 99){
          return {
            isCorrect: true,
            result: varSpeed + 'Wind speed is bigger than 99 knots'
          }
        } else {
          return {
            isCorrect: false,
            result: 'Letter P should be used only for speed over 99 knots'
          }
        }
      } else {
        return {
          isCorrect: true,
          result: varSpeed + 'Wind speed is ' + speed + ' knots'
        }
      }
    }
  }
}

interface WindResult {
  windDirection: string,
  windSpeed: string,
  result: Result
}

const checkWind = (wind: string): WindResult => {
  const windRegExp: RegExp = /^(\d{3}|VRB)(P)?(\d{2})(G)?(P)?(\d{2})?(KT)(=)?$/
  let index: number = 0
  let result: Result
  let resultText, windDirection, windSpeed: string = ''

  if (windRegExp.test(wind)) {
    windDirection = wind.slice(index, index + 2)
    index += 3
    result = checkDirection(windDirection, wind)
    if (result.isCorrect) {
      resultText = result.result
      let containsP: boolean = false
      if (wind.charAt(index) === 'P') {
        containsP = true
        windSpeed = wind.slice(index + 1, index + 2)
        index += 3
      } else {
        windSpeed = wind.slice(index, index + 1)
        index += 2
      }
      result = checkSpeed(windSpeed, containsP, false)
      if (result.isCorrect) {
        resultText += result.result
        if (wind.charAt(index) === 'G') {
          let speedVar: string = ''
          if (wind.charAt(index + 1) === 'P') {
            containsP = true
            speedVar = wind.slice(index + 2, index + 3)
            index += 4
          } else {
            containsP = false
            speedVar = wind.slice(index + 1, index + 2)
            index += 3
          }
          result = checkSpeed(speedVar, containsP, true)
          return {
            windDirection: windDirection,
            windSpeed: windSpeed,
            result: {
              isCorrect: result.isCorrect,
              result: result.result + resultText
            }
          }
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

export default checkWind
