import * as types from './types'

export const search = (input: string, inputLower: string, searchFuncs: types.SearchFunc[]) => {
    if (searchFuncs.length === 0) return []
    
    const matches = []

    const gen = generateSearchFuncs(searchFuncs)
    let prev  = types.createMatchResult([''], 0, '', '')

    while (true) {
        const func  = gen.next().value
        const match = func(input, inputLower, prev)
        
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

export const createSearchFuncs = (searchStrings: string[], params: types.Params) => {
    let filtered = searchStrings.filter(s => s !== '')

    if (params.ignoreBangSearch) {
        filtered = preprocessIgnoreBang(filtered)
    }
    
    return params.useRegExp ?
        filtered.map(createRegExpSearchFunc(params)) :
        filtered.map(createNormalSearchFunc(params))
}

const preprocessIgnoreBang = (searchString: string[]) =>
    searchString
        .filter(s => !(/^!(?:!!)*(?!!)/.test(s)))
        .map   (s => {
            const match = s.match(/^(?:!!)+/)
            if (match !== null) {
                return s.replace(/^(?:!!)+/, match[0].substring(0, match[0].length / 2))
            }
            else {
                return s
            }
        })

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
        const regExp = new RegExp(searchString, params.ignoreCaseSearch ? 'giu' : 'gu')
        regExp.lastIndex = prev.index + prev[0].length
        const result = regExp.exec(input)
        return result === null ? null : <types.MatchResult>Object.assign(result, { pattern: regExp })
    }
