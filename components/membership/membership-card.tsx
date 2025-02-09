import { Membership } from "@/types/membership";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import dayjs from "dayjs";

interface MembershipCardProps {
  data: Membership;
  onClick: () => void;
  isSelected?: boolean;
  expirationDate?: string;
}

export const MembershipCard = ({
  data,
  onClick,
  isSelected,
  expirationDate,
}: MembershipCardProps) => {
  const { t } = useTranslation();
  return (
    <button
      className={clsx(
        "aspect-[2/1.2] rounded-button p-3 flex flex-col justify-between w-full bg-opacity-60",
        isSelected && "ring ring-dark ring-offset-2 rounded-button"
      )}
      style={{ backgroundColor: data.color }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between w-full">
        <span className="md:text-base text-sm font-medium">{data.sessions_count}</span>
        <span className="text-sm font-medium">{data.translation?.title}</span>
      </div>
      <div className="flex items-center justify-between w-full">
        <span className="text-xs">
          {t("duration")} {data.time}
        </span>
        {!!expirationDate && (
          <span className="text-sm">{dayjs(expirationDate).format("MMM DD, YYYY - HH:mm")}</span>
        )}
      </div>
    </button>
  );
};
