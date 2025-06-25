
interface AuthTitleProps {
  isLogin: boolean;
}

const AuthTitle = ({ isLogin }: AuthTitleProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-gray-400">
        {isLogin ? 'Sign in to your account' : 'Join the digital trading card revolution'}
      </p>
    </>
  );
};

export default AuthTitle;
