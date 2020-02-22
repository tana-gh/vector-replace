
export const process = (targetStrings: string[]) =>
    targetStrings
        .filter(s => !(/^!(?:!!)*(?!!)/.test(s)))
        .map   (s => {
            const match = s.match(/^(?:!!)+/)
            if (match !== null) {
                return s.replace(/^(?:!!)+/, match[0].substring(0, match[0].length / 2))
            }
            else {
                return s
            }
        })
