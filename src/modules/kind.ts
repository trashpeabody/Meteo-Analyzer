import { CheckCompulsory, Result } from './types'

export const checkKind: CheckCompulsory = (element: String, kind: 'METAR' | 'SPECI'): Result => {
  return (
    element !== kind
      ? {
        isCorrect: false,
        reason: `Message must start with the keyword ${kind}.`
      }
      : {
        isCorrect: true,
        reason: 'Key identifier of the message kind.'
      }
  )
}