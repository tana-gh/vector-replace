import * as types           from './types'
import * as ignoreBang      from './ignoreBang'
import * as escapeBackslash from './escapeBackslash'

export const replace = (
    input       : string,
    replaceFuncs: types.ReplaceFunc[],
    matches     : types.MatchResult[],
    params      : types.Params
) => {
    if (replaceFuncs.length === 0) return input

    const output = <string[]>[]
    let prev = 0
    
    for (let match of matches) {
        const func = getReplaceFunc(replaceFuncs, match.order, params)
        if (!func) continue

        const replaced = func(match)
        const prevStr  = input.substring(prev, match.index)

        output.push(prevStr, replaced)

        prev = types.endOfMatchResult(match)
    }

    const prevStr = input.substring(prev, input.length)
    output.push(prevStr)

    return output.join('')
}

const getReplaceFunc = (replaceFuncs: types.ReplaceFunc[], order: number, params: types.Params) => {
    if (params.loopReplace) {
        return replaceFuncs[order % replaceFuncs.length]
    }
    else if (order < replaceFuncs.length) {
        return replaceFuncs[order]
    }
    else {
        return undefined
    }
}

export const createReplaceFuncs = (replaceStrings: string[], params: types.Params) => {
    let processed = replaceStrings

    if (params.ignoreEmptyReplace) {
        processed = processed.filter(s => s !== '')
    }

    if (params.ignoreBangReplace) {
        processed = ignoreBang.process(processed)
    }

    if (params.useRegExp) {
        processed = escapeBackslash.process(processed)
    }

    return processed.map(s => (match: types.MatchResult) => {
        if (match.pattern instanceof RegExp) {
            return match[0].replace(match.pattern, s)
        }
        else {
            return s
        }
    })
}
