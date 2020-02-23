import * as types      from './types'
import * as ignoreBang from './ignoreBang'

export const search = (
    input      : string,
    inputLower : string,
    searchFuncs: types.SearchFunc[],
    params     : types.Params
) => {
    if (searchFuncs.length === 0) return []
    
    if (params.justSearch) {
        return justSearch(input, inputLower, searchFuncs, params)
    }
    else {
        return notJustSearch(input, inputLower, searchFuncs, params)
    }
}

const notJustSearch = (
    input      : string,
    inputLower : string,
    searchFuncs: types.SearchFunc[],
    params     : types.Params
) => {
    const matches = []

    const gen = generateSearchFuncs(searchFuncs, params)
    let prev  = types.createMatchResult([''], 0, '', '')

    while (true) {
        const func = gen.next()

        if (func.done) break

        const match = func.value(input, inputLower, prev)
        
        if (match === null) break

        matches.push(match)
        prev = match
    }

    return matches
}

const justSearch = (
    input      : string,
    inputLower : string,
    searchFuncs: types.SearchFunc[],
    params     : types.Params
) => {
    const dummyParams = { ...params, loopSearch: false }

    let matches = <types.MatchResult[]>[]

    let prev = types.createMatchResult([''], 0, '', '')

    outer:
    while (true) {
        const subMatches = []
        const gen = generateSearchFuncs(searchFuncs, dummyParams)

        while (true) {
            const func = gen.next()

            if (func.done) break

            const match = func.value(input, inputLower, prev)
            
            if (match === null) break outer

            subMatches.push(match)
            prev = match
        }

        matches = matches.concat(subMatches)
    }

    return matches
}

const generateSearchFuncs = function* (searchFuncs: types.SearchFunc[], params: types.Params) {
    if (params.loopSearch) {
        while (true) {
            yield* generateOneLoopSearchFuncs(searchFuncs)
        }
    }
    else {
        yield* generateOneLoopSearchFuncs(searchFuncs)
    }
}

const generateOneLoopSearchFuncs = function* (searchFuncs: types.SearchFunc[]) {
    for (let func of searchFuncs) {
        yield func
    }
}

export const createSearchFuncs = (searchStrings: string[], params: types.Params) => {
    let filtered = searchStrings.filter(s => s !== '')

    if (params.ignoreBangSearch) {
        filtered = ignoreBang.process(filtered)
    }
    
    return params.useRegExp ?
        filtered.map(createRegExpSearchFunc(params)) :
        filtered.map(createNormalSearchFunc(params))
}

const createNormalSearchFunc = (params: types.Params) => (searchString: string) =>
    (input: string, inputLower: string, prev: types.MatchResult) => {
        const target = params.ignoreCaseSearch ? inputLower : input
        const search = params.ignoreCaseSearch ? searchString.toLowerCase() : searchString
        const index  = target.indexOf(search, prev.index + prev[0].length)
        
        if (index === -1) return null

        const match  = input.substring(index, index + searchString.length)
        return types.createMatchResult([ match ], index, input, searchString)
    }

const createRegExpSearchFunc = (params: types.Params) => (searchString: string) =>
    (input: string, inputLower: string, prev: types.MatchResult) => {
        let regExp: RegExp
        try {
            regExp = new RegExp(searchString, params.ignoreCaseSearch ? 'giu' : 'gu')
        }
        catch {
            return null
        }
        regExp.lastIndex = prev.index + prev[0].length
        const result = regExp.exec(input)
        return result === null ? null : <types.MatchResult>{ ...result, pattern: regExp }
    }
