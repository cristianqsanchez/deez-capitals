const collator = new Intl.Collator('es', { caseFirst: 'lower', sensitivity: 'base' })
/**
 * 
 * this function return if two strings are equal ignorig accents and casing
 * @param a 
 * @param b 
 * @returns boolean
 */
export const equals = (a: string, b: string) => collator.compare(a, b) === 0
