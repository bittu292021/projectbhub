import React from 'react';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  resultCount: number;
}

export function SearchResults({ query, resultCount }: SearchResultsProps) {
  if (!query) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-blue-600" />
        <span className="text-blue-800">
          {resultCount > 0 ? (
            <>Found <strong>{resultCount}</strong> results for "<strong>{query}</strong>"</>
          ) : (
            <>No results found for "<strong>{query}</strong>"</>
          )}
        </span>
      </div>
      {resultCount === 0 && (
        <p className="text-blue-700 text-sm mt-2">
          Try adjusting your search terms or browse our categories above.
        </p>
      )}
    </div>
  );
}