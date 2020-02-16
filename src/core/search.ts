import * as types from './types'

export const search = (input: string, searchFuncs: types.SearchFunc[]) => {
    if (searchFuncs.length === 0) return []
    
    const matches = []

    const gen = generateSearchFuncs(searchFuncs)
    let prev  = types.createMatchResult([''], 0, '', '')

    while (true) {
        const func  = gen.next().value
        const match = func(input, prev)
        
        if (match === null) break

        matches.push(match)
        prev = match
    }

    return matches
}

const generateSearchFuncs = function* (searchFuncs: types.SearchFunc[]) {
    while (true) {
        for (let func of searchFuncs) {
            yield func
        }
    }
}

export const createSearchFuncs = (searchStrings: string[], useRegExp: boolean) => {
    const filtered = searchStrings.filter(s => s !== '')
    
    return useRegExp ?
        filtered.map(createRegExpSearchFunc) :
        filtered.map(createNormalSearchFunc)
}

const createNormalSearchFunc = (searchString: string) =>
    (input: string, prev: types.MatchResult) => {
        const index = input.indexOf(searchString, prev.index + prev[0].length)
        return index === -1 ? null : types.createMatchResult([ searchString ], index, input, searchString)
    }

const createRegExpSearchFunc = (searchString: string) =>
    (input: string, prev: types.MatchResult) => {
        const regExp = new RegExp(searchString, 'gu')
        regExp.lastIndex = prev.index + prev[0].length
        const result = regExp.exec(input)
        return result === null ? null : <types.MatchResult>Object.assign(result, { pattern: regExp })
    }
