"use client";

import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import useAddressStore from "@/global-store/address";
import { Modal } from "@/components/modal";

const CountrySelectPanel = dynamic(() => import("./country-select-panel"), {
  loading: () => <LoadingCard />,
});
export const CountrySelect = ({ settings }: { settings: Record<string, string> }) => {
  const country = useAddressStore((state) => state.country);
  return (
    <Modal
      size="large"
      isOpen={!country}
      onClose={() => null}
      withCloseButton={false}
      overflowHidden={false}
    >
      <CountrySelectPanel settings={settings} />
    </Modal>
  );
};
