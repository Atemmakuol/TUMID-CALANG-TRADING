import { Product, CartItem, WallCalculationInput, WallCalculationResult, SlabCalculationInput, SlabCalculationResult } from '../types';
import { PRODUCTS, DELIVERY_ZONES } from '../data/products';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    const tons = kg / 1000;
    return `${tons.toFixed(2)} Tons (${Math.round(kg).toLocaleString()} kg)`;
  }
  return `${Math.round(kg).toLocaleString()} kg`;
}

export function getProductUnitPrice(product: Product, quantity: number): { unitPrice: number; discountPercent: number } {
  if (!product.bulkTiers || product.bulkTiers.length === 0) {
    return { unitPrice: product.price, discountPercent: 0 };
  }

  // Sort tiers descending by minQty
  const sortedTiers = [...product.bulkTiers].sort((a, b) => b.minQty - a.minQty);
  const matchedTier = sortedTiers.find(tier => quantity >= tier.minQty);

  if (matchedTier) {
    return { unitPrice: matchedTier.price, discountPercent: matchedTier.discountPercent };
  }

  return { unitPrice: product.price, discountPercent: 0 };
}

export function calculateCartTotals(items: CartItem[], selectedZoneId: string, needsOffloading: boolean) {
  let subtotal = 0;
  let originalSubtotal = 0;
  let totalWeightKg = 0;

  items.forEach(item => {
    const { unitPrice } = getProductUnitPrice(item.product, item.quantity);
    subtotal += unitPrice * item.quantity;
    originalSubtotal += item.product.price * item.quantity;
    totalWeightKg += item.product.weightKg * item.quantity;
  });

  const totalDiscount = Math.max(0, originalSubtotal - subtotal);
  const totalWeightTons = totalWeightKg / 1000;

  // Truck logistics calculation: A standard heavy tipper / flatbed holds approx 20 tons
  const truckLoadsEstimated = Math.max(1, Math.ceil(totalWeightTons / 20));

  const zone = DELIVERY_ZONES.find(z => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  const deliveryFee = items.length > 0 ? zone.baseTruckRate * truckLoadsEstimated : 0;
  
  // Offloading service rate: ~$20 per truck load or manual labor fee
  const offloadingFee = (items.length > 0 && needsOffloading) ? 25.0 * truckLoadsEstimated : 0;

  const grandTotal = subtotal + deliveryFee + offloadingFee;

  return {
    subtotal,
    originalSubtotal,
    totalDiscount,
    totalWeightKg,
    totalWeightTons,
    truckLoadsEstimated,
    deliveryFee,
    offloadingFee,
    grandTotal,
    zone,
  };
}

export function calculateWallBlocks(input: WallCalculationInput): WallCalculationResult {
  const grossWallAreaM2 = input.lengthMeters * input.heightMeters;
  
  let openingsAreaM2 = 0;
  input.openings.forEach(op => {
    openingsAreaM2 += op.widthMeters * op.heightMeters * op.count;
  });

  const netWallAreaM2 = Math.max(0, grossWallAreaM2 - openingsAreaM2);
  
  // Standard block coverage: 10 blocks per m2 with 10mm mortar
  const blocksNeeded = Math.ceil(netWallAreaM2 * 10);
  const blocksWithWastage = Math.ceil(blocksNeeded * (1 + input.wastagePercent / 100));

  // Cement and sand for mortar
  // 6-inch blocks: ~1 bag cement per 35 blocks
  // 9-inch blocks: ~1 bag cement per 25 blocks
  // 4-inch blocks: ~1 bag cement per 45 blocks
  let blocksPerCementBag = 35;
  let blockUnitPrice = 3.40; // Default 6"
  let blockUnitWeightKg = 18.5;

  if (input.blockType === '9-inch') {
    blocksPerCementBag = 25;
    const prod = PRODUCTS.find(p => p.id === 'blk-9-hollow-hd');
    if (prod) {
      blockUnitPrice = prod.price;
      blockUnitWeightKg = prod.weightKg;
    }
  } else if (input.blockType === '4-inch') {
    blocksPerCementBag = 45;
    const prod = PRODUCTS.find(p => p.id === 'blk-4-solid-partition');
    if (prod) {
      blockUnitPrice = prod.price;
      blockUnitWeightKg = prod.weightKg;
    }
  } else {
    const prod = PRODUCTS.find(p => p.id === 'blk-6-hollow-hd');
    if (prod) {
      blockUnitPrice = prod.price;
      blockUnitWeightKg = prod.weightKg;
    }
  }

  const cementBagsNeeded = Math.ceil(blocksWithWastage / blocksPerCementBag);
  // Sand needed: ~0.25 tons per 100 blocks
  const sandTonsNeeded = parseFloat(((blocksWithWastage / 100) * 0.25).toFixed(2));
  const estimatedWeightTons = parseFloat(((blocksWithWastage * blockUnitWeightKg) / 1000).toFixed(2));
  const estimatedBlockCost = blocksWithWastage * blockUnitPrice;

  return {
    grossWallAreaM2: parseFloat(grossWallAreaM2.toFixed(2)),
    openingsAreaM2: parseFloat(openingsAreaM2.toFixed(2)),
    netWallAreaM2: parseFloat(netWallAreaM2.toFixed(2)),
    blocksNeeded,
    blocksWithWastage,
    cementBagsNeeded,
    sandTonsNeeded,
    estimatedWeightTons,
    blockUnitCost: blockUnitPrice,
    estimatedBlockCost: parseFloat(estimatedBlockCost.toFixed(2)),
  };
}

export function calculateSlabConcrete(input: SlabCalculationInput): SlabCalculationResult {
  const volumeM3 = input.lengthMeters * input.widthMeters * input.depthMeters;
  const volumeWithWastageM3 = volumeM3 * (1 + input.wastagePercent / 100);
  
  // Dry volume coefficient: 1.54
  const dryVolume = volumeWithWastageM3 * 1.54;

  let cementRatio = 1;
  let sandRatio = 2;
  let graniteRatio = 4;

  if (input.mixRatio === '1:1.5:3') {
    cementRatio = 1;
    sandRatio = 1.5;
    graniteRatio = 3;
  } else if (input.mixRatio === '1:3:6') {
    cementRatio = 1;
    sandRatio = 3;
    graniteRatio = 6;
  }

  const totalParts = cementRatio + sandRatio + graniteRatio;

  // Cement: 1440 kg/m3 density, 50kg bag
  const cementVol = (cementRatio / totalParts) * dryVolume;
  const cementBagsNeeded = Math.ceil((cementVol * 1440) / 50);

  // Sand: 1600 kg/m3 density -> tons
  const sandVol = (sandRatio / totalParts) * dryVolume;
  const sandTonsNeeded = parseFloat(((sandVol * 1600) / 1000).toFixed(2));

  // Granite: 1500 kg/m3 density -> tons
  const graniteVol = (graniteRatio / totalParts) * dryVolume;
  const graniteTonsNeeded = parseFloat(((graniteVol * 1500) / 1000).toFixed(2));

  const estimatedWeightTons = parseFloat((volumeWithWastageM3 * 2.4).toFixed(2)); // reinforced concrete ~2400kg/m3

  // Rough estimation: Cement @ ~$9.80/bag, Sand @ ~$9/ton, Granite @ ~$12/ton
  const estimatedMaterialCost = parseFloat((
    cementBagsNeeded * 9.80 +
    sandTonsNeeded * 9.00 +
    graniteTonsNeeded * 12.00
  ).toFixed(2));

  return {
    volumeM3: parseFloat(volumeM3.toFixed(2)),
    volumeWithWastageM3: parseFloat(volumeWithWastageM3.toFixed(2)),
    cementBagsNeeded,
    sandTonsNeeded,
    graniteTonsNeeded,
    estimatedWeightTons,
    estimatedMaterialCost,
  };
}
