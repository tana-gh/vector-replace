import * as types      from './types'
import * as ignoreBang from './ignoreBang'

export const replace = (input: string, replaceFuncs: types.ReplaceFunc[], matches: types.MatchResult[]) => {
    if (replaceFuncs.length === 0) return input

    const output = []

    const gen = generateReplaceFuncs(replaceFuncs)
    let prev  = 0
    
    for (let match of matches) {
        const prevStr  = input.substring(prev, match.index)
        const func     = gen.next().value
        const replaced = func(match)

        output.push(prevStr, replaced)

        prev = match.index + match[0].length
    }

    const prevStr = input.substring(prev, input.length)
    output.push(prevStr)

    return output.join('')
}

const generateReplaceFuncs = function* (replaceFuncs: types.ReplaceFunc[]) {
    while (true) {
        for (let func of replaceFuncs) {
            yield func
        }
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
