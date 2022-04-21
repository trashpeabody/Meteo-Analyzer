import { Result, OptionalResult, CheckOptional } from './types'

interface WindVarInfo {
  avgWindDirection: string,
  avgWindSpeed: string
}

const checkPrevCondition = (info: WindVarInfo): Result => {
  if (info.avgWindDirection === 'VRB') {
    return {
      isCorrect: false,
      reason: 'Variable direction wind term cannot be reported when average wind direction is VRB'
    }
  }
  if (parseInt(info.avgWindSpeed) < 3) {
    return {
      isCorrect: false,
      reason: 'Variable direction speed cannot be reported when wind speed is lower than 3 knots'
    }
  }
  return {
    isCorrect: true,
    reason: ''
  }
}

const checkWindDirection = (direction: string): Result => {
  if (direction.charAt(2) !== '0') {
    return {
      isCorrect: false,
      reason: 'Wind direction must be reported in steps of 10º'
    }
  }
  if (parseInt(direction) <= 0) {
    return {
      isCorrect: false,
      reason: 'Wind direction must be bigger than 0º'
    }
  }
  if (parseInt(direction) >= 360) {
    return {
      isCorrect: false,
      reason: 'Wind direction must be lower than 360º'
    }
  }
  return {
    isCorrect: true,
    reason: ''
  }
}

const checkDifference = (direction1: string, direction2: string): Result => {
  let diff: number
  if (Number(direction1) < Number(direction2)) {
    diff = Number(direction2) - Number(direction1)
  } else {
    diff = 360 - Number(direction1) + Number(direction2)
  }

  if (diff < 60) {
    return {
      isCorrect: false,
      reason: 'Difference between the 2 directions must be bigger than 60º'
    }
  }
  if (diff > 180) {
    return {
      isCorrect: false,
      reason: 'Difference between the 2 directions must be lower than 180º'
    }
  }

  return {
    isCorrect: true,
    reason: ''
  }
}

export const checkWindVar: CheckOptional = (windVar: string, info: WindVarInfo): OptionalResult => {
  const varWindRegExp = /^(\d{3})(V)(\d{3})$/
  let result: Result

  if (!varWindRegExp.test(windVar))
    return {
      matches: false,
      result: {
        isCorrect: true,
        reason: ''
      }
    }

  result = checkPrevCondition(info)
  if (!result.isCorrect)
    return {
      matches: true,
      result: result
    }

  const direction1: string = windVar.slice(0, 3)
  result = checkWindDirection(direction1)
  if (!result.isCorrect)
    return {
      matches: true,
      result: result
    }

  const direction2: string = windVar.slice(4, 7)
  result = checkWindDirection(direction2)
  if (!result.isCorrect)
    return {
      matches: true,
      result: result
    }

  result = checkDifference(direction1, direction2)
  if (!result.isCorrect)
    return {
      matches: true,
      result: result
    }

  return {
    matches: true,
    result: {
      isCorrect: true,
      reason: 'Wind direction is changing between ' + direction1 + 'º and ' + direction2 + 'º'
    }
  }
}
