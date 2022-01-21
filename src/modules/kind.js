const checkKind = (element, kind, result, error) => {
  if (element !== kind) {
    error += 'Message must start with the keyword ' + kind
  } else {
    result += 'Key identifier of the message kind'
    console.log(result)
  }
}

export default checkKind
