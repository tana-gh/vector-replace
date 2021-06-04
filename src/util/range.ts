import * as vscode from 'vscode'
import * as types  from '../core/types'

export const createRanges = (matches: types.MatchResult[]) => {
    if (matches.length === 0) return []
    return createRangesFromInput(matches[0].input, matches)
}

const createRangesFromInput = (input: string, matches: types.MatchResult[]) => {
    const indices   = toIndicesFromMatches(matches)
    const positions = toPositionsFromIndices(input, indices)
    const ranges    = toRangesFromPositions(positions)
    return ranges
}

const toIndicesFromMatches = (matches: types.MatchResult[]) => {
    const result = []
    
    for (let m of matches) {
        result.push(m.index, types.endOfMatchResult(m))
    }

    return result
}

const toPositionsFromIndices = (input: string, indices: number[]) => {
    const result = []

    const lines = input.split('\n')
    let prev = 0
    let i    = 0

    for (let l = 0; i < indices.length && l < lines.length; l++) {
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

export const toIndicesFromPositions = (input: string, positions: vscode.Position[]) => {
    const result = []

    const sorted = [ ...positions ].sort((pos1, pos2) => pos1.line !== pos2.line ? pos1.line - pos2.line : pos1.character - pos2.character)

    const lines = input.split('\n')
    let prev = 0
    let i    = 0

    for (let l = 0; i < sorted.length && l < lines.length; l++) {
        if (sorted[i].line !== l) {
            prev += lines[l].length + 1
            continue
        }

        while (i < sorted.length && sorted[i].line === l) {
            result.push(prev + sorted[i].character)
            i++
        }

        prev += lines[l].length + 1
    }

    return result
}
