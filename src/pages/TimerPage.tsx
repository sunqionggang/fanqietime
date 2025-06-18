import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CircularProgress } from '@/components/CircularProgress';


const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export default function TimerPage() {
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [showFlash, setShowFlash] = useState(false);
  const navigate = useNavigate();

  const totalSeconds = isWorking ? WORK_DURATION : BREAK_DURATION;
  const percent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const color = isWorking ? 'bg-green-500' : 'bg-blue-500';

  useEffect(() => {
    let timer: number;

    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowFlash(true);
    
    if (isWorking) {
      toast.success('休息时间到！');
      setSecondsLeft(BREAK_DURATION);
    } else {
      toast.info('继续工作吧！');
      setSecondsLeft(WORK_DURATION);
    }
    
    setIsWorking(!isWorking);
    
    setTimeout(() => setShowFlash(false), 1000);
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(isWorking ? WORK_DURATION : BREAK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black transition-colors duration-300 relative overflow-hidden ${showFlash ? color : ''}`}>
      {/* Tech background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 pointer-events-none"></div>

      {/* Status Bar */}
      <div className="p-4 flex justify-between items-center relative z-10">
        <div className={`px-3 py-1 rounded-full ${color} text-white font-bold backdrop-blur-sm bg-white/10`}>
          {isWorking ? '工作中' : '休息中'}
        </div>
        <div className="text-gray-300">🍅 0</div>
      </div>

      {/* Main Timer */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="relative w-64 h-64 mb-8">
          <CircularProgress percent={percent} color={color} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {formatTime(secondsLeft)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={toggleTimer}
            className={`px-6 py-2 rounded-lg ${color} text-white font-bold backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all`}
          >
            {isRunning ? '暂停' : '开始'}
          </button>
          <button 
            onClick={resetTimer}
            className="px-6 py-2 rounded-lg bg-gray-200/20 text-gray-200 font-bold backdrop-blur-sm hover:bg-gray-200/30 transition-all"
          >
            重置
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-gray-800 relative z-10">
        <button 
          onClick={() => navigate('/tasks')}
          className="w-full py-2 bg-gray-800/50 rounded-lg text-gray-200 font-medium hover:bg-gray-800/70 transition-all"
        >
          任务管理
        </button>
      </div>
    </div>
  );
}


