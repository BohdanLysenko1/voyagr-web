import { Heart } from 'lucide-react';
import { HeartableItem } from '@/types/ai';

interface HeartableItemProps<T extends HeartableItem> {
  item: T;
  onHeartToggle: (id: number) => void;
  renderContent: (item: T) => React.ReactNode;
}

export default function HeartableItemComponent<T extends HeartableItem>({
  item,
  onHeartToggle,
  renderContent
}: HeartableItemProps<T>) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/60 hover:from-white/95 hover:to-white/80 border border-gray-200/50 hover:border-gray-300/60 backdrop-blur-sm transition-all duration-300 group transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm hover:shadow-md">
      <div className="min-w-0 flex-1">
        {renderContent(item)}
      </div>
      <button 
        onClick={() => onHeartToggle(item.id)}
        className="text-gray-400 hover:text-rose-500 transition-all duration-300 flex-shrink-0 ml-3 p-2 rounded-lg hover:bg-rose-50 transform hover:scale-110 active:scale-95"
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-300 ${item.hearted ? 'text-rose-500 fill-current drop-shadow-sm animate-pulse' : 'hover:rotate-12'}`} 
        />
      </button>
    </div>
  );
}
