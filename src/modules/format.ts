export const getArray = (message: String) => {
  return message.toUpperCase()
    .split(' ')
    .map(element =>
      element.replace(/\r?\n/g, ' ')
        .trim())
    .filter(element => element !== '')
}