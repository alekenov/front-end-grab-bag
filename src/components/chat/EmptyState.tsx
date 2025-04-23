
export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-[#e8f0fe] flex items-center justify-center rounded-full mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#1a73e8" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Выберите чат для начала работы</h2>
      <p className="text-gray-500 max-w-md">
        Выберите чат из списка слева для просмотра сообщений и общения с клиентами
      </p>
    </div>
  );
}
