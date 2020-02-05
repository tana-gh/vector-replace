import * as types from './types'

export const replace = (input: string, replaceStrings: string[], matches: types.MatchResult[]) => {
    const output = []

    const gen = generateReplaceStrings(replaceStrings)
    let prev  = 0
    
    for (let match of matches) {
        const prevStr = input.substring(prev, match.index)
        output.push(prevStr, gen.next().value)

        prev = match.index + match[0].length
    }

    const prevStr = input.substring(prev, input.length)
    output.push(prevStr)

    return output.join('')
}

const generateReplaceStrings = function* (replaceStrings: string[]) {
    while (true) {
        for (let str of replaceStrings) {
            yield str
        }
    }
}
