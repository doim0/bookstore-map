interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">오류 발생</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
