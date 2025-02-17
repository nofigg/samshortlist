'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const routeNameMap: Record<string, string> = {
  opportunities: 'Opportunities',
  spending: 'Federal Spending',
  profile: 'Profile',
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const isLast = index === pathSegments.length - 1;
    const name = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return {
      href,
      name,
      isLast,
    };
  });

  return (
    <nav className="flex mb-4 overflow-hidden" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <AnimatePresence mode="popLayout">
        <motion.li
          key="home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <motion.svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
              </motion.svg>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </motion.li>
        {breadcrumbs.map(({ href, name, isLast }, index) => (
          <motion.li
            key={href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <motion.svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </motion.svg>
              {isLast ? (
                <motion.span
                  className="ml-2 text-sm font-medium text-gray-500"
                  aria-current="page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  {name}
                </motion.span>
              ) : (
                <Link
                  href={href}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    {name}
                  </motion.span>
                </Link>
              )}
            </div>
          </motion.li>
        ))}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
