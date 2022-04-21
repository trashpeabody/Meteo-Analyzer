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

interface OptionalCheck {
    matches: boolean,
    correct: boolean
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
    private get lastItem() {
        return this.items[this.items.length - 1]
    }
    private isLastCorrect(): boolean {
        return this.lastItem.result.isCorrect
    }
    checkCompulsory(term: string, check: CheckCompulsory, info?: any): boolean {
        this.addItem(term, check(term, info))
        return this.isLastCorrect()
    }
    checkOptional(term: string, check: CheckOptional, info?: any): OptionalCheck {
        const result: OptionalResult = check(term, info)
        if (result.matches) this.addItem(term, result.result)
        return {
            matches: result.matches, correct: result.result.isCorrect
        }
    }
}