import { Result, CheckCompulsory } from "./types"

const checkDay = (day: number) => {
  return (day >= 1 && day <= 31)
}

const checkHour = (hour: number) => {
  return (hour >= 0 && hour <= 23)
}

const checkMin = (min: number) => {
  return (min === 0 || min === 30)
}

export const checkDate: CheckCompulsory = (date: string): Result => {

  if (!/^[0-3][0-9][0-2][0-9][0-5][0-9][Z]$/.test(date))
    return {
      reason: 'Date does not follow the expected format (DDHHMMZ).',
      isCorrect: false
    }

  const day = Number(date.slice(0, 2))
  if (!checkDay(day))
    return {
      reason: 'Day must be between 1 and 31.',
      isCorrect: false
    }

  const hour = Number(date.slice(2, 4))
  if (!checkHour(hour))
    return {
      reason: 'Hour must be between 0 and 23.',
      isCorrect: false
    }

  const min = Number(date.slice(4, 6))
  if (!checkMin(min))
    return {
      reason: 'Min must be 0 or 30.',
      isCorrect: false
    }

  return {
    reason: 'Month day and Zulu time of the message.',
    isCorrect: true
  }
}