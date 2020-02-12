import * as vscode    from 'vscode'
import * as coreTypes from '../core/types'

export const createRanges = (matches: coreTypes.MatchResult[]) => {
    if (matches.length === 0) return []
    return createRangesFromInput(matches[0].input, matches)
}

const createRangesFromInput = (input: string, matches: coreTypes.MatchResult[]) => {
    const indices   = toIndicesFromMatches(matches)
    const positions = toPositionsFromIndices(input, indices)
    const ranges    = toRangesFromPositions(positions)
    return ranges
}

const toIndicesFromMatches = (matches: coreTypes.MatchResult[]) => {
    const result = []
    
    for (let m of matches) {
        result.push(m.index, m.index + m[0].length)
    }

    return result
}

const toPositionsFromIndices = (input: string, indices: number[]) => {
    const result = []

    const lines = input.split('\n')
    let prev = 0
    let i    = 0

    for (let l = 0; l < lines.length; l++) {
        const lineLength = lines[l].length + 1

        while (i < indices.length && indices[i] < prev + lineLength) {
            result.push(new vscode.Position(l, indices[i] - prev))
            i++
        }

        prev += lineLength
    }

    return result
}

const toRangesFromPositions = (positions: vscode.Position[]) => {
    const result = []

    for (let i = 0; i < positions.length; i += 2) {
        result.push(new vscode.Range(positions[i], positions[i + 1]))
    }

    return result
}
