import Image from "next/image";

/** Approved Figma composition 39:14: outlined Sora lettering + original symbol. */
export function GroupLogo({ light = false, sizes = "350px" }: { light?: boolean; sizes?: string }) {
  return <span className={`group-logo ${light ? "group-logo--light" : "group-logo--dark"}`} role="img" aria-label="Cordeiro Group">
    <Image src="/logos/cordeiro-group-sora.svg" alt="" aria-hidden="true" width={574} height={153} sizes={sizes} unoptimized priority />
  </span>;
}

export function CompanyLogo({ company }: { company: "engenharia" | "solar" | "dreamhome" }) {
  if (company === "engenharia") return <span className="company-logo engineering-logo">
    <Image src="/logos/cordeiro-engenharia.png" alt="" width={58} height={51} sizes="58px" />
    <span><strong>Cordeiro</strong><small>ENGENHARIA</small></span>
  </span>;
  if (company === "solar") return <span className="company-logo solar-logo">
    <span className="solar-symbol"><Image src="/logos/v3.png" alt="" width={2400} height={1620} sizes="210px" /></span>
    <span><strong>V3</strong><small>ENERGIA SOLAR</small></span>
  </span>;
  return <span className="company-logo dreamhome-logo"><Image src="/logos/dreamhome.png" alt="" width={1097} height={367} sizes="220px" /></span>;
}
