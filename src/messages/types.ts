
export type MessageTypes =
    Refresh           |
    RunSearchCommand  |
    RunReplaceCommand |
    SetUseRegExp

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
