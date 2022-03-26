import { checkAirport } from './modules/airport.js'
import { checkDate } from './modules/date.js'
import { checkKind } from './modules/kind'
// import checkWind from './modules/averageWind.js'
import { Result } from './modules/interfaces'
import { getArray } from './modules/format'

// const analyseButton = document.querySelector('.analyse')

// let error = ''
// const messageAnalyzed = [{}]
// let messageArray
// const airportInfo = {
//   icaoCode: 'ZZZZ',
//   hourly: true,
//   trend: false
// }

// const checkEmpty = () => {
//   if (messageArray.length === 0) {
//     error += 'Message incomplete, please fill a complete message.'
//     return true
//   } else {
//     return false
//   }
// }
interface ItemResult {
  term: string,
  result: Result
}

type checkFunction = (term: string, info?: any) => Result

class FinalResult {
  items: ItemResult[] = []
  addItem(term: string, result: Result): void {
    const newItem = {
      term: term,
      result: result
    }
    this.items.push(newItem)
  }
  get lastItem() {
    return this.items[this.items.length - 1]
  }
  private isLastCorrect(): boolean {
    return this.lastItem.result.isCorrect
  }
  checkNewTerm(term: string, check: checkFunction, info?: any): boolean {
    this.addItem(term, check(term, info))
    return this.isLastCorrect()
  }
}

const message: string = 'METAR LEMD 210900Z 34003KT 310V020 CAVOK M01/M03 Q1026 NOSIG='
let finalResult = new FinalResult
let index: number = 0

export const analyse = (kind: 'METAR' | 'SPECI' = 'METAR'): FinalResult => {
  const messageArray: string[] = getArray(message)

  if (!finalResult.checkNewTerm(messageArray[index], checkKind, kind)) return finalResult
  index++

  if (messageArray[index] === 'COR') {
    finalResult.addItem(messageArray[index], { isCorrect: true, result: 'This is a correction from a previously sent METAR or SPECI' })
    index++
  }

  if (!finalResult.checkNewTerm(messageArray[index], checkAirport)) return finalResult
  index++

  if (!finalResult.checkNewTerm(messageArray[index], checkDate)) return finalResult
  index++

  if (messageArray[index] === 'AUTO') {
    finalResult.addItem(messageArray[index], { isCorrect: true, result: 'This is an automatically generated METAR or SPECI' })
    index++
  }

  if (messageArray[index] === 'NIL') {
    finalResult.addItem(messageArray[index], { isCorrect: true, result: 'Message has been lost or forecast has not been done' })
    index++
  }

  return finalResult

  //   const windExplanation = ''
  //   let avgWindDirection, avgWindSpeed
  //   checkWind(messageArray[0], avgWindDirection, avgWindSpeed, windExplanation, error)
  //   if (windExplanation.length > 0) {
  //     messageAnalyzed.push({
  //       [messageArray[0]]: windExplanation
  //     })
  //   }
  // }
}
