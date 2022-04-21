export interface Airport {
    icaoCode: string,
    hourly: boolean,
    trend: boolean
}

export interface MessageProcessed {
    notProcessed: string,
    array: string[]
}

export interface Result {
    isCorrect: boolean,
    reason: string,
    info?: any
}

export interface OptionalResult {
    matches: boolean,
    result: Result,
    info?: any
}

export type CheckCompulsory = (term: string, info?: any) => Result
export type CheckOptional = (term: string, info?: any) => OptionalResult

interface ItemResult {
    term: string,
    result: Result
}

export interface Check {
    isCorrect: boolean,
    info?: any
}

export interface OptionalCheck {
    matches: boolean,
    isCorrect: boolean,
    info?: any
}

export class FinalResult {
    items: ItemResult[] = []
    addItem(term: string, result: Result): void {
        const newItem = {
            term: term,
            result: result
        }
        this.items.push(newItem)
    }
    checkCompulsory(term: string, check: CheckCompulsory, info?: any): Check {
        const result: Result = check(term, info)
        this.addItem(term, result)
        return (
            typeof (result.info === 'undefined')
                ? {
                    isCorrect: result.isCorrect
                }
                : {
                    isCorrect: result.isCorrect,
                    info: result.info
                }
        )
    }
    checkOptional(term: string, check: CheckOptional, info?: any): OptionalCheck {
        const result: OptionalResult = check(term, info)
        if (result.matches) this.addItem(term, result.result)
        return (
            typeof (result.info === 'undefined')
                ? {
                    matches: result.matches,
                    isCorrect: result.result.isCorrect
                }
                : {
                    matches: result.matches,
                    isCorrect: result.result.isCorrect,
                    info: result.info
                }
        )
    }
}