import { Space } from 'antd'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import React, { useContext, useLayoutEffect, useState } from 'react'

import { CardSection } from './CardSection'
import TooltipLabel from './TooltipLabel'

export default function TabSection<Tab extends string>({
  label,
  labelTip,
  tabs,
  defaultTab,
  contents,
}: {
  label?: string
  labelTip?: string
  tabs?: Tab[]
  defaultTab?: Tab
  contents?: Record<Tab, JSX.Element>
}) {
  const [selectedTab, setSelectedTab] = useState<Tab>()
  const [hoverTab, setHoverTab] = useState<Tab>()

  useLayoutEffect(() => tabs && setSelectedTab(defaultTab ?? tabs[0]), [
    defaultTab,
  ])

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const buildTab = (tab: Tab) => (
    <div
      key={tab}
      style={{
        textTransform: 'uppercase',
        cursor: 'pointer',
        ...(tab === selectedTab
          ? { color: colors.text.secondary, fontWeight: 600 }
          : { color: colors.text.tertiary, fontWeight: 500 }),
        ...(tab === hoverTab ? { color: colors.text.secondary } : {}),
      }}
      onClick={() => setSelectedTab(tab)}
      onMouseEnter={() => setHoverTab(tab)}
      onMouseLeave={() => setHoverTab(undefined)}
    >
      {tab}
    </div>
  )

  const tabContent = contents && selectedTab ? contents[selectedTab] : undefined

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div>
          {label && (
            <TooltipLabel
              style={{
                color: colors.text.header,
                fontWeight:
                  forThemeOption &&
                  forThemeOption({
                    [ThemeOption.light]: 600,
                    [ThemeOption.dark]: 400,
                  }),
              }}
              label={label}
              tip={labelTip}
            />
          )}
        </div>
        <Space style={{ fontSize: '.8rem' }} size="middle">
          {tabs?.map(t => buildTab(t))}
        </Space>
      </div>
      <CardSection padded>{tabContent}</CardSection>
    </div>
  )
}
