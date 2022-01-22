import {Result} from "./interfaces"

const checkDate = (date: string): Result => {
  const dateRegExp = /^[0-3][0-9][0-2][0-9][0-5][0-9][Z]$/
  if (dateRegExp.test(date)){
    return {
      result : 'Month day and Zulu time of the message.',
      isCorrect : true
    }
  } else {
    return {
      result : 'Date does not follow the expected format (DDHHMMZ)',
      isCorrect : false
    }
  }
}

export default checkDate
