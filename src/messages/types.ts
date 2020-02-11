
export type MessageTypes =
    RunSearchCommand |
    RunReplaceCommand

export interface RunSearchCommand {
    command  : 'runSearch'
    searchStr: string
}

export interface RunReplaceCommand {
    command   : 'runReplace'
    searchStr : string
    replaceStr: string
}
