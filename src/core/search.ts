import * as types      from './types'
import * as ignoreBang from './ignoreBang'

export const search = (
    input      : string,
    inputLower : string,
    selections : number[],
    searchFuncs: types.SearchFunc[],
    params     : types.Params
) => {
    if (searchFuncs.length === 0) return []

    let matches = <types.MatchResult[]>[]
    let prev    = types.createMatchResult([''], 0, '', '')

    outer:
    while (true) {
        const prevIndex  = types.endOfMatchResult(prev)
        const subMatches = []
        const gen  = generateSearchFuncs(searchFuncs)
        let   func = gen.next()
        let   sel  = 0

        while (true) {
            if (func.done) break

            const match = func.value(input, inputLower, prev)

            if (match === null) {
                if (!params.justSearch) matches = matches.concat(subMatches)
                break outer
            }

            if (match[0] === '') {
                const current = types.endOfMatchResult(prev)
                if (input[current] === '\n') {
                    prev = { ...prev, [0]: prev[0] + '\n' }
                    continue
                }
                else if (input[current] === '\r' && input[current + 1] === '\n') {
                    prev = { ...prev, [0]: prev[0] + '\r\n' }
                    continue
                }
            }

            if (
                !params.selectionSearch ||
                selections.length === 0 ||
                selections.length === 2 && selections[0] === selections[1]
            ) {
                subMatches.push(match)
            }
            else {
                for (; selections[sel] <= match.index; sel++);
                if (sel % 2 === 1 && match.index + match[0].length <= selections[sel]) subMatches.push(match)
            }
            
            prev = match
            func = gen.next()
        }

        if (types.endOfMatchResult(prev) === prevIndex) break

        matches = matches.concat(subMatches)

        if (!params.loopSearch) break
    }

    return matches
}

const generateSearchFuncs = function* (searchFuncs: types.SearchFunc[]) {
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
        const index  = target.indexOf(search, types.endOfMatchResult(prev))
        
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
        regExp.lastIndex = types.endOfMatchResult(prev)
        const result = regExp.exec(input)
        return result === null ? null : <types.MatchResult>{ ...result, pattern: regExp }
    }
