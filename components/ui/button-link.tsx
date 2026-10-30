"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; href: string; variant?: "primary" | "outline"; external?: boolean };

export function ButtonLink({ children, variant = "primary", external = false, className = "", href, ...props }: Props) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const shared = {
    className: `button button--${variant} ${className}`,
    ...props,
  };
  const content = <><span>{children}</span><Icon size={18} strokeWidth={1.7} aria-hidden="true" />{external && <span className="sr-only"> (abre em nova aba)</span>}</>;
  return href.startsWith("/") ? <Link href={href} {...shared}>{content}</Link> : <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...shared}>{content}</a>;
}
