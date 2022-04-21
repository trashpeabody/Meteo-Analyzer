import { Result } from './types'

export const checkPrecision = (visibility: string): Result => {
  const value = Number(visibility)

  if (value >= 0 && value < 800) {
    if (visibility.slice(2, 4) !== '50' && visibility.slice(2, 4) !== '00')
      return {
        isCorrect: false,
        reason: 'When visibility is lower than 800, step reporting should be 50.'
      }
  } else if (value < 5000) {
    if (visibility.slice(2, 4) !== '00')
      return {
        isCorrect: false,
        reason: 'When visibility is bigger than 800 and lower than 5000, step reporting should be 100.'
      }
  } else {
    if (visibility !== '9999' && visibility.slice(1, 4) !== '000')
      return {
        isCorrect: false,
        reason: 'When visibility is bigger than 5000, step reporting should be 1000.'
      }
  }
  return {
    isCorrect: true,
    reason: `Average visibility value is ${visibility}.`
  }
}
