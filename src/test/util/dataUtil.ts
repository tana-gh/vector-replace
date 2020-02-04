import * as types from "../../core/types"

export const createVectorReplace = () => <types.VectorReplace>({
    params        : createParams(),
    input         : '',
    searchStrings : [],
    replaceStrings: [],
    searchFuncs   : [],
    matches       : []
})

export const createParams = () => <types.Params>({
    useRegExp         : false,
    ignoreCaseSearch  : false,
    skipBangSearch    : false,
    ignoreEmptySearch : false,
    ignoreEmptyReplace: false,
    loopSearch        : false,
    loopReplace       : false,
    smartReplace      : false
})
