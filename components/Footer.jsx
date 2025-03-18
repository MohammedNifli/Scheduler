import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Schedulrr Logo" width={140} height={50} className="h-10 w-auto" />
            </Link>
            <p className="text-gray-600 mt-4 text-sm">
              Simplify your scheduling and manage your time effectively.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-600 hover:text-blue-600 text-sm">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600 text-sm">Pricing</Link></li>
              <li><Link href="/integrations" className="text-gray-600 hover:text-blue-600 text-sm">Integrations</Link></li>
              <li><Link href="/enterprise" className="text-gray-600 hover:text-blue-600 text-sm">Enterprise</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-600 hover:text-blue-600 text-sm">Help Center</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 text-sm">Blog</Link></li>
              <li><Link href="/tutorials" className="text-gray-600 hover:text-blue-600 text-sm">Tutorials</Link></li>
              <li><Link href="/api" className="text-gray-600 hover:text-blue-600 text-sm">API Documentation</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="font-medium text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 text-sm">Careers</Link></li>
              <li><Link href="/legal" className="text-gray-600 hover:text-blue-600 text-sm">Legal</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Schedulrr. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">Terms of Service</Link>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-blue-600">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;