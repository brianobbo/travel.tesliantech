import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { serviceService } from "@/services/service";
import { Price } from "@/components/price";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { Translate } from "@/components/translate";
import { useParams, useRouter } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import { useBooking } from "@/context/booking";
import { BookingService, Types } from "@/context/booking/booking.reducer";

interface ServiceDetailProps {
  id?: string | null;
  isBookingPage?: boolean;
}

export const ServiceDetail = ({ id, isBookingPage }: ServiceDetailProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { dispatch, state } = useBooking();
  const params = useParams();
  const { language } = useSettings();
  const { setQueryParams } = useQueryParams();
  const { data: serviceDetail } = useQuery(
    ["service", id, language?.locale],
    () => serviceService.getById(id, { lang: language?.locale }),
    {
      enabled: !!id,
    }
  );
  const handleButtonClick = () => {
    if (serviceDetail?.data) {
      const tempData: BookingService = serviceDetail.data;
      if (state.master) {
        const serviceMaster = state.master.service_masters?.find(
          (item) => item.service_id === Number(id)
        );
        const tempMaster = { ...state.master, service_master: serviceMaster || null };
        if (serviceMaster) {
          tempData.master = tempMaster;
        }
      }
      dispatch({ type: Types.SelectService, payload: serviceDetail.data });
    }
    if (!isBookingPage) {
      router.push(`/shops/${params.id}/booking?offerId=${id}`);
      return;
    }
    setQueryParams({ offerId: id, serviceId: undefined });
  };
  return (
    <div className="sm:pt-12 pb-7 sm:px-12 pt-16 px-4">
      <div className="flex items-center justify-between">
        <strong className="text-head font-semibold">
          {serviceDetail?.data?.translation?.title}
        </strong>
        <span className="text-lg font-semibold">
          <Price number={serviceDetail?.data.total_price ?? serviceDetail?.data.price} />
        </span>
      </div>
      <span className="text-sm">{serviceDetail?.data.translation?.description}</span>
      <div className="flex items-center gap-2 flex-wrap my-5">
        <div className="border border-gray-field rounded-full py-2 px-5">
          <span className="text-base text-gray-field">
            {serviceDetail?.data.interval} <Translate value="min" />
          </span>
        </div>
      </div>
      <div className="h-px w-full bg-gray-link my-10" />
      <div className="flex items-center gap-10">
        <div className="flex flex-col md:hidden">
          <span className="text-sm text-gray-field">{t("price")}</span>
          <span className="text-head font-semibold whitespace-nowrap">
            <Price number={serviceDetail?.data.total_price ?? serviceDetail?.data.price} />
          </span>
        </div>
        <Button fullWidth color="black" onClick={handleButtonClick}>
          {t("book.now")}
        </Button>
      </div>
    </div>
  );
};
