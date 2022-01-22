import { Result } from './interfaces'

const checkPrevCondition = (avgWindDirection: string, avgWindSpeed: string): Result => {
  if (avgWindDirection === 'VRB') {
    return {
      isCorrect: false,
      result: 'Variable direction speed term and VRB average direction cannot be together.'
    }
  } else if (parseInt(avgWindSpeed) < 3) {
    return {
      isCorrect: false,
      result: 'Variable direction speed cannot be reported when wind speed is lower than 3 knots.'
    }
  }
  return {
    isCorrect: true,
    result: ''
  }
}

const checkWindDirection = (direction: string): Result => {
  if (parseInt(direction.charAt(2)) !== 0) {
    return {
      isCorrect: false,
      result: 'Wind direction must be reported in steps of 10º'
    }
  } else if (parseInt(direction) === 0) {
    return {
      isCorrect: false,
      result: 'Wind direction must be bigger than 0º'
    }
  } else if (parseInt(direction) >= 360) {
    return {
      isCorrect: false,
      result: 'Wind direction must be lower than 360º'
    }
  }
}

const checkDifference = (direction1: string, direction2: string): Result => {
  if (direction1 < direction2) {
    if (Math.abs(parseInt(direction1.slice(0, 3)) - parseInt(direction2.slice(4))) < 60) {
      return {
        isCorrect: false,
        result: 'Difference between the 2 directions must be bigger than 60º'
      }
    } else if (Math.abs(parseInt(direction1.slice(0, 3)) - parseInt(direction2.slice(4))) > 180) {
      return {
        isCorrect: false,
        result: 'Difference between the 2 directions must be lower than 60º'
      }
    }
  } else {
    if ((360 - parseInt(direction1.slice(0, 3))) + parseInt(direction2.slice(4)) < 60) {
      return {
        isCorrect: false,
        result: 'Difference between the 2 directions must be bigger than 60º'
      }
    } else if ((360 - parseInt(direction1.slice(0, 3))) + parseInt(direction2.slice(4)) > 180) {
      return {
        isCorrect: false,
        result: 'Difference between the 2 directions must be lower than 60º'
      }
    }
  }
  return {
    isCorrect: true,
    result: ''
  }
}

const checkWindVar = (windVar: string, avgWindDirection: string, avgWindSpeed: string): Result => {
  const varWindRegExp = /^(\d{3})(V)(\d{3})(=)?$/
  let result: Result
  const direction1: string = windVar.slice(0, 2)
  const direction2: string = windVar.slice(4, 6)

  if (varWindRegExp.test(windVar)) {
    result = checkPrevCondition(avgWindDirection, avgWindSpeed)
    if (result.isCorrect){
      result = checkWindDirection(direction1)
      if (result.isCorrect){
        checkWindDirection(direction2)
        if (result.isCorrect) {
          checkDifference(direction1, direction2)
          if (result.isCorrect) {
            return {
              isCorrect: true,
              result: 'Wind direction is changing between ' + direction1 + ' º and ' + direction2 + 'º'
            }
          }
        }
      }
    }
  }
  return result
}

export default checkWindVar
