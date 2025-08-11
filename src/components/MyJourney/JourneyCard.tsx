"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import CircularProgress from "./CircularProgress";

export type JourneyCardProps = {
  title: string;
  imgSrc: string; // path under public/
  percent: number; // 0-100
  ringFrom?: string;
  ringTo?: string;
  href?: string; // optional destination
  imgClassName?: string; // optional fine-tuning per asset
};

/**
 * A circular tile with an image inside and an outer progress ring.
 */
export default function JourneyCard({
  title,
  imgSrc,
  percent,
  ringFrom = "#60a5fa", // blue-400
  ringTo = "#3b82f6", // blue-500
  href,
  imgClassName,
}: JourneyCardProps) {
  const inner = (
    <>
      <div className="relative" style={{ width: 132, height: 132 }}>
        <CircularProgress
          percent={percent}
          size={132}
          strokeWidth={12}
          from={ringFrom}
          to={ringTo}
          trackColor="transparent"
          ariaLabel={`${title} progress ${percent}%`}
        />
        <div className="absolute inset-[12px] rounded-full bg-white shadow-sm overflow-hidden">
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="108px"
            className={`object-cover ${imgClassName ?? ""}`}
            draggable={false}
            priority={false}
          />
        </div>
      </div>
      <div className="mt-2 text-center text-sm font-semibold text-gray-800">
        {title}
      </div>
    </>
  );

  return href ? (
    <Link
      href={href}
      aria-label={`${title} page`}
      className="group flex flex-col items-center select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
      prefetch={false}
    >
      {inner}
    </Link>
  ) : (
    <div className="flex flex-col items-center select-none">{inner}</div>
  );
}
