import * as types   from './types'
import * as search  from './search'
import * as replace from './replace'

export const setInput = (vr: types.VectorReplace, input: string) => {
    vr.text      = input
    vr.textLower = input.toLowerCase()
}

export const setSelections = (vr: types.VectorReplace, selections: number[]) => {
    vr.selections = selections
}

export const setSearchStrings = (vr: types.VectorReplace, searchStr: string) => {
    vr.searchStrings = searchStr.split(/\n|\r\n/)
    setSearchFuncs(vr)
}

export const setSearchFuncs = (vr: types.VectorReplace) => {
    vr.searchFuncs = search.createSearchFuncs(vr.searchStrings, vr.params)
}

export const setReplaceStrings = (vr: types.VectorReplace, replaceStr: string) => {
    vr.replaceStrings = replaceStr.split(/\n|\r\n/)
    setReplaceFuncs(vr)
}

export const setReplaceFuncs = (vr: types.VectorReplace) => {
    vr.replaceFuncs = replace.createReplaceFuncs(vr.replaceStrings, vr.params)
}

export const runSearch = (vr: types.VectorReplace) => {
    vr.matches = search.search(vr.text, vr.textLower, vr.selections, vr.searchFuncs, vr.params)
}

export const runReplace = (vr: types.VectorReplace) => {
    vr.text = replace.replace(vr.text, vr.replaceFuncs, vr.matches, vr.params)
}

export const setSelectionSearch = (vr: types.VectorReplace, value: boolean) => {
    vr.params.selectionSearch = value
}

export const setUseRegExp = (vr: types.VectorReplace, value: boolean) => {
    vr.params.useRegExp = value
}

export const setIgnoreCaseSearch = (vr: types.VectorReplace, value: boolean) => {
    vr.params.ignoreCaseSearch = value
}

export const setIgnoreBangSearch = (vr: types.VectorReplace, value: boolean) => {
    vr.params.ignoreBangSearch = value
}

export const setIgnoreBangReplace = (vr: types.VectorReplace, value: boolean) => {
    vr.params.ignoreBangReplace = value
}

export const setIgnoreEmptyReplace = (vr: types.VectorReplace, value: boolean) => {
    vr.params.ignoreEmptyReplace = value
}

export const setLoopSearch = (vr: types.VectorReplace, value: boolean) => {
    vr.params.loopSearch = value
}

export const setLoopReplace = (vr: types.VectorReplace, value: boolean) => {
    vr.params.loopReplace = value
}

export const setJustSearch = (vr: types.VectorReplace, value: boolean) => {
    vr.params.justSearch = value
}
