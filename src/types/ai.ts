export interface Flight {
  id: number;
  route: string;
  date: string;
  starred: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  starred: boolean;
}

export interface Package {
  id: number;
  name: string;
  duration: string;
  starred: boolean;
}

export interface SidebarSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
}

export type StarrableItem = Flight | Hotel | Package;

export interface AIPageState {
  inputValue: string;
  activeSection: string;
  isTyping: boolean;
}
