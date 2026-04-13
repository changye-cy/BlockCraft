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
    const initHands = async () => {
      try {
        setIsLoading(true);
        // 动态导入MediaPipe Hands
        const { Hands } = await import('@mediapipe/hands');

        hands.current = new Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        // 优化参数以提高准确性
        hands.current.setOptions({
          maxNumHands: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6,
        });

        // 处理手势识别结果
        hands.current.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
            onHandLandmarks(results.multiHandLandmarks[0]);
          } else {
            onHandLandmarks([]);
          }
        });

        // 访问相机
        if (videoRef.current && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                width: 640, 
                height: 480, 
                frameRate: { ideal: 30, max: 60 } 
              } 
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              
              // 等待视频准备就绪
              videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play().then(() => {
                  setIsCameraActive(true);
                  onCameraActive(true);
                  setIsLoading(false);
                }).catch((playError) => {
                  console.error('Error playing video:', playError);
                  onError('Error playing camera feed');
                  setIsLoading(false);
                });
              };
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            onError('Camera access denied or not available');
            setIsLoading(false);
          }
        } else {
          onError('Camera API not available');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing hands:', err);
        onError('Error initializing gesture recognition');
        setIsLoading(false);
      }
    };

    initHands();

    // 处理帧
    const processFrame = () => {
      if (hands.current && videoRef.current && !videoRef.current.paused && !videoRef.current.ended && isCameraActive) {
        const now = Date.now();
        // 帧节流，每100ms处理一帧，提高性能
        if (now - lastProcessTime.current > 100) {
          lastProcessTime.current = now;
          try {
            hands.current.send({ image: videoRef.current });
          } catch (err) {
            console.error('Error processing frame:', err);
          }
        }
      }
      requestAnimationFrame(processFrame);
    };

    const animationId = requestAnimationFrame(processFrame);

    // 清理函数
    return () => {
      cancelAnimationFrame(animationId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
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