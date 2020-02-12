
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
    justSearch        : boolean
    smartReplace      : boolean
}

export const createVectorReplace = () => <VectorReplace>({
    params        : createParams(),
    text          : '',
    searchStrings : [],
    replaceStrings: [],
    searchFuncs   : [],
    matches       : []
})

export const createParams = () => <Params>({
    useRegExp         : false,
    ignoreCaseSearch  : false,
    skipBangSearch    : false,
    ignoreEmptySearch : false,
    ignoreEmptyReplace: false,
    loopSearch        : false,
    justSearch        : false,
    smartReplace      : false
})
