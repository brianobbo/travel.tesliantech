/* eslint-disable no-restricted-syntax */

"use client";

import React, { useState } from "react";
import { Translate } from "@/components/translate";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { useQueryParams } from "@/hook/use-query-params";
import { ShopFilter } from "@/types/shop";
import { PriceFilter } from "./price";
import { Sorters } from "./sorters";
import { FilterRadios } from "./radios";

export const genders = [
  { value: 1, title: "male" },
  { value: 2, title: "female" },
  { value: 3, title: "all" },
];

export const FilterList = ({ onClose }: { onClose?: () => void }) => {
  const { t } = useTranslation();
  const { deleteParams } = useQueryParams();
  const { data: shopFilters, isLoading: shopFiltersLoading } = useQuery(["shopFilters"], () =>
    shopService.getShopFilters()
  );
  const [clearCallback, setClearCallback] = useState<(() => void) | null>(null);

  const handleClearAll = () => {
    deleteParams("sort");
    deleteParams("column");
    deleteParams("priceFrom");
    deleteParams("priceTo");
    deleteParams("has_discount");
    deleteParams("take");
    deleteParams("service_type");
    deleteParams("gender");
    if (onClose) {
      onClose();
    }
    if (clearCallback) {
      clearCallback();
    }
  };
  const handleCreateSortByOptions = (data?: ShopFilter) => {
    const array = data?.order_by ? Object.keys(data.order_by) : [];
    return array.map((item) => {
      let value: string = item;
      let queryKey = item;

      if (item.includes("asc") || item.includes("desc")) {
        value = item.includes("asc") ? "asc" : "desc";
        queryKey = item.replace(/_asc$|_desc$/, "");
      } else if (item.includes("min") || item.includes("max")) {
        value = item.includes("min") ? "asc" : "desc";
        queryKey = item.includes("max") ? item.replace("max", "min") : item;
      } else if (item === "has_discount") {
        value = "1";
        queryKey = "has_discount";
      }

      return { key: item, value, queryKey };
    });
  };

  const handleCreateServicesOptions = (data?: ShopFilter) => {
    const array = data?.service_type ? Object.keys(data.service_type) : [];
    return array.map((key) => ({ title: t(key), value: key }));
  };
  const sortByOptions = handleCreateSortByOptions(shopFilters);
  const takesOptions = shopFilters?.takes
    ? shopFilters.takes.map((take: { translation?: { title?: string }; id: number }) => ({
        title: take?.translation?.title || "",
        value: take.id,
      }))
    : [];
  const servicesTypeOptions = handleCreateServicesOptions(shopFilters);
  return (
    <div className="overflow-y-auto xl:sticky top-2 py-7 max-h-screen">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium">
            <Translate value="filters" />
          </h1>
          <button onClick={handleClearAll} className="text-sm font-medium">
            <Translate value="clear.all" />
          </button>
        </div>

        <Sorters
          options={sortByOptions}
          title="sort.by"
          loading={shopFiltersLoading}
          setClearCallback={setClearCallback}
        />

        <FilterRadios
          options={servicesTypeOptions}
          title="type"
          queryKey="service_type"
          loading={shopFiltersLoading}
        />
        <PriceFilter />
        <FilterRadios
          options={takesOptions}
          title="takes"
          queryKey="take"
          loading={shopFiltersLoading}
        />
        <FilterRadios options={genders} title="genders" queryKey="gender" />
      </div>
      <Button className="mt-2 mb-16 xl:hidden inline-flex" onClick={onClose} fullWidth>
        {t("show")}
      </Button>
    </div>
  );
};
