export type ProductCategory = 
  | 'all'
  | 'blocks'
  | 'pavers'
  | 'cement-aggregates'
  | 'steel-reinforcement'
  | 'roofing-timber'
  | 'plumbing-drainage';

export interface BulkTier {
  minQty: number;
  price: number;
  discountPercent: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  shortDescription: string;
  description: string;
  price: number;
  unit: string;
  minOrder: number;
  inStock: boolean;
  stockCount: number;
  weightKg: number;
  dimensions?: string;
  strengthRating?: string;
  coveragePerM2?: number;
  bulkTiers: BulkTier[];
  imageUrl: string;
  tags: string[];
  isFeatured?: boolean;
  specifications: Record<string, string>;
  availableColors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedGrade?: string;
}

export interface WallCalculationInput {
  lengthMeters: number;
  heightMeters: number;
  blockType: '6-inch' | '9-inch' | '4-inch';
  openings: Array<{
    id: string;
    type: 'door' | 'window';
    widthMeters: number;
    heightMeters: number;
    count: number;
  }>;
  wastagePercent: number;
}

export interface WallCalculationResult {
  grossWallAreaM2: number;
  openingsAreaM2: number;
  netWallAreaM2: number;
  blocksNeeded: number;
  blocksWithWastage: number;
  cementBagsNeeded: number;
  sandTonsNeeded: number;
  estimatedWeightTons: number;
  blockUnitCost: number;
  estimatedBlockCost: number;
}

export interface SlabCalculationInput {
  lengthMeters: number;
  widthMeters: number;
  depthMeters: number; // e.g. 0.15 for 150mm slab
  mixRatio: '1:2:4' | '1:1.5:3' | '1:3:6';
  wastagePercent: number;
}

export interface SlabCalculationResult {
  volumeM3: number;
  volumeWithWastageM3: number;
  cementBagsNeeded: number;
  sandTonsNeeded: number;
  graniteTonsNeeded: number;
  estimatedWeightTons: number;
  estimatedMaterialCost: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  distanceKm: number;
  baseTruckRate: number;
  estimatedHours: string;
}

export interface QuoteCustomerDetails {
  fullName: string;
  companyName?: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  deliveryZone: string;
  siteAccessNotes: string;
  needsOffloadingService: boolean;
  preferredDeliveryDate: string;
  paymentMethod: 'bank_transfer' | 'cash_on_delivery' | 'trade_credit' | 'pos_card';
  notes?: string;
}

export interface SavedQuote {
  id: string;
  date: string;
  customer: QuoteCustomerDetails;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  offloadingFee: number;
  total: number;
  totalWeightTons: number;
  truckLoadsEstimated: number;
}
