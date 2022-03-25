import { Result } from './interfaces'

export const checkAirport = (airport: string): Result => {
  const airportRegExp = /^[A-Z]{4}$/
  return (
    airportRegExp.test(airport)
      ? {
        isCorrect: true,
        result: 'Airport ICAO code'
      }
      : {
        isCorrect: false,
        result: 'Airport code does not follow ICAO format (ZZZZ)'
      }
  )
}
