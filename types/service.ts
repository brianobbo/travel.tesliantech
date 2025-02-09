import { Translation } from "@/types/global";
import { ProductGallery } from "@/types/product";
import { Shop } from "@/types/shop";

interface ServiceTranslation extends Translation {
  description: string;
}

export interface Service {
  id: number;
  slug: string;
  category_id?: number;
  shop_id?: number;
  status: string;
  price: number;
  interval: number;
  pause: number;
  type: string;
  commission_fee: number;
  img: string;
  translation: ServiceTranslation | null;
  galleries: ProductGallery[] | null;
  min_price?: number;
  total_price: number;
}

export interface ServiceMaster {
  active: boolean;
  commission_fee: number;
  created_at: string;
  discount?: number | null;
  id: number;
  interval: number;
  master_id: number;
  pause: number;
  price: number;
  service: Service | null;
  service_id: number;
  shop: Shop | null;
  shop_id: number;
  total_price: number;
  type: string;
  updated_at: string;
}

export interface ServiceMasterInfo {
  service_id: number;
  master_id: number;
  id: number;
}
