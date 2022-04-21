import { checkPrecision } from './visibilityPrecision'
import { CheckCompulsory, Result } from './types'

export const checkVisibility: CheckCompulsory = (visibility): Result => {
  const visibilityRegExp = /^(\d{4})(=)?$/

  if (!visibilityRegExp.test(visibility))
    return {
      isCorrect: false,
      reason: 'Format expected for average visibility is VVVV.'
    }
  return checkPrecision(visibility)
}
