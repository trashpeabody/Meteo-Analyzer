const checkDate = (date, result, error) => {
  const dateRegExp = /^[0-3][0-9][0-2][0-9][0-5][0-9][Z]$/
  dateRegExp.test(date)
    ? result += 'Month day and Zulu time of the message.'
    : error += 'Date does not follow the expected format (DDHHMMZ)'
}

export default checkDate
