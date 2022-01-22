import { Result } from './interfaces'

const checkAirport = (airport: string): Result => {
  const airportRegExp = /^[A-Z]{4}$/
  if (airportRegExp.test(airport)){
    return {
      isCorrect : true,
      result : 'Airport ICAO code'
    }
  } else {
    return {
      isCorrect : true,
      result : 'Airport code does not follow ICAO format (ZZZZ)'
    }
  }
}

export default checkAirport
