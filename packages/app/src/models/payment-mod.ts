import { BigNumber } from '@ethersproject/bignumber'

export interface PaymentMod {
  projectId: BigNumber
  beneficiary: string
  percent: number
  note: string
  preferConverted: boolean
}
