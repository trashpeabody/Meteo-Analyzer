import checkPrecision from './visibilityPrecision.js'

const checkVisibility = (visibility, explanation, error) => {
  const visibilityRegExp = /^(\d{4})(=)?$/

  if (visibilityRegExp.test(visibility)) {
    const visibilityValue = visibility.slice(0, 3)
    if (checkPrecision(visibilityValue, error)) {
      explanation += 'Visibility is ' + visibilityValue
    }
  }
}

export default checkVisibility
