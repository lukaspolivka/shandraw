import { Loader } from 'lucide-react';

const LoadingUI = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader className="animate-spin" size={40} />
    </div>
  );
};

export default LoadingUI;
