import * as types from './types'

export const search = (input: string, searchFuncs: types.SearchFunc[]) => {
    if (searchFuncs.length === 0) return []
    
    const matches = []

    const gen = generateSearchFunc(searchFuncs)
    let prev  = types.createMatchResult([''], 0, '')

    while (true) {
        const func = gen.next().value
        const match = func(input, prev)
        
        if (match === null) break

        matches.push(match)
        prev = match
    }

    return matches
}

const generateSearchFunc = function* (searchFuncs: types.SearchFunc[]) {
    while (true) {
        for (let func of searchFuncs) {
            yield func
        }
    }
}

export const createSearchFuncs = (searchStrings: string[]) =>
    searchStrings
        .filter(s => s !== '')
        .map(s => (input: string, prev: types.MatchResult) => {
            const index = input.indexOf(s, prev.index + prev[0].length)
            return index === -1 ? null : types.createMatchResult([ s ], index, input)
        })
