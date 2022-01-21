let calm
let windExplanation = ''
let error = ''

const checkDirection = (direction, wind) => {
  if (direction === 'VRB') {
    calm = false
    windExplanation += 'Variations from the mean wind direction during the past 10 minutes are either bigger than 180º or they are between 60º and 180º with a wind speed slower than 3 knots. '
  } else {
    if (direction > 360) {
      error += 'Wind direction cannot be bigger than 360º'
    } else if (direction === 0) {
      if (wind.lenght !== 7) {
        error += '000 direction in wind can only be used when speed is also 0 knots (00000KT)'
      } else {
        calm = true
        windExplanation += 'Wind direction is 0 degrees (it is calm)'
      }
    } else {
      if (direction.charAt(2) !== 0) {
        error += 'Wind direction must be reported in steps of 10º'
      } else {
        calm = false
        windExplanation += 'Wind direction is ' + direction + ' degrees'
      }
    }
  }
}

const checkSpeed = (speed, containsP, isVar) => {
  const varSpeed = isVar ? 'There are meaningful speed guts. ' : ''
  if (speed === 0) {
    calm
      ? windExplanation += varSpeed + 'Wind speed is 0 knots'
      : error += 'Wind speed can only be 00 when wind direction is 000'
  } else {
    if (calm) {
      error += 'Wind speed should be 00 when wind direction is 000'
      calm = false
    } else {
      containsP
        ? speed === 99
            ? windExplanation += varSpeed + 'Wind speed is bigger than 99 knots'
            : error += 'Letter P should be used only for speed over 99 knots'
        : windExplanation += varSpeed + 'Wind speed is ' + speed + ' knots'
    }
  }
}

const checkWind = (wind, avgWindDirection, avgWindSpeed, windExplanation, error) => {
  const windRegExp = /^(\d{3}|VRB)(P)?(\d{2})(G)?(P)?(\d{2})?(KT)(=)?$/
  let index = 0

  if (windRegExp.test(wind)) {
    avgWindDirection = wind.slice(index, index + 2)
    index += 3
    checkDirection(avgWindDirection, wind)

    let containsP = false
    if (wind(index) === 'P') {
      containsP = true
      avgWindSpeed = wind.slice(index + 1, index + 2)
      index += 3
    } else {
      avgWindSpeed = wind.slice(index, index + 1)
      index += 2
    }
    checkSpeed(avgWindSpeed, containsP)

    if (wind(index) === 'G') {
      let speedVar = ''
      if (wind(index + 1) === 'P') {
        containsP = true
        speedVar = wind.slice(index + 2, index + 3)
        index += 4
      } else {
        containsP = false
        speedVar = wind.slice(index + 1, index + 2)
        index += 3
      }
      checkSpeed(speedVar, containsP, true)
    }
  }
}

export default checkWind
