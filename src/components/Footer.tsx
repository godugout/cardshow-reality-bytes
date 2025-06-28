
import { Link } from 'react-router-dom';
import { 
  Github, 
  Twitter, 
  Discord, 
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Heart
} from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Browse Cards", href: "/cards" },
        { name: "Create Cards", href: "/creator" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Community", href: "/community" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Getting Started", href: "/guide" },
        { name: "API Documentation", href: "/docs" },
        { name: "Creator Program", href: "/creators" },
        { name: "Help Center", href: "/support" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press Kit", href: "/press" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "DMCA", href: "/dmca" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/cardshow", color: "hover:text-blue-400" },
    { name: "Discord", icon: Discord, href: "https://discord.gg/cardshow", color: "hover:text-purple-400" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/cardshow", color: "hover:text-pink-400" },
    { name: "GitHub", icon: Github, href: "https://github.com/cardshow", color: "hover:text-gray-400" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container-xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Cardshow</h3>
                  <p className="text-sm text-purple-300">Digital Trading Cards</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed max-w-md">
                The premier platform for creating, collecting, and trading digital cards. 
                Join our community of creators and collectors building the future of digital collectibles.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-slate-700/50 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-lg font-semibold text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-slate-400 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 p-8 bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-slate-700/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Stay in the loop</h4>
                <p className="text-slate-300">
                  Get the latest updates on new features, card drops, and community events.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <button className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50">
          <div className="container-xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400">
                <span>© 2024 Cardshow. Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>for collectors worldwide.</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@cardshow.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
