/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TUser } from "@/utils/types";
import { Badge } from "lucide-react";

//* Info UI settings
export const InfoRow = ({
    icon: Icon,
    user,
    label,
    value,
    badge,
  }: {
    icon: any;
    user: TUser;
    label: string;
    value?: string;
    badge?: boolean;
  }) => (
    <div className="flex items-center gap-3 text-gray-700">
      <Icon className="w-5 h-5 text-sky-600" />
      <span className="font-semibold">{label}:</span>
      {badge ? (
        <Badge
          // variant={value === "active" ? "default" : "secondary"}
          className={`ml-2 ${
            user?.status === "active" ? "bg-green-700" : "bg-red-700"
          }`}
        >
          {value || "Not provided"}
        </Badge>
      ) : (
        <span>{value || "Not provided"}</span>
      )}
    </div>
  );