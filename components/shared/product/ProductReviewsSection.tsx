import { CheckCircle2, MessageSquare, Star } from "lucide-react";

import { getServerSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { getPublicProductReviews } from "@/lib/actions/review.action";
import { cn, formatNumber } from "@/lib/utils";
import DeleteReviewButton from "./DeleteReviewButton";
import ReviewAIInsightCard from "./ReviewAIInsightCard";
import ReviewForm from "./ReviewForm";

async function ProductReviewsSection({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [reviewData, session] = await Promise.all([
    getPublicProductReviews(productId),
    getServerSession(),
  ]);

  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.role === "admin";
  const existingReview = currentUserId
    ? reviewData.reviews.find((r) => r.userId === currentUserId)
    : undefined;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="space-y-6 border-t border-border/60 pt-8"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <h2
            id="reviews-heading"
            className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
          >
            دیدگاه‌ها و امتیاز کاربران
          </h2>
          <Badge variant="secondary" className="tabular-nums">
            {formatNumber(reviewData.totalReviews)} دیدگاه
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {/* Right Column: Rating Summary + Form */}
        <aside className="space-y-5 lg:sticky lg:top-28 lg:col-span-4">
          <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums text-foreground">
                {reviewData.totalReviews > 0
                  ? formatNumber(reviewData.averageRating)
                  : "۰"}
              </span>
              <span className="text-xs text-muted-foreground">از ۵ امتیاز</span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "size-4",
                    star <= Math.round(reviewData.averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
              <span className="ms-1 text-xs text-muted-foreground tabular-nums">
                ({formatNumber(reviewData.totalReviews)} رای)
              </span>
            </div>

            {/* 5 -> 1 Distribution Bars */}
            <div className="space-y-2 border-t border-border/60 pt-3">
              {reviewData.distribution.map((row) => (
                <div
                  key={row.stars}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span className="w-8 shrink-0 tabular-nums">
                    {formatNumber(row.stars)} ★
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-7 shrink-0 text-left tabular-nums">
                    {formatNumber(row.count)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ReviewForm
            productId={productId}
            productSlug={productSlug}
            isLoggedIn={Boolean(currentUserId)}
            existingReview={existingReview}
          />
        </aside>

        {/* Left Column: AI Analysis + Reviews Feed */}
        <div className="space-y-5 lg:col-span-8">
          <ReviewAIInsightCard
            productId={productId}
            reviewCount={reviewData.totalReviews}
          />

          {reviewData.reviews.length > 0 ? (
            <div className="space-y-4">
              {reviewData.reviews.map((review) => {
                const authorName = review.user.name || "کاربر ولورا";
                const canDelete =
                  isAdmin || (currentUserId && review.userId === currentUserId);

                return (
                  <article
                    key={review.id}
                    className="space-y-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {authorName.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {authorName}
                        </span>
                        {review.isVerifiedPurchase && (
                          <Badge
                            variant="outline"
                            className="gap-1 border-emerald-500/40 text-[10px] text-emerald-600 dark:text-emerald-400"
                          >
                            <CheckCircle2
                              className="size-2.5"
                              aria-hidden="true"
                            />
                            خریدار
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {new Intl.DateTimeFormat("fa-IR").format(
                            new Date(review.createdAt),
                          )}
                        </span>
                        {canDelete && <DeleteReviewButton reviewId={review.id} />}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "size-3.5",
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30",
                            )}
                          />
                        ))}
                      </div>
                      <h3 className="text-sm font-bold text-foreground">
                        {review.title}
                      </h3>
                    </div>

                    <p className="text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
                      {review.comment}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
              <MessageSquare
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium text-foreground">
                هنوز دیدگاهی برای این محصول ثبت نشده است
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                اولین نفری باشید که تجربه خود را با دیگران به اشتراک می‌گذارد.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductReviewsSection;
