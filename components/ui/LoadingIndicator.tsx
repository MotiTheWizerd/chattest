export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
}
