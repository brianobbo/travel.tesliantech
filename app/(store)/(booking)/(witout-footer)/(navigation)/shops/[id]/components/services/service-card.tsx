import { Service } from "@/types/service";
import PlusOutlinedIcon from "@/assets/icons/plus-outlined";
import { IconButton } from "@/components/icon-button";
import { Translate } from "@/components/translate";
import { Price } from "@/components/price";
import { useParams, useRouter } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import CheckOutlinedIcon from "@/assets/icons/check-outlined";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";

interface ServiceCardProps {
  data?: Service;
  onCardClick?: () => void;
  isBookingPage?: boolean;
}

export const ServiceCard = ({ data, onCardClick, isBookingPage }: ServiceCardProps) => {
  const router = useRouter();
  const params = useParams();
  const { dispatch, state } = useBooking();
  const { setQueryParams } = useQueryParams();
  const handleButtonClick = () => {
    if (data) {
      dispatch({ type: Types.SelectService, payload: data });
      if (!isBookingPage) {
        router.push(`/shops/${params.id}/booking?offerId=${data.id}`);
        return;
      }
      setQueryParams({ offerId: data.id });
    }
  };
  const isSelected = !!state.services.find((service) => service.id === data?.id);
  return (
    <button
      onClick={onCardClick}
      className=" py-6 px-5 border-t border-gray-link hover:bg-gray-link active:bg-gray-card transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="text-start">
          <p className="text-lg font-bold">{data?.translation?.title}</p>
          <span className="text-base line-clamp-3">{data?.translation?.description}</span>
        </div>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleButtonClick();
          }}
        >
          {isSelected ? <CheckOutlinedIcon /> : <PlusOutlinedIcon />}
        </IconButton>
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="border border-gray-field rounded-full py-2 px-5">
          <span className="text-base text-gray-field">
            {data?.interval} <Translate value="min" />
          </span>
        </div>
        <span className="text-2xl font-semibold">
          <Price number={data?.total_price ?? data?.price} />
        </span>
      </div>
    </button>
  );
};
