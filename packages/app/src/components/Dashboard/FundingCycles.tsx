import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import TabSection from 'components/shared/TabSection'
import { ThemeContext } from 'contexts/themeContext'
import { FundingCycle } from 'models/funding-cycle'
import React, { useContext } from 'react'

import FundingCyclePreview from './FundingCyclePreview'
import FundingHistory from './FundingHistory'
import QueuedFundingCycle from './QueuedFundingCycle'
import Tappable from './Tappable'

export default function FundingCycles({
  projectId,
  fundingCycle,
  balanceInCurrency,
  showCurrentDetail,
  isOwner,
}: {
  projectId: BigNumber
  fundingCycle: FundingCycle | undefined
  balanceInCurrency: BigNumber | undefined
  showCurrentDetail?: boolean
  isOwner?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <TabSection
      label="Funding cycle"
      labelTip="A project's lifetime is defined in funding cycles. Each funding cycle has a duration and funding target. During each cycle, a project can withdraw no more than the target—any extra funds paid is overflow."
      tabs={['current', 'upcoming', 'history']}
      contents={{
        current: (
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Tappable
                projectId={projectId}
                fundingCycle={fundingCycle}
                balanceInCurrency={balanceInCurrency}
              />
              <FundingCyclePreview
                fundingCycle={fundingCycle}
                showDetail={showCurrentDetail}
              />
            </Space>
          </div>
        ),
        upcoming: (
          <QueuedFundingCycle
            isOwner={isOwner}
            projectId={projectId}
            currentCycle={fundingCycle}
          />
        ),
        history: <FundingHistory startId={fundingCycle?.previous} />,
      }}
    ></TabSection>
  )
}
