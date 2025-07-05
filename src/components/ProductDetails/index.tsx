
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/payload-types'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'

interface ProductDetailsProps {
  product: Product
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      variants: selectedVariants,
    })
  }

  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value,
    }))
  }

  const currentPrice = product.price || 0
  const compareAtPrice = product.compareAtPrice || 0
  const isOnSale = compareAtPrice > currentPrice

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {product.featuredImage && (
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Media resource={product.featuredImage} fill className="object-cover" />
            </div>
          )}
          
          {product.gallery && product.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.gallery.map((item, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                  {item.image && (
                    <Media resource={item.image} fill className="object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            {product.sku && (
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
            {isOnSale && (
              <span className="text-lg text-gray-500 line-through">
                ${compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm max-w-none">
              {/* You can render rich text here if needed */}
              <p>{product.description}</p>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map((variant, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">
                    {variant.name}
                  </label>
                  <select
                    value={selectedVariants[variant.name || ''] || ''}
                    onChange={(e) => handleVariantChange(variant.name || '', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select {variant.name}</option>
                    <option value={variant.value || ''}>
                      {variant.value}
                      {variant.priceModifier && variant.priceModifier !== 0 && (
                        ` (+$${variant.priceModifier.toFixed(2)})`
                      )}
                    </option>
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-md"
              >
                -
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-md"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock && product.stock > 0 ? (
              <p className="text-green-600">In stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600">Out of stock</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock === 0}
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
