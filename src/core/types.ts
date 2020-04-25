
export interface MatchResult {
    [key: number]: string
    index  : number
    input  : string
    pattern: string | RegExp
}

export const createMatchResult =
    (matches: string[], index: number, input: string, pattern: string | RegExp) =>
        <MatchResult>{ ...matches, index, input, pattern }

export const endOfMatchResult = (match: MatchResult) =>
    match.index + match[0].length

export type SearchFunc  = (input: string, inputLower: string, prev: MatchResult) => MatchResult | null
export type ReplaceFunc = (match: MatchResult) => string

export interface VectorReplace {
    params        : Params
    text          : string
    textLower     : string
    searchStrings : string[]
    replaceStrings: string[]
    searchFuncs   : SearchFunc[]
    replaceFuncs  : ReplaceFunc[]
    matches       : MatchResult[]
}

export const createVectorReplace = () => <VectorReplace>({
    params        : createParams(),
    text          : '',
    textLower     : '',
    searchStrings : [],
    replaceStrings: [],
    searchFuncs   : [],
    replaceFuncs  : [],
    matches       : []
})

export interface Params {
    useRegExp         : boolean
    ignoreCaseSearch  : boolean
    ignoreBangSearch  : boolean
    ignoreBangReplace : boolean
    ignoreEmptyReplace: boolean
    loopSearch        : boolean
    loopReplace       : boolean
    justSearch        : boolean
}

export const createParams = () => <Params>({
    useRegExp         : false,
    ignoreCaseSearch  : false,
    ignoreBangSearch  : false,
    ignoreBangReplace : false,
    ignoreEmptyReplace: false,
    loopSearch        : false,
    loopReplace       : false,
    justSearch        : false
})
