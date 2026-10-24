import Image from "next/image";
import { cn } from "@repo/ui/utils";
import { APP_LOGO } from "../../../utils/constants";

type AppLogoProps = {
  /** Rendered height in px; the width follows the logo's 3:2 ratio. */
  size?: number;
  priority?: boolean;
  className?: string;
};

export function AppLogo({ size = 28, priority, className }: AppLogoProps) {
  return (
    <Image
      src={APP_LOGO}
      alt="Sadek"
      width={Math.round(size * 1.5)}
      height={size}
      priority={priority}
      className={cn("w-auto shrink-0 object-contain", className)}
      style={{ height: size }}
    />
  );
}
