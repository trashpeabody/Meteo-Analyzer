const checkPrecision = (visibility, error) => {
  const value = parseInt(visibility)

  if (value >= 0 && value < 800) {
    if (parseInt(visibility.slice(2, 4)) !== 50 && parseInt(visibility.slice(2, 4)) !== 0) {
      error += 'When visibility is lower than 800, step reporting should be 50'
      return false
    }
  } else if (value < 5000) {
    if (visibility.charAt(2) !== 0 || visibility.charAt(3) !== 0) {
      error += 'When visibility is bigger than 800 and lower than 5000, step reporting should be 100'
      return false
    }
  } else {
    if (visibility.charAt(2) !== 0 || visibility.charAt(3) !== 0 || visibility.charAt(1) !== 0) {
      error += 'When visibility is bigger than 5000, step reporting should be 1000'
      return false
    }
  }
  return true
}

export default checkPrecision
