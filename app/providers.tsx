"use client";

import React from "react";
import "@/lib/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import SettingsProvider from "@/context/settings/settings";
import { Currency, Language } from "@/types/global";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProviderProps extends React.PropsWithChildren {
  defaultCurrency?: Currency;
  defaultLanguage?: Language;
  settings?: Record<string, string>;
  languages?: Language[];
  currencies?: Currency[];
}

const Providers = ({
  children,
  defaultCurrency,
  defaultLanguage,
  settings,
  languages,
  currencies,
}: ProviderProps) => {
  const [client] = React.useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <SettingsProvider
        languages={languages}
        currencies={currencies}
        defaultLanguage={defaultLanguage}
        defaultCurrency={defaultCurrency}
        settings={settings}
      >
        {children}
      </SettingsProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Providers;
