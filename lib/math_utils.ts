export const MathUtils = new class {

    deg2Rad (degrees: number): number {
        return (degrees * Math.PI) / 180
    }

    isPow2 (x: number): boolean {
        return this.nearestPow2(x) === x
    }

    /**
     * Find the nearest number - a power of 2, equal to or greater than X
     *
     * @param {number} x Value
     * @returns {number} Nearest
     */
    nearestPow2 (x: number): number {
        const a = Math.log2(x)
        const b = Math.trunc(a)
        return 2 ** (b + (a - b > 0 ? 1 : 0))
    }

    rad2Deg (radians: number): number {
        return (radians * 180) / Math.PI
    }

    roundTo (x: number, precision: number): number {
        const shift = (x: number, precision: number, reverseShift = false) => {
            if (reverseShift) {
                precision = -precision
            }
            const numArray = ('' + x).split('e')
            return +(numArray[0] + 'e' + (numArray[1] ? +numArray[1] + precision : precision))
        }
        return shift(Math.round(shift(x, precision)), precision, true)
    }

    roundToDigitCount (x: number, digitCount = 10): number {
        return this.roundTo(x, Math.round(digitCount - Math.log10(Math.abs(x))))
    }

    roundToGreaterInt (x: number): number {
        const t = Math.trunc(x)
        return x > t ? t + 1 : t
    }

}
