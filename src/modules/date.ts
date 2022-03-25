import { Result } from "./interfaces"

const checkDay = (day: number) => {
  return (day >= 1 && day <= 31)
}

const checkHour = (hour: number) => {
  return (hour >= 0 && hour <= 24)
}

const checkMin = (min: number) => {
  return (min === 0 || min === 30)
}

export const checkDate = (date: string): Result => {
  const dateRegExp = /^[0-3][0-9][0-2][0-9][0-5][0-9][Z]$/
  if (dateRegExp.test(date)) {
    if (checkDay(Number(date.slice(0, 2)))) {
      if (checkHour(Number(date.slice(2, 2)))) {
        if (checkMin(Number(date.slice(4, 2)))) {
          return {
            result: 'Month day and Zulu time of the message.',
            isCorrect: true
          }
        }
        return {
          result: 'Min must be 0 or 30',
          isCorrect: false
        }
      }
      return {
        result: 'Hour must be between 0 and 23',
        isCorrect: false
      }
    }
    return {
      result: 'Day must be between 1 and 31',
      isCorrect: false
    }
  }
  return {
    result: 'Date does not follow the expected format (DDHHMMZ)',
    isCorrect: false
  }
}