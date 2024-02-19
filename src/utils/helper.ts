// import { isValid, parse } from 'date-fns'
// import { zonedTimeToUtc } from 'date-fns-tz'
import { type CellFormat, type ICheckIsDateOverload } from '@/types/types'
import { v1 as uuidv1, v5 as uuidv5 } from 'uuid'
// import { parseISO, intervalToDuration, isBefore, isSameDay } from 'date-fns'

export const getStateToken = (): string => {
  return uuidv5('monetrapp', uuidv1())
}

export const checkIsEmail = (email: string) => {
  const regex: RegExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return !checkEmpty(email) && regex.test(email)
}

export const checkIsNumeric = (num: any) =>
  !checkEmpty(num) && /^-?[0-9]+(?:\.[0-9]+)?$/.test(num + '')

export const checkEmpty = (data: any) => {
  if (typeof data === 'number') {
    return false
  } else if (typeof data === 'string') {
    return data.trim().length === 0
  } else if (Array.isArray(data)) {
    return data.length === 0
  } else if (typeof data === 'object') {
    return data === null || Object.keys(data).length === 0
  } else if (typeof data === 'boolean') {
    return false
  } else {
    return !data
  }
}

export const checkIsDateFormat = (dateString: string): boolean => {
  const dateFormatDMY = new RegExp(
    /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2([0-9]{2})?[0-9]{2}$/
  )
  const dateFormatYMD = new RegExp(
    /^([0-9]{2})?[0-9]{2}([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/
  )
  const dateFormatMDY = new RegExp(
    /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]([0-9]{2})?[0-9]{2}$/
  )

  return (
    dateFormatDMY.test(dateString) ||
    dateFormatYMD.test(dateString) ||
    dateFormatMDY.test(dateString)
  )
}

export const checkIsDate: ICheckIsDateOverload = (content: string, performValidation: any): any => {
  return true
  // const checkIsDateDMY = parse(content.toString().trim(), 'dd/MM/yyyy', new Date())
  // const checkIsDateYMD = parse(content.toString().trim(), 'yyyy-MM-dd', new Date())

  // if (isValid(checkIsDateDMY)) {
  //   if (typeof performValidation === 'boolean') {
  //     return checkIsDateDMY
  //   } else {
  //     return 'dd/mm/yyyy'
  //   }
  // }

  // if (isValid(checkIsDateYMD)) {
  //   if (typeof performValidation === 'boolean') {
  //     return checkIsDateYMD
  //   } else {
  //     return 'yyyy-mm-dd'
  //   }
  // }

  // return null
}

export const checkIsNumber = (content: string): CellFormat | null => {
  let cellPattern: string = ''
  let cellValue: number | undefined | null

  const checkNumber: any = content
    .toString()
    .trim()
    .replace('$', '')
    .replace('€', '')
    .replace('£', '')

  if (
    (typeof checkNumber === 'number' ||
      (typeof checkNumber === 'string' && checkNumber.trim() !== '')) &&
    !isNaN(checkNumber as number)
  ) {
    if (typeof Number(checkNumber) === 'number' && Number(checkNumber) % 1 === 0) {
      cellValue = Number(parseInt(checkNumber.toString()))
      cellPattern = '0'
    } else if (typeof Number(checkNumber) === 'number' && Number(checkNumber) % 1 !== 0) {
      cellPattern = '0.00'
      cellValue = Number(parseFloat(checkNumber.toString()))
    }

    return {
      cellType: 'NUMBER',
      cellPattern: cellPattern,
      cellValue: cellValue
    } as CellFormat
  }

  return null
}

export const buildUrl = (url: string, params: Record<string, unknown>): string => {
  const queryString: string[] = []

  Object.entries(params).forEach(([key, value]) => {
    queryString.push(`${key}=${encodeURIComponent(value as string)}`)
  })

  if (queryString.length) {
    return `${url}?${queryString.join('&')}`
  }

  return url
}

export const parseResponse = (response: Record<string, string>) => {
  return JSON.stringify(response, null, 2)
}

// export const buildNewDate = (date?: string | undefined): Date => {
//   const newDateString = date || new Date().toISOString().slice(0, 10)
//   return zonedTimeToUtc(parse(newDateString, 'yyyy-MM-dd', new Date()), 'UTC')
// }


// export const daysBetween = (deliveryDate: string, collectionDate: string) => {
//   try {
//     if (
//       isBefore(parseISO(deliveryDate), parseISO(collectionDate)) ||
//       isSameDay(parseISO(deliveryDate), parseISO(collectionDate))
//     ) {
//       const num = intervalToDuration({
//         start: parseISO(deliveryDate),
//         end: parseISO(collectionDate)
//       }).days

//       return (num ?? 0) + 1
//     } else {
//       return '-'
//     }
//   } catch (e) {
//     console.error('e', deliveryDate)
//     return 0
//   }
// }

export const formatPrice = (value: any) => {
  let val = (Math.abs(value)/1).toFixed(2).replace('.', ',')
  return (value < 0 ? '-' : '') + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' €'
}

export const checkPasswordMatch = (password: string, confirmPassword: string) => {
  return !checkEmpty(password) && !checkEmpty(confirmPassword) && password === confirmPassword
}