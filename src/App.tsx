import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CategoryFilter } from './components/CategoryFilter';
import { SortFilter } from './components/SortFilter';
import { SearchResults } from './components/SearchResults';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutModal } from './components/CheckoutModal';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ProductDetails } from './components/ProductDetails';
import { UserProfile } from './components/UserProfile';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CartProvider, useCart } from './contexts/CartContext';
import { ApiService } from './services/api';
import { categories } from './data/products';
import { Product } from './types';

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { addToCart } = useCart();

  // Load products and featured products
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsResponse, featuredResponse] = await Promise.all([
          ApiService.getProducts(selectedCategory, searchQuery),
          ApiService.getFeaturedProducts(),
        ]);
        
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }
        
        if (featuredResponse.success) {
          setFeaturedProducts(featuredResponse.data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchQuery]);

  // Apply sorting and filtering
  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products.filter(product => {
      if (inStockOnly && !product.inStock) return false;
      if (product.price > priceRange[1]) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating-desc': return b.rating - a.rating;
        case 'newest': return b.id.localeCompare(a.id);
        default: return 0;
      }
    });
  }, [products, sortBy, priceRange, inStockOnly]);

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={setSearchQuery}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        searchValue={searchQuery}
      />

      <main>
        {/* Featured Products Section */}
        {!searchQuery && selectedCategory === 'All' && (
          <FeaturedProducts
            products={featuredProducts}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Search Results */}
          <SearchResults query={searchQuery} resultCount={filteredAndSortedProducts.length} />

          {/* Sort and Filter */}
          <SortFilter
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
          />

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* User Profile */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;