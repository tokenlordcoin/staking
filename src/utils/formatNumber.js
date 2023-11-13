import BigNumber from 'bignumber.js'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier.js'

export const getBalanceAmount = (amount, decimals = 18) => {
    return new BigNumber(amount).dividedBy(getFullDecimalMultiplier(decimals))
}

export const getFullDisplayBalance = (balance, decimals = 18, displayDecimals) => {
    return getBalanceAmount(balance, decimals).toFixed(displayDecimals)
}

export const formattedNumberTwo = (number) => {
    return new Intl.NumberFormat('en-EN', {
        notation: 'standard',
     }).format(number)
}


export const formattedNumber = (number) => {
    return new Intl.NumberFormat('en-EN', {
        notation: 'standard',
        compactDisplay: 'short',
        maximumSignificantDigits: 5,
    }).format(number)
}

export const formattedNumberNine = (number) => {
    return new Intl.NumberFormat('en-EN', {
        notation: 'standard',
        compactDisplay: 'short',
        maximumSignificantDigits: 9,
    }).format(number)
}

export const formattedNumberUSD = (number) => {
    return new Intl.NumberFormat('en-EN', {
        style: "currency",
        currency: "USD",
        compactDisplay: 'short',
        maximumSignificantDigits: 5,
    }).format(number)
}

export const formattedShort = (number) => {
    return new Intl.NumberFormat('en-EN', {
        notation: 'compact',
    }).format(number)
}