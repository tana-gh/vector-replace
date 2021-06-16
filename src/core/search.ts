import * as state      from '../states/state'
import * as types      from './types'
import * as ignoreBang from './ignoreBang'

export function* search(
    input      : string,
    inputLower : string,
    selections : number[],
    searchFuncs: types.SearchFunc[],
    params     : types.Params,
    po         : state.ProcessObject
): Generator<number, types.MatchResult[]> {
    return yield* searchCore(input, inputLower, selections, searchFuncs, params, params.loopSearch, po)
}

export function* matrixSearch(
    input      : string,
    inputLower : string,
    selections : number[],
    searchFuncs: types.SearchFunc[],
    params     : types.Params,
    po         : state.ProcessObject
): Generator<number, types.MatchResult[]> {
    if (searchFuncs.length === 0) return []

    const matchMatrix = <types.MatchResult[][]>[]
    let progress = 0

    for (let func of searchFuncs) {
        const gen = searchCore(input, inputLower, selections, [ func ], params, true, po)

        while (true) {
            const next = gen.next()

            if (next.done) {
                matchMatrix.push(next.value)
                break
            }

            yield progress + next.value
        }
        
        progress += input.length
    }

    let matches = <types.MatchResult[]>[]

    for (let ms of matchMatrix) {
        const tmp = <types.MatchResult[]>[]
        let i = 0

        for (let m of ms) {
            if (i < matches.length) {
                const end = types.endOfMatchResult(m)
                
                while (true) {
                    if (end <= matches[i].index) {
                        tmp.push(m)
                        break
                    }
                    else {
                        tmp.push(matches[i])
                        i++
                        
                        if (m.index < types.endOfMatchResult(matches[i - 1])) {
                            break
                        }
                        else if (i >= matches.length) {
                            tmp.push(m)
                            break
                        }
                    }
                }
            }
            else {
                tmp.push(m)
            }
        }

        for (; i < matches.length; i++) {
            tmp.push(matches[i])
        }

        matches = tmp
    }

    return matches
}

function* searchCore(
    input      : string,
    inputLower : string,
    selections : number[],
    searchFuncs: types.SearchFunc[],
    params     : types.Params,
    loop       : boolean,
    po         : state.ProcessObject
): Generator<number, types.MatchResult[]> {
    if (searchFuncs.length === 0) return []

    let matches = <types.MatchResult[]>[]
    let prev    = types.createMatchResult([''], 0, '', '', -1)
    let order   = 0

    outer:
    while (true) {
        const prevIndex  = types.endOfMatchResult(prev)
        const subMatches = []
        let sel = 0

        for (let func of searchFuncs) {
            if (po.isCancelled) return []
            yield types.endOfMatchResult(prev)

            while (true) {
                const current = types.endOfMatchResult(prev)

                if (current >= input.length) {
                    if (!params.justSearch) matches = matches.concat(subMatches)
                    break outer
                }

                const match = func(input, inputLower, prev)

                if (match === null) {
                    if (!params.justSearch) matches = matches.concat(subMatches)
                    break outer
                }

                if (match[0] === '') {
                    if (input[current] === '\n') {
                        prev = { ...prev, [0]: prev[0] + '\n' }
                        continue
                    }
                    else if (input[current] === '\r' && input[current + 1] === '\n') {
                        prev = { ...prev, [0]: prev[0] + '\r\n' }
                        continue
                    }
                    else {
                        break
                    }
                }

                if (
                    !params.selectionSearch ||
                    selections.length === 0 ||
                    selections.length === 2 && selections[0] === selections[1]
                ) {
                    if (!params.matrixSearch) match.order = order
                    order++
                    subMatches.push(match)
                }
                else {
                    for (; selections[sel] <= match.index; sel++);
                    if (sel % 2 === 1 && match.index + match[0].length <= selections[sel]) {
                        if (!params.matrixSearch) match.order = order
                        order++
                        subMatches.push(match)
                    }
                }
                
                prev = match
                break
            }
        }

        if (types.endOfMatchResult(prev) === prevIndex) break

        matches = matches.concat(subMatches)

        if (!loop) break
    }

    return matches
}

export const createSearchFuncs = (searchStrings: string[], params: types.Params) => {
    let filtered = searchStrings.filter(s => s !== '')

    if (params.ignoreBangSearch) {
        filtered = ignoreBang.process(filtered)
    }
    
    return params.useRegExp ?
        filtered.map((str, i) => createRegExpSearchFunc(str, i, params)) :
        filtered.map((str, i) => createNormalSearchFunc(str, i, params))
}

const createNormalSearchFunc = (searchString: string, order: number, params: types.Params) =>
    (input: string, inputLower: string, prev: types.MatchResult) => {
        const target = params.ignoreCaseSearch ? inputLower : input
        const search = params.ignoreCaseSearch ? searchString.toLowerCase() : searchString
        const index  = target.indexOf(search, types.endOfMatchResult(prev))
        
        if (index === -1) return null

        const match  = input.substring(index, index + searchString.length)
        return types.createMatchResult([ match ], index, input, searchString, order)
    }

const createRegExpSearchFunc = (searchString: string, order: number, params: types.Params) =>
    (input: string, inputLower: string, prev: types.MatchResult) => {
        let regExp: RegExp
        try {
            regExp = new RegExp(params.captureWhole ? `(${searchString})` : searchString, params.ignoreCaseSearch ? 'giu' : 'gu')
        }
        catch {
            return null
        }
        regExp.lastIndex = types.endOfMatchResult(prev)
        const result = regExp.exec(input)
        return result === null ? null : <types.MatchResult>{ ...result, pattern: new RegExp(regExp, params.ignoreCaseSearch ? 'iu' : 'u'), order }
    }
