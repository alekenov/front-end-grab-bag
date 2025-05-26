
interface DemoBannerProps {
  isDemoChat: boolean;
}

export function DemoBanner({ isDemoChat }: DemoBannerProps) {
  if (!isDemoChat) return null;

  return (
    <div className="bg-amber-100 p-2 text-center text-amber-800 text-sm border-b border-amber-200">
      Вы просматриваете демонстрационный чат. Сообщения не сохраняются в базе данных.
    </div>
  );
}
