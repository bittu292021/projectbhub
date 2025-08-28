import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white bg-opacity-20 rounded-full p-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Updated with Our Latest Offers
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Subscribe to our newsletter and get exclusive deals, new product announcements, and more!
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <CheckCircle className="h-6 w-6" />
            <span className="text-lg font-semibold">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
        )}

        <p className="text-blue-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}