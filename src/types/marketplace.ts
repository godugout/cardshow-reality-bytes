
import type { Database } from '@/integrations/supabase/types';

export type MarketplaceListing = Database['public']['Tables']['marketplace_listings']['Row'] & {
  card?: {
    id: string;
    title: string;
    image_url: string;
    rarity: string;
  } | null;
  seller_profiles?: {
    user_id: string;
    rating: number;
    total_sales: number;
    verification_status: string;
  } | null;
  profiles?: {
    username: string;
    avatar_url?: string;
  } | null;
};

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type SellerProfile = Database['public']['Tables']['seller_profiles']['Row'];
export type MarketplaceOffer = Database['public']['Tables']['marketplace_offers']['Row'];

export interface ListingFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  rarity?: string;
  condition?: string[];
  listing_type?: string[];
  location?: string;
  seller_rating?: number;
}

export interface CreateListingData {
  card_id: string;
  price: number;
  condition: string;
  quantity: number;
  listing_type: string;
  description?: string;
  shipping_cost?: number;
  location?: string;
  estimated_delivery?: string;
  auction_end_time?: string;
  reserve_price?: number;
}

export interface ShippingAddress {
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}
