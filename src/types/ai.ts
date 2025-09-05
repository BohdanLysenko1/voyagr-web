export interface Flight {
  id: number;
  route: string;
  date: string;
  hearted: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  hearted: boolean;
}

export interface Package {
  id: number;
  name: string;
  duration: string;
  hearted: boolean;
}

export interface SidebarSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
}

export type HeartableItem = Flight | Hotel | Package;
export type StarrableItem = HeartableItem; // For backward compatibility

export interface AIPageState {
  inputValue: string;
  activeSection: string;
  isTyping: boolean;
}
