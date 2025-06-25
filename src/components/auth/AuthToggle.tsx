
interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </p>
      <button
        onClick={onToggle}
        className="text-[#00C851] hover:text-[#00A543] font-medium"
      >
        {isLogin ? 'Sign up' : 'Sign in'}
      </button>
    </div>
  );
};

export default AuthToggle;
