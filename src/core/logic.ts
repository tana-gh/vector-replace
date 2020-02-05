import * as types   from './types'
import * as search  from './search'
import * as replace from './replace'

export const setInput = (vr: types.VectorReplace, input: string) => {
    vr.text = input
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
    vr.matches = search.search(vr.text, vr.searchFuncs)
}

export const runReplace = (vr: types.VectorReplace) => {
    vr.text = replace.replace(vr.text, vr.replaceStrings, vr.matches)
}
