import { BigNumber } from '@ethersproject/bignumber'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Descriptions, Modal, Space } from 'antd'
import TabSection from 'components/shared/TabSection'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useContext, useState } from 'react'

import { PaymentMod } from '../../models/payment-mod'
import { TicketMod } from '../../models/ticket-mod'
import TicketModForm from './TicketModForm'
import { fromPerMille, parsePerMille } from 'utils/formatCurrency'

export default function Mods({
  projectId,
  isOwner,
}: {
  projectId: BigNumber | undefined
  isOwner: boolean | undefined
}) {
  const { transactor, contracts } = useContext(UserContext)

  const { theme } = useContext(ThemeContext)

  const [editingModalVisible, setEditingModalVisible] = useState<
    'payment' | 'ticket'
  >()
  const [editingMods, setEditingMods] = useState<
    Partial<PaymentMod | TicketMod>[]
  >([])
  const [loadingSetMods, setLoadingSetMods] = useState<boolean>()

  const paymentMods = useContractReader<PaymentMod[]>({
    contract: ContractName.ModStore,
    functionName: 'allPaymentMods',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const ticketMods = useContractReader<TicketMod[]>({
    contract: ContractName.ModStore,
    functionName: 'allTicketMods',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const buildMod = (mod: Partial<PaymentMod & TicketMod>, index: number) => (
    <Descriptions
      style={{
        padding: 10,
        border: '1px solid ' + theme.colors.stroke.tertiary,
        borderRadius: theme.radii.sm
      }}
      key={mod.beneficiary ?? index}
      column={1}
      size="small"
    >
      <Descriptions.Item label="Address">{mod.beneficiary}</Descriptions.Item>
      <Descriptions.Item label="Percent">
        {fromPerMille(mod.percent)}%
      </Descriptions.Item>
      {mod.note && (
        <Descriptions.Item label="Note">{mod.note}</Descriptions.Item>
      )}
      <Descriptions.Item label="Use ERC-20">
        {mod.preferConverted || 'no'}
      </Descriptions.Item>
    </Descriptions>
  )

  function setPaymentMods() {
    if (!transactor || !contracts) return
  }

  function setTicketMods() {
    if (!transactor || !contracts || !projectId) return

    setLoadingSetMods(true)

    const beneficiaries = editingMods.map(mod => mod.beneficiary)
    const percents = editingMods.map(mod =>
      parsePerMille(mod.percent?.toString()).toNumber(),
    )
    const preferConverteds = editingMods.map(mod => mod.preferConverted)

    transactor(
      contracts.ModStore,
      'setTicketMods',
      [projectId.toHexString(), beneficiaries, percents, preferConverteds],
      {
        onConfirmed: () => {
          setEditingModalVisible(undefined)
          setEditingMods([])
        },
        onDone: () => setLoadingSetMods(false),
      },
    )
  }

  const filterIncompleteMods = (mods: Partial<TicketMod | PaymentMod>[]) =>
    mods.filter(mod => mod.beneficiary && mod.percent)

  return (
    <div>
      <TabSection
        label="Mods"
        tabs={['payment', 'tickets']}
        contents={{
          payment: (
            <Space direction="vertical">
              <div>
                {paymentMods?.length
                  ? paymentMods.map((mod, i) => buildMod(mod, i))
                  : 'No payment mods'}
              </div>
              {isOwner && (
                <Button
                  onClick={() => {
                    setEditingModalVisible('payment')
                    setEditingMods(paymentMods ?? [])
                  }}
                >
                  Edit payment mods
                </Button>
              )}
            </Space>
          ),
          tickets: (
            <Space direction="vertical">
              <div>
                {ticketMods?.length
                  ? ticketMods.map((mod, i) => buildMod(mod, i))
                  : 'No ticket mods'}
              </div>
              {isOwner && (
                <Button
                  onClick={() => {
                    setEditingModalVisible('ticket')
                    setEditingMods(ticketMods ?? [])
                  }}
                >
                  Edit ticket mods
                </Button>
              )}
            </Space>
          ),
        }}
      ></TabSection>

      <Modal
        title={
          editingModalVisible === 'payment'
            ? 'Edit payment mods'
            : 'Edit ticket mods'
        }
        okText={
          editingModalVisible === 'payment'
            ? 'Set payment mods'
            : 'Set ticket mods'
        }
        confirmLoading={loadingSetMods}
        visible={!!editingModalVisible}
        onOk={() => {
          switch (editingModalVisible) {
            case 'payment':
              setPaymentMods()
              break
            case 'ticket':
              setTicketMods()
              break
          }
        }}
        onCancel={() => setEditingModalVisible(undefined)}
      >
        <Space direction="vertical">
          {editingMods.map((mod, i) => {
            let content
            switch (editingModalVisible) {
              case 'payment':
                break
              case 'ticket':
                content = (
                  <TicketModForm
                    value={mod}
                    onValueChange={newMod =>
                      setEditingMods(
                        editingMods.map((prevMod, _i) =>
                          _i === i ? { ...prevMod, ...newMod } : prevMod,
                        ),
                      )
                    }
                  />
                )
                break
            }

            return (
              <div
                style={{
                  position: 'relative',
                  padding: 20,
                  borderRadius: theme.radii.sm,
                  border: '1px solid ' + theme.colors.stroke.secondary,
                }}
              >
                <div
                  style={{ position: 'absolute', top: 10, right: 10 }}
                  onClick={() =>
                    setEditingMods([
                      ...editingMods.slice(0, i),
                      ...editingMods.slice(i + 1),
                    ])
                  }
                >
                  <CloseCircleOutlined />
                </div>
                {content}
              </div>
            )
          })}
          <Button
            onClick={() =>
              setEditingMods([...(filterIncompleteMods(editingMods) ?? []), {}])
            }
          >
            Add mod
          </Button>
        </Space>
      </Modal>
    </div>
  )
}
