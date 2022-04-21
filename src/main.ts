import { checkAirport } from './modules/airport'
import { checkDate } from './modules/date'
import { checkKind } from './modules/kind'
import { checkWind } from './modules/averageWind.js'
import { MessageProcessed, FinalResult, Check, OptionalCheck } from './modules/types'
import { getArray } from './modules/format'
import { checkWindVar } from './modules/variableWind'
import { checkVisibility } from './modules/averageVisibility'

export const analyse = (kind: 'METAR' | 'SPECI' = 'METAR'): FinalResult => {
  const message = 'METAR LEMD 210900Z 34003KT 310V020 CAVOK M01/M03 Q1026 NOSIG='
  let finalResult = new FinalResult
  let index = 0
  let check: Check
  let optionalCheck: OptionalCheck
  const messageProcessed: MessageProcessed = getArray(message)

  if (messageProcessed.notProcessed.length > 0)
    finalResult.addItem(
      messageProcessed.notProcessed,
      { isCorrect: false, reason: 'Any content beyond the first = will be ignored as this is considered the end of the message' }
    )

  const messageArray: string[] = messageProcessed.array

  if (!finalResult.checkCompulsory(
    messageArray[index],
    checkKind,
    kind
  )) return finalResult
  index++

  if (messageArray[index] === 'COR') {
    finalResult.addItem(
      messageArray[index],
      {
        isCorrect: true,
        reason: 'This is a correction from a previously sent METAR or SPECI'
      })
    index++
  }

  if (!finalResult.checkCompulsory(messageArray[index], checkAirport))
    return finalResult
  index++

  if (!finalResult.checkCompulsory(messageArray[index], checkDate))
    return finalResult
  index++

  if (messageArray[index] === 'AUTO') {
    finalResult.addItem(messageArray[index],
      {
        isCorrect: true,
        reason: 'This is an automatically generated METAR or SPECI'
      })
    index++
  }

  if (messageArray[index] === 'NIL') {
    finalResult.addItem(messageArray[index],
      {
        isCorrect: true,
        reason: 'Message has been lost or forecast has not been done'
      })
    index++
    if (messageArray.length >= index) {
      finalResult.addItem(
        messageArray.slice(index).toString(),
        {
          isCorrect: false,
          reason: 'NIL should mean the end of the message and therefore should be followed by ='
        }
      )
      return finalResult
    }
  }

  check = finalResult.checkCompulsory(messageArray[index], checkWind)
  if (!check.isCorrect)
    return finalResult
  index++

  optionalCheck = finalResult.checkOptional(messageArray[index], checkWindVar, check.info)
  if (optionalCheck.matches) {
    if (!optionalCheck.isCorrect) return finalResult
    index++
  }

  if (messageArray[index] === 'CAVOK') {
    finalResult.addItem(messageArray[index],
      {
        isCorrect: true,
        reason: 'No Visibility, RVR, Present weather, clouds nor vertical visibility can be included in the message.'
      })
    index++
  } else {
    if (!finalResult.checkCompulsory(messageArray[index], checkVisibility, messageArray[index - 1]))
      return finalResult
    index++

  }

  return finalResult

}
