import { Form, Input, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { TicketMod } from 'models/ticket-mod'
import { useLayoutEffect } from 'react'
import NumberSlider from '../shared/inputs/NumberSlider'

export default function TicketModForm({
  value,
  onValueChange,
}: {
  value: Partial<TicketMod>
  onValueChange?: (val: Partial<TicketMod>) => void
}) {
  const [form] = useForm<TicketMod>()

  useLayoutEffect(() => value && form.setFieldsValue(value), [value])

  return (
    <div>
      <Form form={form} layout="vertical" onValuesChange={onValueChange}>
        <Form.Item
          label="Address"
          name="beneficiary"
          extra="Destination address to receive tickets."
        >
          <Input placeholder="0x000..." />
        </Form.Item>
        <Form.Item
          label="Percent"
          name="percent"
          extra="Percent of reserved tickets allocated to address."
        >
          <NumberSlider min={0} max={100} step={0.1} suffix="%" />
        </Form.Item>
        <Form.Item
          label="Prefer ERC-20"
          name="preferConverted"
          extra="Use ERC-20 tokens instead of tickets, if available."
        >
          <Switch checked={form.getFieldValue('preferConverted')} />
        </Form.Item>
      </Form>
    </div>
  )
}
