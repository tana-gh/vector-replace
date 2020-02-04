
export interface MatchResult {
    [key: number]: string
    index: number
    input: string
}

export const createMatchResult =
    (matches: string[], index: number, input: string) =>
        <MatchResult>Object.assign(matches, { index, input })

export interface VectorReplace {
    params        : Params
    input         : string
    searchStrings : string[]
    replaceStrings: string[]
    searchFuncs   : ((input: string, prev: MatchResult) => MatchResult | null)[]
    matches       : MatchResult[]
}

export interface Params {
    useRegExp         : boolean
    ignoreCaseSearch  : boolean
    skipBangSearch    : boolean
    ignoreEmptySearch : boolean
    ignoreEmptyReplace: boolean
    loopSearch        : boolean
    loopReplace       : boolean
    smartReplace      : boolean
}
