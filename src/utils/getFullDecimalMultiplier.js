import memoize from 'lodash/memoize.js'
import { BIG_TEN } from './bigNumber.js'

export const getFullDecimalMultiplier = memoize((decimals) => {
  return BIG_TEN.pow(decimals)
})
