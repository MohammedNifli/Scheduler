"use client"
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 inline-block">404</div>
          <div className="absolute -top-6 -right-6 bg-red-500 text-white text-xs font-bold rounded-full h-12 w-12 flex items-center justify-center transform rotate-12 animate-pulse">
            Oops!
          </div>
        </div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        
        {/* Navigation Options */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Return Home
          </Link>
          <Link href="#" onClick={() => window.history.back()} className="px-6 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
            Go Back
          </Link>
        </div>
        
        {/* Search Suggestion */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <form action="/search" className="flex">
            <input 
              type="text" 
              name="q"
              placeholder="Search..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Need assistance? <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;