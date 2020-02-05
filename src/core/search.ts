import * as types from './types'

export const search = (input: string, searchFuncs: types.SearchFunc[]) => {
    const matches = []

    const gen = generateSearchFunc(searchFuncs)
    let prev = types.createMatchResult([], 0, '')

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
        for (let funcs of searchFuncs) {
            yield funcs
        }
    }
}

export const createSearchFuncs = (searchStrings: string[]) =>
    searchStrings.map(s => (input: string, prev: types.MatchResult) => {
        const index = input.indexOf(s, prev.index)
        return index === -1 ? null : types.createMatchResult([ s ], index, input)
    })
