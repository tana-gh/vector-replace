import * as types   from './types'
import * as search  from './search'
import * as replace from './replace'

export const setInput = (vr: types.VectorReplace, input: string) => {
    vr.text      = input
    vr.textLower = input.toLowerCase()
}

export const setSearchStrings = (vr: types.VectorReplace, searchStr: string) => {
    vr.searchStrings = searchStr.split('\n')
    setSearchFuncs(vr)
}

export const setSearchFuncs = (vr: types.VectorReplace) => {
    vr.searchFuncs = search.createSearchFuncs(vr.searchStrings, vr.params)
}

export const setReplaceStrings = (vr: types.VectorReplace, replaceStr: string) => {
    vr.replaceStrings = replaceStr.split('\n')
    setReplaceFuncs(vr)
}

export const setReplaceFuncs = (vr: types.VectorReplace) => {
    vr.replaceFuncs = replace.createReplaceFuncs(vr.replaceStrings)
}

export const runSearch = (vr: types.VectorReplace) => {
    vr.matches = search.search(vr.text, vr.textLower, vr.searchFuncs)
}

export const runReplace = (vr: types.VectorReplace) => {
    vr.text = replace.replace(vr.text, vr.replaceFuncs, vr.matches)
}

export const setUseRegExp = (vr: types.VectorReplace, value: boolean) => {
    vr.params.useRegExp = value
}

export const setIgnoreCaseSearch = (vr: types.VectorReplace, value: boolean) => {
    vr.params.ignoreCaseSearch = value
}
