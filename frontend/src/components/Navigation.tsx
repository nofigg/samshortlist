'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import SearchBar from './SearchBar';

const navItems = [
  { href: '/', label: 'Home' },
  {
    label: 'Opportunities',
    items: [
      { href: '/opportunities', label: 'Browse All' },
      { href: '/opportunities/saved', label: 'Saved Opportunities' },
      { href: '/opportunities/matching', label: 'Matching Opportunities' },
    ],
  },
  {
    label: 'Federal Spending',
    items: [
      { href: '/spending', label: 'Browse Data' },
      { href: '/spending/analytics', label: 'Analytics' },
      { href: '/spending/reports', label: 'Reports' },
    ],
  },
  {
    label: 'Profile',
    items: [
      { href: '/profile', label: 'Business Profile' },
      { href: '/profile/settings', label: 'Settings' },
      { href: '/profile/preferences', label: 'Preferences' },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      
      if (
        mobileMenu &&
        !mobileMenu.contains(event.target as Node) &&
        !mobileMenuButton?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Sam Shortlist
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                if ('items' in item) {
                  const isActive = item.items.some(subItem => pathname === subItem.href);
                  return (
                    <Menu as="div" className="relative" key={item.label}>
                      <Menu.Button
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        {item.label}
                        <ChevronDownIcon className="ml-1 -mr-1 h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {item.items.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Menu.Item key={subItem.href}>
                                {({ active }) => (
                                  <Link
                                    href={subItem.href}
                                    className={`block px-4 py-2 text-sm ${active || isSubActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                  >
                                    {subItem.label}
                                  </Link>
                                )}
                              </Menu.Item>
                            );
                          })}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="ml-4">
                <SearchBar />
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              id="mobile-menu-button"
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition md:hidden bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="px-3 py-2">
                <SearchBar />
              </div>
              
              {navItems.map((item) => {
                if ('items' in item) {
                  return (
                    <Menu as="div" className="w-full" key={item.label}>
                      {({ open }) => (
                        <>
                          <Menu.Button
                            className={`w-full flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${open ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`}
                          >
                            {item.label}
                            <ChevronDownIcon
                              className={`${open ? 'transform rotate-180' : ''} ml-auto h-5 w-5 transition-transform duration-200`}
                              aria-hidden="true"
                            />
                          </Menu.Button>
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Menu.Items className="w-full py-1">
                              {item.items.map((subItem) => {
                                const isActive = pathname === subItem.href;
                                return (
                                  <Menu.Item key={subItem.href}>
                                    {({ active }) => (
                                      <Link
                                        href={subItem.href}
                                        className={`block pl-8 pr-4 py-2 text-base font-medium ${active || isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                                      >
                                        {subItem.label}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                );
                              })}
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
