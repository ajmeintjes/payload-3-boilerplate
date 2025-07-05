
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => true, // Allow anonymous users to create orders
    read: ({ req: { user } }) => {
      if (user) {
        return {
          or: [
            {
              user: {
                equals: user.id,
              },
            },
            {
              // Admin can see all orders
              email: {
                equals: user.email,
              },
            },
          ],
        }
      }
      return false
    },
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['orderNumber', 'total', 'status', 'createdAt'],
    useAsTitle: 'orderNumber',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'variants',
          type: 'json',
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'tax',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'shipping',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
        },
        {
          name: 'address1',
          type: 'text',
          required: true,
        },
        {
          name: 'address2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zip',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        {
          label: 'Credit Card',
          value: 'credit_card',
        },
        {
          label: 'PayPal',
          value: 'paypal',
        },
        {
          label: 'Stripe',
          value: 'stripe',
        },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }
        return data
      },
    ],
  },
}
