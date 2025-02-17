'use client';

import { useState, useEffect, Fragment } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

type SearchResult = {
  id: string;
  title: string;
  type: 'opportunity' | 'spending' | 'profile';
  href: string;
};

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Simulated search results - replace with actual API call
    const searchResults: SearchResult[] = [
      {
        id: '1',
        title: 'Recent Opportunities',
        type: 'opportunity',
        href: '/opportunities',
      },
      {
        id: '2',
        title: 'Federal Spending Data',
        type: 'spending',
        href: '/spending',
      },
      {
        id: '3',
        title: 'Business Profile',
        type: 'profile',
        href: '/profile',
      },
    ].filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setResults(searchResults);
  }, [query]);

  return (
    <>
      <button
        className="flex items-center px-3 py-2 text-sm leading-6 text-gray-400 rounded-md ring-1 ring-gray-900/10 hover:ring-gray-600"
        onClick={() => setIsOpen(true)}
      >
        <MagnifyingGlassIcon className="w-5 h-5 mr-3" aria-hidden="true" />
        Search...
        <span className="ml-auto pl-3 text-xs text-gray-400">
          <kbd className="font-sans">⌘</kbd>
          <kbd className="font-sans">K</kbd>
        </span>
      </button>

      <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery('')}>
        <Dialog onClose={setIsOpen} className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Combobox
              as="div"
              className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
              onChange={(result: SearchResult) => {
                setIsOpen(false);
                router.push(result.href);
              }}
            >
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>

              {results.length > 0 && (
                <Combobox.Options static className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
                  {results.map((result) => (
                    <Combobox.Option
                      key={result.id}
                      value={result}
                      className={({ active }) =>
                        `cursor-default select-none px-4 py-2 ${
                          active ? 'bg-indigo-600 text-white' : ''
                        }`
                      }
                    >
                      {result.title}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}

              {query && results.length === 0 && (
                <div className="px-4 py-14 text-center sm:px-14">
                  <p className="text-sm text-gray-900">No results found</p>
                </div>
              )}
            </Combobox>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
}
