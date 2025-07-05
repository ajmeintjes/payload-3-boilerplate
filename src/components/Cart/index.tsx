
'use client'

import React, { useState } from 'react'
import { useCart } from '@/providers/Cart'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'

export const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        Cart ({totalItems})
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Shopping Cart</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ×
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="flex gap-3 p-2 border rounded">
                      {item.product.featuredImage && (
                        <div className="w-12 h-12 relative overflow-hidden rounded">
                          <Media resource={item.product.featuredImage} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.product.title}</h4>
                        <p className="text-sm text-gray-500">
                          ${(item.product.price || 0).toFixed(2)} × {item.quantity}
                        </p>
                        {item.variants && Object.keys(item.variants).length > 0 && (
                          <p className="text-xs text-gray-400">
                            {Object.entries(item.variants).map(([key, value]) => 
                              `${key}: ${value}`
                            ).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 text-xs border rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 text-xs border rounded"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold mb-3">
                    <span>Total: ${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full">
                      Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
