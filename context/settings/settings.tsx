"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Currency, Language } from "@/types/global";
import { defaultLocation } from "@/config/global";
import useSettingsStore from "@/global-store/settings";
import { setCookie } from "cookies-next";

interface SettingsType {
  defaultCurrency?: Currency;
  defaultLanguage?: Language;
  settings?: Record<string, string>;
  languages?: Language[];
  currencies?: Currency[];
}

interface SettingsProviderProps extends React.PropsWithChildren, SettingsType {}

const SettingsContext = createContext<SettingsType>({});

const SettingsProvider = ({
  defaultCurrency,
  settings,
  defaultLanguage,
  children,
  languages,
  currencies,
}: SettingsProviderProps) => {
  const selectedLanguage = useSettingsStore((state) => state.selectedLanguage);
  const selectedCurrency = useSettingsStore((state) => state.selectedCurrency);
  const updateLanguage = useSettingsStore((state) => state.updateSelectedLanguage);
  const updateCurrency = useSettingsStore((state) => state.updateSelectedCurrency);
  const tempSelectedLanguage = languages?.find((lang) => lang.id === selectedLanguage?.id);
  const tempSelectedCurrency = currencies?.find((currency) => currency.id === selectedCurrency?.id);
  const tempSettings = { ...settings };
  const coordinate = {
    latitude: defaultLocation.lat.toString(),
    longitude: defaultLocation.lng.toString(),
  };
  if (settings?.location) {
    const tempLocation = settings.location.split(",");
    coordinate.latitude = tempLocation[0].trim();
    coordinate.longitude = tempLocation[1].trim();
  }
  if (settings) {
    tempSettings.latitude = coordinate.latitude;
    tempSettings.longitude = coordinate.longitude;
  }

  const memoizedValues = useMemo(
    () => ({ defaultLanguage, defaultCurrency, settings: tempSettings }),
    []
  );

  useEffect(() => {
    if (tempSelectedLanguage) {
      updateLanguage(tempSelectedLanguage);
    } else {
      updateLanguage(undefined);
    }
    setCookie("lang", tempSelectedLanguage?.locale || defaultLanguage?.locale);
    if (tempSelectedCurrency) {
      updateCurrency(tempSelectedCurrency);
    }
    setCookie("currency_id", tempSelectedCurrency?.id ?? defaultCurrency?.id);
  }, []);

  return <SettingsContext.Provider value={memoizedValues}>{children}</SettingsContext.Provider>;
};

export const useSettingsContext = () => useContext(SettingsContext);

export default SettingsProvider;
