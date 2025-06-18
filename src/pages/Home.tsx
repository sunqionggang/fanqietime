import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">番茄钟应用</h1>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold"
      >
        开始专注
      </button>
    </div>
  );
}