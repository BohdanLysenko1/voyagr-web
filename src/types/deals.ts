// Deal type matching backend definition
export type DealType = 'flight' | 'hotel' | 'package' | 'restaurant';

// Deal interface matching backend Deal model
export interface Deal {
  id: string;
  type: DealType;
  title: string;
  location: string;
  continent: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating?: number;
  duration?: string;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Frontend SearchDeal extends Deal with numeric id for compatibility
export interface SearchDeal extends Omit<Deal, 'id'> {
  id: number;
}
