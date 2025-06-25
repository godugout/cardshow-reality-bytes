
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center text-[#00C851] hover:text-[#00A543] mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cardshow
      </Link>
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00C851] to-[#00A543] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
          Cardshow
        </span>
      </div>
    </div>
  );
};

export default AuthHeader;
