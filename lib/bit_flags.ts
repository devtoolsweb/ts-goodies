/**
 * Each logical class property consumes 8 bytes in memory
 * for 64-bit platforms. Bit flags allow all boolean properties
 * to fit into one 8-byte numeric property,
 * allocating 1 bit to each boolean.
 *
 * TODO: When adding a flag, optionally add an object property
 * with the corresponding name for quick access.
 */
const bfMap = new WeakMap<object, BFInfo>()
const bfSym = Symbol('BitFlags')

export interface IBitFlags<T extends string> {
  readonly bits: number
  readonly exists: boolean
  isSet(flag: T): boolean
  setFlag(flag: T, value?: boolean): this
  toggle(flag: T): this
  unset(flag: T): this
}

interface BitFlags<T extends string> {
  [bfSym]: number
}

/**
 * A proxy class that provides access to the object’s bit flags.
 */
class BitFlags<T extends string> implements IBitFlags<T> {
  static maxFlags = Math.log2(Number.MAX_SAFE_INTEGER)

  readonly bitIndexMap!: Map<T, number>

  get bits(): number {
    return this[bfSym] || 0
  }

  set bits(value: number) {
    this[bfSym] = value
  }

  get exists(): boolean {
    return !!this[bfSym]
  }

  isSet(flag: T): boolean {
    const xs = this.bitIndexMap
    return xs.has(flag) && (this.bits & (1 << xs.get(flag)!)) !== 0
  }

  setFlag(flag: T, value?: boolean): this {
    const xs = this.bitIndexMap
    this.addFlagIndex(flag)
    if (value === false) {
      this.bits &= ~(1 << xs.get(flag)!)
    } else {
      this.bits |= 1 << xs.get(flag)!
    }
    return this
  }

  toggle(flag: T): this {
    return this.setFlag(flag, !this.isSet(flag))
  }

  unset(flag: T): this {
    return this.setFlag(flag, false)
  }

  private addFlagIndex(flag: T): void {
    const m = this.bitIndexMap
    if (!m.has(flag)) {
      if (m.size === BitFlags.maxFlags) {
        throw new Error('Maximum number of bit flags exceeded')
      }
      m.set(flag, m.size)
    }
  }
}

class BFInfo {
  readonly bitIndexMap = new Map<string, number>()
  readonly flags = new BitFlags()
}

/**
 * This decorator adds the ability to use bit flags in the class.
 */
export function BitFlagged(ctor: Function) {
  const p = ctor.prototype
  if (!bfMap.has(p)) {
    bfMap.set(p, new BFInfo())
    let updateFlags: boolean = true
    if ('flags' in p) {
      try {
        if (p.flags) {
          updateFlags = false
        }
      } catch (e) {}
    }
    if (updateFlags) {
      let info = bfMap.get(p)!
      const fp = Object.getPrototypeOf(info.flags)
      Object.getOwnPropertyNames(fp)
        .filter(k => k !== 'constructor')
        .forEach(k => {
          p[k] = fp[k]
        })
      Object.defineProperty(p, 'bitIndexMap', {
        get: function() {
          return info.bitIndexMap
        }
      })
      Object.defineProperty(p, 'flags', {
        get: function() {
          return this
        }
      })
    }
  }
}
