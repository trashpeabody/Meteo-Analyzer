import checkAirport from './elements/airport.js'
import checkDate from './elements/date.js'
import checkKind from './elements/kind.js'
import checkWind from './elements/averageWind.js'

const analyseButton = document.querySelector('.analyse')

let error = ''
const messageAnalyzed = [{}]
let messageArray
const airportInfo = {
  icaoCode: 'ZZZZ',
  hourly: true,
  trend: false
}

const getArray = (message) => {
  return message.toUpperCase()
    .split(' ')
    .map(element =>
      element.replace(/\r?\n/g, ' ')
        .trim())
    .filter(element => element !== '')
}

const checkEmpty = () => {
  if (messageArray.length === 0) {
    error += 'Message incomplete, please fill a complete message.'
    return true
  } else {
    return false
  }
}

const analyse = (kind = 'METAR') => {
  const message = 'METAR LEMD 210900Z 34003KT 310V020 CAVOK M01/M03 Q1026 NOSIG='
  const result = ''
  const error = ''
  console.log('called')
  messageArray = getArray(message)
  console.log(messageArray)
  checkKind(messageArray[0], kind, result, error)
  console.log(result)

  if (messageArray[0].toString() === 'COR') {
    messageAnalyzed.push({
      [messageArray[0]]: 'This is a correction from a previously sent METAR or SPECI'
    })
    messageArray.shift()
  }

  checkAirport(messageArray[0])

  checkDate(messageArray[0])

  if (messageArray[0].toString() === 'AUTO') {
    messageAnalyzed.push({
      [messageArray[0]]: 'This is an automatically generated METAR or SPECI'
    })
    messageArray.shift()
  }

  if (messageArray[0].toString() === 'NIL=') {
    messageAnalyzed.push({
      [messageArray[0]]: 'Message has been lost or forecast has not been done'
    })
    return
  }

  const windExplanation = ''
  let avgWindDirection, avgWindSpeed
  checkWind(messageArray[0], avgWindDirection, avgWindSpeed, windExplanation, error)
  if (windExplanation.length > 0) {
    messageAnalyzed.push({
      [messageArray[0]]: windExplanation
    })
  }
}

analyseButton.addEventListener('click', () => {
  analyse()
})
