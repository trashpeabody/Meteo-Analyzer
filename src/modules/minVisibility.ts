import { OptionalResult, CheckOptional, Result } from "./types"
import { checkPrecision } from './visibilityPrecision'

const checkValue = (minVisibility: number, avgVisibility: number): Result => {
  if (minVisibility === avgVisibility)
    return {
      isCorrect: false,
      reason: `Minimum Visibility and Average Visibility can't have the same value.`
    }
  if (minVisibility < 1500)
    return {
      isCorrect: true,
      reason: ''
    }
  if (minVisibility >= 1500 && minVisibility < 5000 && minVisibility < 0.5 * avgVisibility)
    return {
      isCorrect: true,
      reason: ''
    }
  return {
    isCorrect: false,
    reason: `Min Visibility must be lower than 1500m, or when it's bigger, it should be lower than 5000m and less than half of the average Visibility.`
  }
}

export const checkMinVisibility: CheckOptional = (minVisibility: string, avgVisibility: number): OptionalResult => {

  if (!/^(\d{4})(N|NE|E|SW|S|SW|W|NW)?$/.test(minVisibility))
    return {
      matches: false,
      result: {
        isCorrect: true,
        reason: ''
      }
    }

  let result: Result = checkPrecision(minVisibility.slice(0, 4))
  if (!result.isCorrect)
    return {
      matches: true,
      result: result
    }

  result = checkValue(Number(minVisibility.slice(0, 4)), Number(avgVisibility))
  if (!result.isCorrect)
    return {
      matches: true,
      result: result
    }

  return {
    matches: true,
    result: {
      isCorrect: true,
      reason: `Minimum Visibility is correct and its value is ${minVisibility.slice(0, 4)} ${minVisibility.length > 4 ? `mainly in the ${minVisibility.slice(4)} direction.` : 'in an unknown direction.'}`
    }
  }
}
