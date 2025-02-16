import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectMetadata } from 'models/project-metadata'
import { useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'

import CurrencySymbol from '../shared/CurrencySymbol'

export default function Pay({
  fundingCycle,
  projectId,
  metadata,
  tokenSymbol,
}: {
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber | undefined
  metadata: ProjectMetadata
  tokenSymbol?: string
}) {
  const [payIn, setPayIn] = useState<CurrencyOption>(1)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const converter = useCurrencyConverter()

  const weiPayAmt =
    payIn === 1 ? converter.usdToWei(payAmount) : parseEther(payAmount ?? '0')

  function pay() {
    setPayModalVisible(true)
  }

  const formatReceivedTickets = (wei: BigNumber) =>
    formatWad(weightedRate(fundingCycle, wei, 'payer'))

  if (!fundingCycle || !projectId) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <FormattedNumberInput
            placeholder="0"
            disabled={fundingCycle?.configured.eq(0)}
            onChange={val => setPayAmount(val)}
            value={payAmount}
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow={true}
                content={currencyName(payIn)}
                onClick={() => setPayIn(payIn === 0 ? 1 : 0)}
              />
            }
          />

          <div style={{ fontSize: '.7rem' }}>
            Receive{' '}
            {weiPayAmt?.gt(0) ? (
              formatReceivedTickets(weiPayAmt) +
              ' ' +
              (tokenSymbol ?? 'tokens')
            ) : (
              <span>
                {formatReceivedTickets(
                  (payIn === 0 ? parseEther('1') : converter.usdToWei('1')) ??
                    BigNumber.from(0),
                )}{' '}
                {tokenSymbol ?? 'tokens'}/
                <CurrencySymbol currency={payIn} />
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>
          <Button
            style={{ width: '100%' }}
            type="primary"
            disabled={fundingCycle?.configured.eq(0)}
            onClick={weiPayAmt ? pay : undefined}
          >
            Pay
          </Button>
          {payIn === 1 && (
            <div style={{ fontSize: '.7rem' }}>
              Paid as <CurrencySymbol currency={0} />
              {formatWad(weiPayAmt) || '0'}
            </div>
          )}
        </div>
      </div>

      <ConfirmPayOwnerModal
        fundingCycle={fundingCycle}
        metadata={metadata}
        projectId={projectId}
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </div>
  )
}
