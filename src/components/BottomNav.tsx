import { Home, Compass, User } from "lucide-react";

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "首页", icon: Home },
    { id: "discover", label: "发现", icon: Compass },
    { id: "profile", label: "我的", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center px-4 py-1 ${
              isActive ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
