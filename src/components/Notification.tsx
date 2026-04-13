interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-16 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 z-50 ${
      type === 'success' ? 'bg-green-600' :
      type === 'error' ? 'bg-red-600' :
      'bg-blue-600'
    }`}>
      <div className="text-white font-medium">{message}</div>
    </div>
  );
};

export default Notification;