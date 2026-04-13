import { useEffect, useRef, useState } from 'react';

interface GestureRecognitionProps {
  onHandLandmarks: (landmarks: any[]) => void;
  onError: (error: string) => void;
  onCameraActive: (active: boolean) => void;
}

const GestureRecognition: React.FC<GestureRecognitionProps> = ({
  onHandLandmarks,
  onError,
  onCameraActive,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hands = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastProcessTime = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // 暂时禁用手势识别功能，以解决启动问题
    setIsLoading(false);
    setIsCameraActive(false);
    onCameraActive(false);

    // 清理函数
    return () => {
      onCameraActive(false);
    };
  }, [onHandLandmarks, onError, onCameraActive]);

  return (
    <div className="w-64 h-40 bg-secondary rounded-lg overflow-hidden border border-mid-gray/30 shadow-lg relative">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
          <div className="text-primary text-sm">Initializing camera...</div>
        </div>
      ) : !isCameraActive ? (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
          <div className="text-accent-orange text-sm">Camera not active</div>
        </div>
      ) : null}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      {/* 手势识别状态指示器 */}
      {isCameraActive && (
        <div className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm text-secondary text-xs px-2 py-1 rounded">
          Gesture Recognition: Active
        </div>
      )}
    </div>
  );
};

export default GestureRecognition;