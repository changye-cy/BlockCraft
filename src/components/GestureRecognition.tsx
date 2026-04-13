import { useEffect, useRef } from 'react';
import { Hands } from '@mediapipe/hands';

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
  const hands = useRef<Hands | null>(null);

  useEffect(() => {
    const initHands = async () => {
      try {
        const { Hands } = await import('@mediapipe/hands');

        hands.current = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.current.setOptions({
          maxNumHands: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.current.onResults((results) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
            onHandLandmarks(results.multiHandLandmarks[0]);
          } else {
            onHandLandmarks([]);
          }
        });

        if (videoRef.current && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                onCameraActive(true);

                const processFrame = async () => {
                  if (hands.current && videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                    try {
                      await hands.current.send({ image: videoRef.current });
                    } catch (err) {
                      console.error('Error processing frame:', err);
                    }
                  }
                  requestAnimationFrame(processFrame);
                };

                processFrame();
              }
            })
            .catch((error) => {
              console.error('Error accessing camera:', error);
              onError('Camera access denied or not available');
            });
        } else {
          onError('Camera API not available');
        }
      } catch (err) {
        console.error('Error initializing hands:', err);
        onError('Error initializing gesture recognition');
      }
    };

    initHands();

    return () => {
      // Cleanup
    };
  }, [onHandLandmarks, onError, onCameraActive]);

  return (
    <div className="w-64 h-40 bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      />
    </div>
  );
};

export default GestureRecognition;