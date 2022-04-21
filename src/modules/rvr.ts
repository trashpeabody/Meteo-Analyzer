import { CheckCompulsory, Result } from "./types"

const checkRunway = (runway: number): Result => {
  return (runway < 1 || runway > 36
    ? {
      isCorrect: false,
      reason: 'Runway must be between 01 and 36.'
    }
    : {
      isCorrect: true,
      reason: ''
    }
  )
}

const checkValue = (value: string): Result => {
  if (Number(value) < 400) {
    if (value.slice(2) !== '00' && value.slice(2) !== '25' && value.slice(2) !== '50' && value.slice(2) !== '75')
      return {
        isCorrect: false,
        reason: 'When RVR value is lower than 400 it should be reported in steps of 25m.'
      }
  } else if (Number(value) >= 400 && Number(value) < 800) {
    if (value.slice(2) !== '00' && value.slice(2) !== '50')
      return {
        isCorrect: false,
        reason: 'When RVR value is between 400 and 800 it should be reported in steps of 50m.'
      }
  } else {
    if (value.slice(2) !== '00')
      return {
        isCorrect: false,
        reason: 'When RVR value is bigger than 800 it should be reported in steps of 100m.'
      }
  }
  return {
    isCorrect: true,
    reason: ''
  }
}

export const rvrExplanation = (rvr: string): string => {
  let index = 1
  let result = 'RVR is correct and reported for rwy '

  if (rvr.charAt(3) !== '/') {
    result += `${rvr.slice(1, 4)}.`
  } else {
    result += `${rvr.slice(1, 3)}.`
  }

  index = rvr.indexOf('/') + 1
  if (rvr.charAt(index) === 'M') {
    result += ' Actual value is smaller than the maximum measurable value by the available systems.'
    index++
  } else if (rvr.charAt(index) === 'P') {
    result += ' Actual value is bigger than the maximum measurable value by the available systems.'
    index++
  }

  result += ` The measured value is ${rvr.slice(index, index + 4)}.`

  if (rvr.length >= index + 4) {
    switch (rvr.charAt(index + 4)) {
      case 'N':
        result += ' Not significant change has been detected in the last 10 minutes.'
        break
      case 'D':
        result += ' Average RVR has descended more than 100m in the last 10 minutes.'
        break
      case 'U':
        result += ' Average RVR has increased more than 100m in the last 10 minutes.'
        break
    }
  }

  return result
}

export const checkRVR: CheckCompulsory = (rvr: string): Result => {
  const rvrRegExp = /^(R)(\d{2})(R|L|C)?(\/)(P|M)?(\d{4})(N|D|U)?$/

  if (!rvrRegExp.test(rvr))
    return {
      isCorrect: false,
      reason: 'Format expected for average visibility is RDD(R|L|C)/(P|M)VVVV(N|D|U).'
    }

  let result: Result = checkRunway(Number(rvr.slice(1, 3)))
  if (!result.isCorrect)
    return result

  const slash = rvr.indexOf('/')
  let index: number
  rvr.charAt(slash + 1) === 'P' || rvr.charAt(slash + 1) === 'M'
    ? index = slash + 2
    : index = slash + 1

  result = checkValue(rvr.slice(index, index + 4))
  if (!result.isCorrect)
    return result

  return {
    isCorrect: true,
    reason: rvrExplanation(rvr)
  }
}