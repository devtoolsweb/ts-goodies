class StringUtilsCtor {
  camelCaseToKebab(s: string): string {
    return s
      .split(/(?=[A-Z])/)
      .join('-')
      .toLowerCase()
  }

  kebabCaseToCamel(s: string, prefix?: string): string {
    const parts = s.toLowerCase().split('-')
    if (prefix) {
      parts.unshift(prefix.toLowerCase())
    }
    return parts[0].concat(
      parts
        .slice(1)
        .map(p => this.toUpperCaseFirst(p))
        .join('')
    )
  }

  kebabCaseToCamelUppercase(s: string, prefix?: string): string {
    return this.toUpperCaseFirst(this.kebabCaseToCamel(s, prefix))
  }

  randomString(length: number, chars: string): string {
    if (length > 0 && chars.length > 0) {
      return Array.from({ length }, () => {
        return chars.charAt(Math.round(Math.random() * (chars.length - 1)))
      }).join('')
    }
    return ''
  }

  snakeCaseToCamel(s: string): string {
    return s
      .toLowerCase()
      .split('_')
      .map((s, i) => (i > 0 ? this.toUpperCaseFirst(s) : s))
      .join('')
  }

  toLowerCaseFirst(s: string): string {
    return s.charAt(0).toLowerCase() + s.slice(1)
  }

  toUpperCaseFirst(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  truncate(s: string, length: number = 50, ellipsis: boolean = false): string {
    if (s.length >= 0) {
      return s.substring(0, length).concat(ellipsis ? ' ...' : '')
    }
    return ''
  }
}

export const StringUtils = new StringUtilsCtor()
