import { MessageProcessed } from "./types"

export const getArray = (message: String): MessageProcessed => {
  const end = message.indexOf('=')
  return {
    notProcessed: message.slice(end),
    array: message.slice(0, end).toUpperCase()
      .split(' ')
      .map(element =>
        element.replace(/\r?\n/g, ' ')
          .trim())
      .filter(element => element !== '')
  }
}