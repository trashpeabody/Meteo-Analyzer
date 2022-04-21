import { checkWindVar } from "../modules/variableWind"

describe('Test Variable Wind module', () => {

  test('Incorrect format', () => {
    const result = checkWindVar('GGGG', { avgWindDirection: '', avgWindSpeed: '' })
    const expected = false
    expect(result.matches).toBe(expected)
  })

  test('Average wind is VRB', () => {
    const result = checkWindVar('040V150', { avgWindDirection: 'VRB', avgWindSpeed: '' })
    const expected = {
      isCorrect: false,
      reason: 'Variable direction wind term cannot be reported when average wind direction is VRB'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Average wind is lower than 3 kt', () => {
    const result = checkWindVar('040V150', { avgWindDirection: '140', avgWindSpeed: '2' })
    const expected = {
      isCorrect: false,
      reason: 'Variable direction speed cannot be reported when wind speed is lower than 3 knots'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('First direction reported in steps different than 10º', () => {
    const result = checkWindVar('045V150', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: false,
      reason: 'Wind direction must be reported in steps of 10º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('First direction is 0º', () => {
    const result = checkWindVar('000V150', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: false,
      reason: 'Wind direction must be bigger than 0º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('First direction is 360', () => {
    const result = checkWindVar('360V150', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: false,
      reason: 'Wind direction must be lower than 360º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Second direction reported in steps different than 10º', () => {
    const result = checkWindVar('040V155', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: false,
      reason: 'Wind direction must be reported in steps of 10º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Second direction is 0º', () => {
    const result = checkWindVar('040V000', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: false,
      reason: 'Wind direction must be bigger than 0º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Second direction is 360', () => {
    const result = checkWindVar('040V360', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: false,
      reason: 'Wind direction must be lower than 360º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Difference between directions is lower than 60º', () => {
    let result = checkWindVar('040V080', { avgWindDirection: '140', avgWindSpeed: '5' })
    let expected = {
      isCorrect: false,
      reason: 'Difference between the 2 directions must be bigger than 60º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)

    result = checkWindVar('350V010', { avgWindDirection: '140', avgWindSpeed: '5' })
    expected = {
      isCorrect: false,
      reason: 'Difference between the 2 directions must be bigger than 60º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Difference between directions is bigger than 180º', () => {
    let result = checkWindVar('040V230', { avgWindDirection: '140', avgWindSpeed: '5' })
    let expected = {
      isCorrect: false,
      reason: 'Difference between the 2 directions must be lower than 180º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)

    result = checkWindVar('310V140', { avgWindDirection: '140', avgWindSpeed: '5' })
    expected = {
      isCorrect: false,
      reason: 'Difference between the 2 directions must be lower than 180º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })

  test('Correct variable wind', () => {
    const result = checkWindVar('310V050', { avgWindDirection: '140', avgWindSpeed: '5' })
    const expected = {
      isCorrect: true,
      reason: 'Wind direction is changing between 310º and 050º'
    }
    expect(result.matches).toBe(true)
    expect(result.result).toStrictEqual(expected)
  })
})