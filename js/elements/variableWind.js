const checkPrevCondition = (avgWindDirection, avgWindSpeed, error) => {
  if (avgWindDirection === 'VRB') {
    error += 'Variable direction speed term and VRB average direction cannot be together.'
    return false
  } else if (avgWindSpeed < 3) {
    error += 'Variable direction speed cannot be reported when wind speed is lower than 3 knots.'
    return false
  }
  return true
}

const checkWindDirection = (direction, error) => {
  if (direction.charAt(2) !== 0) {
    error += 'Wind direction must be reported in steps of 10º'
  } else if (direction === 0) {
    error += 'Wind direction must be bigger than 0º'
  } else if (direction >= 360) {
    error += 'Wind direction must be lower than 360º'
  }
}

const checkDifference = (direction1, direction2, error) => {
  if (direction1 < direction2) {
    if (Math.abs(parseInt(direction1.slice(0, 3)) - parseInt(direction2.slice(4))) < 60) {
      error += 'Difference between the 2 directions must be bigger than 60º'
      return false
    } else if (Math.abs(parseInt(direction1.slice(0, 3)) - parseInt(direction2.slice(4))) > 180) {
      error += 'Difference between the 2 directions must be lower than 60º'
      return false
    }
  } else {
    if ((360 - parseInt(direction1.slice(0, 3))) + parseInt(direction2.slice(4)) < 60) {
      error += 'Difference between the 2 directions must be bigger than 60º'
      return false
    } else if ((360 - parseInt(direction1.slice(0, 3))) + parseInt(direction2.slice(4)) > 180) {
      error += 'Difference between the 2 directions must be lower than 60º'
      return false
    }
  }
  return true
}

const checkWindVar = (windVar, avgWindDirection, avgWindSpeed, explanation, error) => {
  const varWindRegExp = /^(\d{3})(V)(\d{3})(=)?$/

  if (varWindRegExp.test(windVar)) {
    if (!checkPrevCondition(avgWindDirection, avgWindSpeed, error)) {
      return
    }

    const direction1 = windVar.slice(0, 2)
    const direction2 = windVar.slice(4, 6)

    if (!checkWindDirection(direction1, error) || !checkWindDirection(direction2, error)) {
      return
    }

    if (!checkDifference(direction1, direction2, error)) {
      error += 'Error'
    } else {
      explanation += 'Wind direction is changing between ' + direction1 + ' º and ' + direction2 + 'º'
    }
  }
}

export default checkWindVar
