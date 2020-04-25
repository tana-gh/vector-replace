import * as types      from './types'
import * as ignoreBang from './ignoreBang'

export const replace = (
    input       : string,
    replaceFuncs: types.ReplaceFunc[],
    matches     : types.MatchResult[],
    params      : types.Params
) => {
    if (replaceFuncs.length === 0) return input

    const output = []

    const gen = generateReplaceFuncs(replaceFuncs, params)
    let prev  = 0
    
    for (let match of matches) {
        const func = gen.next()

        if (func.done) break

        const replaced = func.value(match)
        const prevStr  = input.substring(prev, match.index)

        output.push(prevStr, replaced)

        prev = types.endOfMatchResult(match)
    }

    const prevStr = input.substring(prev, input.length)
    output.push(prevStr)

    return output.join('')
}

const generateReplaceFuncs = function* (replaceFuncs: types.ReplaceFunc[], params: types.Params) {
    if (params.loopReplace) {
        while (true) {
            yield* generateOneLoopReplaceFuncs(replaceFuncs)
        }
    }
    else {
        yield* generateOneLoopReplaceFuncs(replaceFuncs)
    }
}

const generateOneLoopReplaceFuncs = function* (replaceFuncs: types.ReplaceFunc[]) {
    for (let func of replaceFuncs) {
        yield func
    }
}

export const createReplaceFuncs = (replaceStrings: string[], params: types.Params) => {
    let filtered = replaceStrings

    if (params.ignoreEmptyReplace) {
        filtered = filtered.filter(s => s !== '')
    }

    if (params.ignoreBangReplace) {
        filtered = ignoreBang.process(filtered)
    }

    return filtered.map(s => (match: types.MatchResult) => {
        if (match.pattern instanceof RegExp) {
            return match[0].replace(match.pattern, s)
        }
        else {
            return s
        }
    })
}
