
export const process = (targetStrings: string[]) =>
    targetStrings.map(s => {
        const result = <string[]>[]
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '\\' && i + 1 < s.length) {
                switch (s[i + 1]) {
                    case '\\':
                        result.push('\\')
                        i++
                        break
                    case 't':
                        result.push('\t')
                        i++
                        break
                    case 'r':
                        result.push('\r')
                        i++
                        break
                    case 'n':
                        result.push('\n')
                        i++
                        break
                    default:
                        result.push(s[i])
                        break
                }
            }
            else {
                result.push(s[i])
            }
        }
        return result.join('')
    })
