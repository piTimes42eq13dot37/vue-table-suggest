import { describe, expect, it } from 'vitest'
import { buildSuggestions, filterItems } from './search-engine'
import type { SearchModelDefinition } from './models/external'
import type { SearchToken } from './models/internal'

describe('search-engine across multiple domains', () => {
  it('filters nested customer data in commerce domain', () => {
    type CommerceOrder = {
      orderId: string
      product: string
      customer: { name: string; tier: string }
      date: string
      status: string
    }

    const items: CommerceOrder[] = [
      {
        orderId: 'A-100',
        product: 'Nova Growth Plan',
        customer: { name: 'Alice Zephyr', tier: 'premium' },
        date: '01.03.2026',
        status: 'new',
      },
      {
        orderId: 'A-101',
        product: 'Nova Basic Plan',
        customer: { name: 'Bob Yarrow', tier: 'standard' },
        date: '02.03.2026',
        status: 'new',
      },
    ]

    const modelDefinition: SearchModelDefinition<CommerceOrder> = {
      modelName: 'CommerceOrder',
      columns: [
        { key: 'orderId', label: 'Order ID', searchable: true, sortable: true },
        { key: 'product', label: 'Product', searchable: true, sortable: true },
        {
          key: 'customer',
          label: 'Customer',
          searchable: true,
          sortable: true,
          accessor: (item) => item.customer.name,
          scopeGroup: 'customer',
        },
        {
          key: 'tier',
          label: 'Tier',
          searchable: true,
          sortable: true,
          accessor: (item) => item.customer.tier,
          scopeGroup: 'customer',
        },
        { key: 'date', label: 'Date', searchable: true, sortable: true },
        { key: 'status', label: 'Status', searchable: true, sortable: true },
      ],
    }

    const tokens: SearchToken[] = [
      { uid: 'fulltext|alice', type: 'fulltext', title: 'alice' },
      { uid: 'scope|customer', type: 'scope', key: 'customer', title: 'Customer' },
    ]

    const result = filterItems(items, modelDefinition, tokens)
    expect(result).toHaveLength(1)
    expect(result[0]?.customer.name).toBe('Alice Zephyr')
  })

  it('builds suggestions from doctor specialty accessor in healthcare domain', () => {
    type Appointment = {
      id: number
      patient: string
      doctor: { name: string; specialty: string }
      date: string
      state: string
    }

    const items: Appointment[] = [
      {
        id: 1,
        patient: 'Mira Atlas',
        doctor: { name: 'Dr. Reed', specialty: 'Neurology' },
        date: '03.03.2026',
        state: 'open',
      },
      {
        id: 2,
        patient: 'Liam North',
        doctor: { name: 'Dr. Vale', specialty: 'Cardiology' },
        date: '04.03.2026',
        state: 'open',
      },
    ]

    const modelDefinition: SearchModelDefinition<Appointment> = {
      modelName: 'Appointment',
      columns: [
        { key: 'id', label: 'ID', searchable: true, sortable: true },
        { key: 'patient', label: 'Patient', searchable: true, sortable: true },
        {
          key: 'specialty',
          label: 'Specialty',
          searchable: true,
          sortable: true,
          accessor: (item) => item.doctor.specialty,
        },
        { key: 'date', label: 'Date', searchable: true, sortable: true },
        { key: 'state', label: 'State', searchable: true, sortable: true },
      ],
    }

    const suggestions = buildSuggestions(items, modelDefinition, [], 'neu')
    expect(suggestions.some((token) => token.type === 'specialty')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('neuro'))).toBe(true)
  })

  it('supports date filtering via accessor-based date field in support domain', () => {
    type SupportTicket = {
      ticket: string
      requester: string
      meta: { createdOn: string; queue: string }
      status: string
    }

    const items: SupportTicket[] = [
      {
        ticket: 'T-100',
        requester: 'Aria Bloom',
        meta: { createdOn: '05.03.2026', queue: 'billing' },
        status: 'open',
      },
      {
        ticket: 'T-101',
        requester: 'Noah Crest',
        meta: { createdOn: '06.03.2026', queue: 'technical' },
        status: 'open',
      },
    ]

    const modelDefinition: SearchModelDefinition<SupportTicket> = {
      modelName: 'SupportTicket',
      columns: [
        { key: 'ticket', label: 'Ticket', searchable: true, sortable: true },
        { key: 'requester', label: 'Requester', searchable: true, sortable: true },
        {
          key: 'date',
          label: 'Date',
          searchable: true,
          sortable: true,
          accessor: (item) => item.meta.createdOn,
        },
        {
          key: 'queue',
          label: 'Queue',
          searchable: true,
          sortable: true,
          accessor: (item) => item.meta.queue,
        },
        { key: 'status', label: 'Status', searchable: true, sortable: true },
      ],
    }

    const result = filterItems(items, modelDefinition, [
      {
        uid: 'date_exact|06.03.2026',
        type: 'date_exact',
        title: '06.03.2026',
        rawTitle: '06.03.2026',
      },
    ])

    expect(result).toHaveLength(1)
    expect(result[0]?.ticket).toBe('T-101')
  })
})
