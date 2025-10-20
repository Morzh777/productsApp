"use client";

import Image from "next/image";
import type { StarRatingProps } from "@/types/components/StarRating.types";

export function StarRating({ rating, count, maxRating = 5 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-1">
      {/* Полные звезды */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Image
          key={`full-${index}`}
          src="/icons/stars/star-full.png"
          alt="Полная звезда"
          width={19}
          height={17}
          unoptimized
          style={{ 
            width: '16px',
            height: '16px',
            imageRendering: 'pixelated'
          }}
        />
      ))}
      
      {/* Половина звезды */}
      {hasHalfStar && (
        <Image
          src="/icons/stars/star-half.png"
          alt="Половина звезды"
          width={10}
          height={17}
          unoptimized
          style={{ 
            width: '8px',
            height: '16px',
            imageRendering: 'pixelated'
          }}
        />
      )}
      
      {/* Рейтинг числом */}
      <span className="ml-1 text-sm text-gray-600">
        {rating}
        {count && <span className="ml-1">({count})</span>}
      </span>
    </div>
  );
}
