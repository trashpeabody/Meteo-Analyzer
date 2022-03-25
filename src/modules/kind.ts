import { Result } from './interfaces'

export const checkKind = (element: String, kind: 'METAR' | 'SPECI'): Result => {
  if (element !== kind) {
    return {
      isCorrect: false,
      result: 'Message must start with the keyword ' + kind
    }
  } else {
    return {
      isCorrect: true,
      result: 'Key identifier of the message kind '
    }
  }
}
