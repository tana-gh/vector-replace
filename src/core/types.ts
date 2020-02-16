
export interface MatchResult {
    [key: number]: string
    index  : number
    input  : string
    pattern: string | RegExp
}

export const createMatchResult =
    (matches: string[], index: number, input: string, pattern: string | RegExp) =>
        <MatchResult>Object.assign(matches, { index, input, pattern })

export type SearchFunc  = (input: string, prev: MatchResult) => MatchResult | null
export type ReplaceFunc = (match: MatchResult) => string

export interface VectorReplace {
    params        : Params
    text          : string
    searchStrings : string[]
    replaceStrings: string[]
    searchFuncs   : SearchFunc[]
    replaceFuncs  : ReplaceFunc[]
    matches       : MatchResult[]
}

export const createVectorReplace = () => <VectorReplace>({
    params        : createParams(),
    text          : '',
    searchStrings : [],
    replaceStrings: [],
    searchFuncs   : [],
    replaceFuncs  : [],
    matches       : []
})

export interface Params {
    useRegExp         : boolean
    ignoreCaseSearch  : boolean
    skipBangSearch    : boolean
    ignoreEmptyReplace: boolean
    loopSearch        : boolean
    justSearch        : boolean
    smartReplace      : boolean
}

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
