// components/Footer.tsx
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Information */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Dashee</h5>
            <p className="text-gray-400">Empowering freelancers with innovative project management solutions.</p>
            <p className="text-gray-400 mt-2">© 2024 Dashee. All rights reserved.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className='flex flex-col md:flex-row md:space-x-4'>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Follow Us</h5>
            <ul className='flex flex-col md:flex-row md:space-x-4'>
              <li>
                <Link href="https://facebook.com" className="text-gray-400 hover:text-white">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" className="text-gray-400 hover:text-white">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://linkedin.com" className="text-gray-400 hover:text-white">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="text-gray-400 hover:text-white">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
            <p className="text-gray-400">Redlands, California</p>
            <p className="text-gray-400">hookerhillstudios@gmail.com</p>
            <p className="text-gray-400">+1 (909) 809-5222</p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
           Dashee is a product of <Link className="text-gray-400 cursor-pointer hover:text-white" href="https://wwwhookerhillstudios.com">Hooker Hill Studios</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
