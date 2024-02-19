import {
  type UserLogin,
  type AccountRequest,
  type User,
  type ContainerType,
  // type WasteType
} from '@/types/typings'

export type CellFormat = {
  cellType: string
  cellPattern: string
  cellValue: number | undefined | null
}

export type ICheckIsDateOverload = {
  (content: string, performValidation: boolean): Date | null
  (content: string, performValidation: string): string | null
  (content: string, performValidation: boolean | string): Date | string | null
}

export type AccountRequestForm = AccountRequest & {
  privacy?: boolean
}

export type UserLoginData = {
  data: UserLogin
}

export type UserData = {
  data: User
}

export type Site = {
  id: number
  name: string
  address: string
  addressAdditionalInfo: string
  city: string
  county: string
  postcode: string  
  customerNotes: string
  enabled: boolean  
  dateLastUsed: Date
  timesUsed: number  
  siteContact: SiteContact  
}

export type SiteContact = {
  id: number
  fullName: string
  position: string
  contactType: ContactType
  notes: string
  siteContactItems: SiteContactItem[]
}


export type ContactType = {
  id: number
  name: string
}

export type SiteContactItem = {
  id: number
  itemType: string  
  email: string
  phonePrefix: string
  phone: string
}


export type GeneralType = {
  id: number
  name: string
}

export type Order = {
  id: number
  totalCharge: number,
  totalVAT: number,
  totalAmount: number,
  orderNumberFormatted: string
}

export type JobType = GeneralType & {}
export type WasteType = GeneralType & {}
export type JobStatusB2B = GeneralType & {
  code: string
}
export type JobPriceLine = GeneralType & {
  quantity: number
  price: number
}

export type Job = {
  id: number
  jobDate: Date  
  totalCharge: number
  totalVAT: number
  totalAmount: number
  customerNotes: string
  jobStatusB2B: JobStatusB2B
  jobType: JobType
  wasteType: WasteType
  containerType: ContainerType
  lines: JobPriceLine[]
  exchangeToOrder?: Order
  exchangeToJob?: Job
  exchangeFromOrder?: Order
  exchangeFromJob?: Job
  dateOrder?: Date
  dateDelivery?: Date
  dateCollection?: Date
  dateExchange?: Date
}

export type Agreement = {
  id: number
  orderNumberFormatted:string
  uuid: string
  createdAt: string
  updatedAt: Date
  totalCharge: number
  totalVAT: number
  totalAmount: number
  site: Site
  jobs: Job[]  
}

export type OrderState = 'ON_SITE' | 'COMPLETED' | 'PENDING' | 'ALL'