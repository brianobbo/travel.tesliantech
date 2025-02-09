"use client";

import { Shop } from "@/types/shop";
import { BookingTotal } from "@/app/(store)/(booking)/(witout-footer)/(navigation)/shops/[id]/components/booking-total";
import { DefaultResponse } from "@/types/global";
import { useMutation } from "@tanstack/react-query";
import { Booking, BookingCreateBody } from "@/types/booking";
import { bookingService } from "@/services/booking";
import { useBooking } from "@/context/booking";
import { useSettings } from "@/hook/use-settings";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Modal } from "@/components/modal";
import { LoadingCard } from "@/components/loading";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";

dayjs.extend(utc);

const BookingDetail = dynamic(
  () =>
    import("@/app/(store)/(booking)/components/booking-detail").then((component) => ({
      default: component.BookingDetail,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

interface PaymentFinishProps {
  shop?: DefaultResponse<Shop>;
}

export const PaymentFinish = ({ shop }: PaymentFinishProps) => {
  const router = useRouter();
  const { state } = useBooking();
  const { currency } = useSettings();
  const [orderDetail, setOrderDetail] = useState<Booking[] | undefined>();
  const { mutate: createBooking, isLoading } = useMutation({
    mutationFn: (body: BookingCreateBody) => bookingService.create(body),
    onSuccess: (res) => {
      setOrderDetail(res.data);
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const handleCreateBooking = useCallback(() => {
    const body: BookingCreateBody = {
      data: state.services.map((service) => ({
        service_master_id: service.master?.service_master?.id,
        note: service.note,
        data: service.type === "offline_out" ? state.address : undefined,
        user_member_ship_id: service.userMemberShipId,
      })),
      currency_id: currency?.id,
      payment_id: state.payment?.id,
      start_date: `${dayjs.utc(state.date).format("YYYY-MM-DD")} ${state.time}`,
      user_gift_cart_id: state.giftCart?.id,
    };
    createBooking(body);
  }, [state]);

  const handleClose = () => {
    setOrderDetail(undefined);
    router.replace("/appointments");
  };

  return (
    <>
      <BookingTotal checkPayment isLoading={isLoading} data={shop} onClick={handleCreateBooking} />
      <Modal isOpen={!!orderDetail} onClose={handleClose} withCloseButton>
        <BookingDetail data={orderDetail} />
      </Modal>
    </>
  );
};
