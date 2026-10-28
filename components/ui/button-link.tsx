"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

const MotionLink = motion.create(Link);
type Props = Omit<HTMLMotionProps<"a">, "children"> & { children: ReactNode; href: string; variant?: "primary" | "outline"; external?: boolean };

export function ButtonLink({ children, variant = "primary", external = false, className = "", href, ...props }: Props) {
  const reduced = useReducedMotion();
  const Icon = external ? ArrowUpRight : ArrowRight;
  const shared = {
    className: `button button--${variant} ${className}`,
    "data-motion": true,
    whileHover: reduced ? undefined : { y: -2 },
    whileTap: reduced ? undefined : { scale: 0.985 },
    transition: { duration: 0.18 },
    ...props,
  };
  const content = <><span>{children}</span><Icon size={18} strokeWidth={1.7} aria-hidden="true" />{external && <span className="sr-only"> (abre em nova aba)</span>}</>;
  return href.startsWith("/") ? <MotionLink href={href} {...shared}>{content}</MotionLink> : <motion.a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...shared}>{content}</motion.a>;
}
