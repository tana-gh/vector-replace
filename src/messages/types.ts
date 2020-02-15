
export type MessageTypes =
    Refresh |
    RunSearchCommand |
    RunReplaceCommand

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
