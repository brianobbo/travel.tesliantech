import { Translation } from "@/types/global";
import { Membership } from "@/types/membership";

interface GiftCartTranslation extends Translation {
  term: string;
  description: string;
}

export interface GiftCart {
  id: number;
  shop_id: number;
  time: string;
  translation: GiftCartTranslation | null;
  services_count: number;
  sessions: number;
  sessions_count: number;
  price: number;
  color: string;
}

export interface UserGiftCart {
  id: number;
  giftCart: GiftCart;
}
