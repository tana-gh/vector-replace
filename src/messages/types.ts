
export type MessageTypes =
    Refresh               |
    RunSearchCommand      |
    RunReplaceCommand     |
    SetUseRegExp          |
    SetIgnoreCaseSearch   |
    SetIgnoreBangSearch   |
    SetIgnoreBangReplace  |
    SetIgnoreEmptyReplace |
    SetLoopSearch         |
    SetLoopReplace        |
    SetJustSearch

export interface Refresh {
    command: 'refresh'
}

export interface RunSearchCommand {
    command  : 'runSearch'
    searchStr: string
}

export interface RunReplaceCommand {
    command   : 'runReplace'
    searchStr : string
    replaceStr: string
}

export interface SetUseRegExp {
    command: 'setUseRegExp'
    value  : boolean
}

export interface SetIgnoreCaseSearch {
    command: 'setIgnoreCaseSearch'
    value  : boolean
}

export interface SetIgnoreBangSearch {
    command: 'setIgnoreBangSearch'
    value  : boolean
}

export interface SetIgnoreBangReplace {
    command: 'setIgnoreBangReplace'
    value  : boolean
}

export interface SetIgnoreEmptyReplace {
    command: 'setIgnoreEmptyReplace'
    value  : boolean
}

export interface SetLoopSearch {
    command: 'setLoopSearch'
    value  : boolean
}

export interface SetLoopReplace {
    command: 'setLoopReplace'
    value  : boolean
}

export interface SetJustSearch {
    command: 'setJustSearch'
    value  : boolean
}
