
import { Badge } from "@/components/ui/badge";
import { Github, Twitter, MessageCircle, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
                Cardshow
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              The future of digital trading cards. Create, collect, and trade in stunning 3D.
            </p>
            <Badge className="bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30">
              Beta Version
            </Badge>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#00C851] transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-[#00C851] transition-colors">Creator Studio</a></li>
              <li><a href="#" className="hover:text-[#00C851] transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-[#00C851] transition-colors">3D Viewer</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#00C851] transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-[#00C851] transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-[#00C851] transition-colors">Creator Guide</a></li>
              <li><a href="#" className="hover:text-[#00C851] transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-[#00C851] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00C851] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00C851] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00C851] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Join our Discord for updates, support, and to connect with other creators.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Cardshow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-[#00C851] text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00C851] text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-[#00C851] text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
