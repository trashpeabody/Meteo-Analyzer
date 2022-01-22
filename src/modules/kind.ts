import { Result } from './interfaces'

const checkKind = (element: string, kind: string): Result => {
  if (element !== kind) {
    return {
      isCorrect : false,
      result : 'Message must start with the keyword ' + kind
    }
  } else{
    return {
      isCorrect : true,
      result : 'Key identifier of the message kind '
    }
  }
}

export default checkKind
