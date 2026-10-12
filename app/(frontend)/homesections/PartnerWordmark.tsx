import Image from "next/image";
import type { Partner } from "@/app/(frontend)/homesections/partners";

/** Partner logo, or its typographic stand-in until official artwork is supplied. */
export default function PartnerWordmark({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <Image
        src={partner.logo}
        alt={partner.brand}
        width={240}
        height={80}
        className="h-16 w-auto object-contain"
      />
    );
  }

  const { mark } = partner;
  return (
    <span
      aria-hidden
      style={
        mark
          ? {
              fontFamily: mark.font,
              fontWeight: mark.weight,
              fontStyle: mark.italic ? "italic" : "normal",
              letterSpacing: mark.tracking,
              textTransform: mark.uppercase === false ? "none" : "uppercase",
            }
          : undefined
      }
    >
      {partner.brand}
    </span>
  );
}
