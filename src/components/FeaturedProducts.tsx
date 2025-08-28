import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

export function FeaturedProducts({ products, onAddToCart }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16 mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Products</h2>
          <p className="text-xl text-blue-100">Discover our most popular items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(product.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}