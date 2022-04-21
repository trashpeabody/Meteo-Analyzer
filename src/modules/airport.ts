import { CheckCompulsory, Result } from './types'

export const checkAirport: CheckCompulsory = (airport: string): Result => {
  return (
    /^[A-Z]{4}$/.test(airport)
      ? {
        isCorrect: true,
        reason: 'Airport ICAO code.'
      }
      : {
        isCorrect: false,
        reason: 'Airport code does not follow ICAO format (ZZZZ).'
      }
  )

}