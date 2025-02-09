"use client";

import { Booking } from "@/types/booking";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { ImageWithFallBack } from "@/components/image";
import MapPinIcon from "@/assets/icons/map-pin";
import { Price } from "@/components/price";
import CrossIcon from "@/assets/icons/cross";
import ConfirmIcon from "@/assets/icons/confirm";
import clsx from "clsx";
import { useSettings } from "@/hook/use-settings";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";
import { LoadingCard } from "@/components/loading";
import utc from "dayjs/plugin/utc";
import { BookingReview } from "@/app/(store)/(booking)/components/booking-review";
import { formService } from "@/services/form";
import AnchorLeftIcon from "@/assets/icons/anchor-left";
import { Modal } from "@/components/modal";
import { useModal } from "@/hook/use-modal";
import dynamic from "next/dynamic";
import { BookingForm } from "@/types/booking-form";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const BookingForm = dynamic(
  () => import("../booking-form").then((component) => ({ default: component.BookingFormPanel })),
  {
    loading: () => <LoadingCard />,
  }
);

dayjs.extend(utc);

interface BookingDetailProps {
  data?: Booking[];
  id?: number;
}

export const BookingDetail = ({ data, id }: BookingDetailProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const [isFormModalOpen, openFormModal, closeFormModal] = useModal();
  const { data: bookingList, isLoading } = useQuery(
    ["appointment", id, language?.locale],
    () => bookingService.getById(id, { lang: language?.locale }),
    {
      enabled: !!id,
    }
  );
  const { data: forms } = useQuery(
    ["form", id, language?.locale, bookingList?.data.length],
    () =>
      formService.getForm({
        service_master_ids: bookingList?.data.map((item) => item.service_master_id),
        lang: language?.locale,
      }),
    {
      enabled: !!bookingList?.data && bookingList?.data.length !== 0,
    }
  );
  const mainData = !id ? data?.[0] : bookingList?.data?.[0];
  const currentData = !id ? data : bookingList?.data;
  const totalCommissionFee = currentData?.reduce(
    (acc, curr) => acc + (curr.commission_fee ?? 0),
    0
  );
  const totalServiceFee = currentData?.reduce((acc, curr) => acc + (curr.service_fee ?? 0), 0);
  if (isLoading && !!id) {
    return <LoadingCard />;
  }
  if (!id && !data) {
    return <Empty smallText text="select.booking" animated={false} />;
  }
  return (
    <div className="xl:py-10 py-7 xl:px-12 md:px-6 px-4">
      {!id && (
        <div className="flex flex-col items-center justify-center mb-8">
          {mainData?.status === "canceled" ? (
            <div className="flex items-center justify-center bg-red rounded-full text-white w-16 h-16">
              <CrossIcon />
            </div>
          ) : (
            <span className="text-primary">
              <ConfirmIcon />
            </span>
          )}
          <span
            className={clsx(
              "text-xl font-semibold",
              mainData?.status === "canceled" ? "text-red" : "text-primary"
            )}
          >
            {t(mainData?.status || "")}
          </span>
        </div>
      )}
      <p className="md:text-2xl text-[22px] font-semibold">
        {dayjs.utc(mainData?.start_date).format("DD MMM YYYY")} {t("at")}{" "}
        {dayjs.utc(mainData?.start_date).format("HH:mm")}
      </p>
      <div className="flex items-center gap-4 border-b border-gray-link pb-5 mt-4">
        <div className="w-14 h-14 relative rounded-full border border-gray-link aspect-square ">
          <ImageWithFallBack
            src={mainData?.shop?.logo_img || ""}
            alt={mainData?.shop?.translation?.title || "shop"}
            fill
            className="object-contain rounded-full w-20 h-20"
          />
        </div>
        <div>
          <h2 className="text-xl font-medium">{mainData?.shop?.translation?.title}</h2>
          <div className="flex items-start gap-1">
            <MapPinIcon />
            <p className="text-sm line-clamp-2">{mainData?.shop?.translation?.address}</p>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <strong className="text-2xl font-semibold">{t("details")}</strong>
        {currentData?.map((item) => {
          const form = item.data?.form
            ? item.data.form.find(
                (formItem: BookingForm) => formItem?.service_master_id === item.service_master_id
              )
            : forms?.data.find(
                (formItem) => formItem?.service_master_id === item.service_master_id
              );
          return (
            <div key={item.id}>
              <div className="flex  justify-between py-4">
                <div className="flex flex-col">
                  <p className="text-xl font-semibold">
                    {item?.service_master?.service?.translation?.title}
                  </p>
                  <span className="text-base text-gray-field font-medium">
                    {t("time")}: {item?.service_master?.interval}
                    {t("min")}
                  </span>
                  <span className="text-base text-gray-field font-medium">
                    {t("status")}: {t(item.status)}
                  </span>
                  <span className="text-base text-gray-field font-medium">
                    {t("bookings.id")}: {item.id}
                  </span>
                </div>
                <p className="text-xl font-semibold">
                  <Price
                    number={item?.service_master?.service?.price}
                    customCurrency={mainData?.currency}
                  />
                </p>
              </div>
              {item.status === "ended" && (
                <BookingReview
                  service={item.service_master?.service}
                  bookingId={item.id}
                  bookingParentId={mainData?.id}
                  initialData={item.review}
                />
              )}
              {!!form && (
                <button
                  onClick={openFormModal}
                  className="text-base flex items-center justify-between focus-ring outline-none w-full font-semibold pb-4"
                >
                  {form?.translation?.title}{" "}
                  <span>
                    <AnchorLeftIcon style={{ rotate: "180deg" }} />
                  </span>
                </button>
              )}
              <Modal withCloseButton isOpen={isFormModalOpen} onClose={closeFormModal}>
                <BookingForm
                  data={form}
                  allForms={item.data?.form || forms?.data}
                  bookingId={item.id}
                  parentId={id}
                />
              </Modal>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
        <span>{t("commission.fee")}</span>
        <span>
          <Price number={totalCommissionFee} customCurrency={mainData?.currency} />
        </span>
      </div>
      <div className="flex items-center justify-between py-7 text-xl font-semibold  border-t border-gray-link">
        <span>{t("service.fee")}</span>
        <span>
          <Price number={totalServiceFee} customCurrency={mainData?.currency} />
        </span>
      </div>
      <div className="flex items-center justify-between py-7 text-[26px] font-semibold border-b border-t border-gray-link">
        <span>{t("total")}</span>
        <span>
          <Price number={mainData?.total_price_by_parent} customCurrency={mainData?.currency} />
        </span>
      </div>
      <div className="py-3">
        <strong className="text-2xl font-semibold mt-3">{t("reschedule.policy")}</strong>
        <p className="text-base">{t("reschedule.policy.description")}</p>
      </div>
      <div className="pt-3">
        <strong className="text-2xl font-semibold mt-3">{t("cancellation.policy")}</strong>
        <p className="text-base">{t("cancellation.policy.description")}</p>
      </div>
    </div>
  );
};
