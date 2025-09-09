import React from 'react';

const socialLinks = [
  { href: 'https://facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
  { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
];

const Footer = () => (
  <footer className="bg-black text-white py-4 px-2">
    <div className="max-w-md mx-auto flex flex-col items-center gap-2">
      <h3 className="text-lg font-bold animate-fadein">JobPortal</h3>
      <div className="flex gap-4 mb-1">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="transition-transform transform hover:scale-125 text-xl hover:text-blue-500"
          >
            <i className={link.icon} />
          </a>
        ))}
      </div>
      <a
        href="/"
        className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
      >
        Home
      </a>
      <a
        href="mailto:support@jobportal.com"
        className="text-gray-300 hover:text-white text-sm transition-colors duration-300"
      >
        support@jobportal.com
      </a>
      <div className="text-gray-500 text-xs mt-2">
        &copy; {new Date().getFullYear()} JobPortal.
      </div>
    </div>
    <style>
      {`
        .animate-fadein { animation: fadein 0.8s ease; }
        @keyframes fadein { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
      `}
    </style>
  </footer>
);

export default Footer;
