const checkAirport = (airport, airportInfo, explanation, error) => {
  const airportRegExp = /^[A-Z]{4}$/
  airportRegExp.test(airport)
    ? explanation += 'Airport ICAO code'
    : error += 'Airport code does not follow ICAO format (ZZZZ)'

  // TODO database airports. Now: every airport is hourly and no trend
  airportInfo = {
    icaoCode: airport,
    hourly: true,
    trend: false
  }
}

export default checkAirport
