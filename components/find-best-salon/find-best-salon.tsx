"use client";

import { countryService } from "@/services/country";
import { Country } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";

export const FindBestSalon = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { data } = useQuery(["regions", language?.locale], () =>
    countryService.getAll({ lang: language?.locale })
  );

  return (
    <div className="mt-14 mb-14">
      <div className="md:text-[26px] text-xl font-semibold mb-10 text-center">
        {t("best.salon.and.master")}
      </div>
      <ul className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 gap-4">
        {data?.data?.map((item: Country, index: number) => (
          <li className={clsx("text-lg cursor-pointer", index < 6 ? "font-bold" : "")}>
            <Link href={`/search?countryId=${item.id}`}>{item.translation?.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
