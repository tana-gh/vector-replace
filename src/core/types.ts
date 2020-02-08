
export interface MatchResult {
    [key: number]: string
    index: number
    input: string
}

export const createMatchResult =
    (matches: string[], index: number, input: string) =>
        <MatchResult>Object.assign(matches, { index, input })

export type SearchFunc = (input: string, prev: MatchResult) => MatchResult | null

export interface VectorReplace {
    params        : Params
    text          : string
    searchStrings : string[]
    replaceStrings: string[]
    searchFuncs   : SearchFunc[]
    matches       : MatchResult[]
}

export interface Params {
    useRegExp         : boolean
    ignoreCaseSearch  : boolean
    skipBangSearch    : boolean
    ignoreEmptyReplace: boolean
    loopSearch        : boolean
    loopReplace       : boolean
    smartReplace      : boolean
}
