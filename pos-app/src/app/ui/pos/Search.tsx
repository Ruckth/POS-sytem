'use client'
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce'; // Import from the installed library


export default function Search({ onSearch }: { onSearch: (term: string) => void }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500); // Use the hook from the library

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // The handleSubmit function is no longer needed as search is triggered by debounced input

  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleInputChange}
        className="p-2 border rounded-md flex-grow"
      />
      {/* The search button is removed */}
    </div>
  );
}