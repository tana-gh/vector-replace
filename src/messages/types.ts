
export type MessageTypes =
    RunReplaceCommand

export interface RunReplaceCommand {
    command   : 'runReplace'
    searchStr : string
    replaceStr: string
}
