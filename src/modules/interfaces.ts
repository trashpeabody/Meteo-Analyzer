export interface Result {
    isCorrect: boolean,
    result: string
}

export interface Airport {
    icaoCode: string,
    hourly: boolean,
    trend: boolean
}