import * as types   from './types'
import * as search  from './search'
import * as replace from './replace'

export const setInput = (vr: types.VectorReplace, input: string) => {
    vr.input = input
}

export const setSearchStrings = (vr: types.VectorReplace, searchStr: string) => {
    vr.searchStrings = searchStr.split('\n')
    setSearchFuncs(vr)
}

const setSearchFuncs = (vr: types.VectorReplace) => {
    vr.searchFuncs = search.createSearchFuncs(vr.searchStrings)
}

export const setReplaceStrings = (vr: types.VectorReplace, replaceStr: string) => {
    vr.replaceStrings = replaceStr.split('\n')
}

export const runSearch = (vr: types.VectorReplace) => {
    vr.matches = search.search(vr.input, vr.searchFuncs)
}

export const runReplace = (vr: types.VectorReplace) => {
    vr.input = replace.replace(vr.input, vr.replaceStrings, vr.matches)
}
