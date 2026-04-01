interface StarRatingProps {
  rating: number;
  reviewCount?: bigint | number;
  size?: "sm" | "md";
}

export default function StarRating({
  rating,
  reviewCount,
  size = "md",
}: StarRatingProps) {
  const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];
  const stars = STAR_KEYS.map((key, i) => {
    const filled = i + 1 <= rating;
    const half = !filled && i + 0.5 <= rating;
    return { key, filled, half };
  });

  const starSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${starSize}`}>
        {stars.map((s) => (
          <span key={s.key} style={{ color: "#FF9900" }}>
            {s.filled ? "★" : s.half ? "⯨" : "☆"}
          </span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span
          className={size === "sm" ? "text-xs" : "text-sm"}
          style={{ color: "#007185" }}
        >
          (
          {typeof reviewCount === "bigint"
            ? reviewCount.toString()
            : reviewCount}
          )
        </span>
      )}
    </div>
  );
}
