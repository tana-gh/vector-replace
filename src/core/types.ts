
export interface MatchResult {
    [key: number]: string
    index  : number
    input  : string
    pattern: string | RegExp
    order  : number
}

export const createMatchResult =
    (matches: string[], index: number, input: string, pattern: string | RegExp, order: number) =>
        <MatchResult>{ ...matches, index, input, pattern, order }

export const endOfMatchResult = (match: MatchResult) =>
    match.index + match[0].length

export type SearchFunc  = (input: string, inputLower: string, prev: MatchResult) => MatchResult | null
export type ReplaceFunc = (match: MatchResult) => string

export interface ProcessObject {
    isCancelled: boolean
}

export interface VectorReplace {
    params        : Params
    text          : string
    textLower     : string
    selections    : number[]
    searchStrings : string[]
    replaceStrings: string[]
    searchFuncs   : SearchFunc[]
    replaceFuncs  : ReplaceFunc[]
    matches       : MatchResult[]
    processObject : ProcessObject | undefined
}

export const createVectorReplace = () => <VectorReplace>({
    params        : createParams(),
    text          : '',
    textLower     : '',
    selections    : [],
    searchStrings : [],
    replaceStrings: [],
    searchFuncs   : [],
    replaceFuncs  : [],
    matches       : [],
    processObject : undefined
})

export interface Params {
    selectionSearch   : boolean
    useRegExp         : boolean
    captureWhole      : boolean
    ignoreCaseSearch  : boolean
    ignoreBangSearch  : boolean
    ignoreBangReplace : boolean
    ignoreEmptyReplace: boolean
    loopSearch        : boolean
    loopReplace       : boolean
    justSearch        : boolean
    matrixSearch      : boolean
}

export const createParams = () => <Params>({
    selectionSearch   : false,
    useRegExp         : false,
    captureWhole      : false,
    ignoreCaseSearch  : false,
    ignoreBangSearch  : false,
    ignoreBangReplace : false,
    ignoreEmptyReplace: false,
    loopSearch        : false,
    loopReplace       : false,
    justSearch        : false,
    matrixSearch      : false
})

export const resetProcessObject = (vr: VectorReplace) => {
    if (vr.processObject) vr.processObject.isCancelled = true
    vr.processObject = { isCancelled: false }
}

export const clearProcessObject = (vr: VectorReplace, po: ProcessObject) => {
    if (vr.processObject === po) vr.processObject = undefined
}
