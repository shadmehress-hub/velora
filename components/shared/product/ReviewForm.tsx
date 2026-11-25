"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  MessageSquarePlus,
  Star,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  upsertReviewAction,
  type ReviewActionState,
} from "@/lib/actions/review.action";
import { cn, formatNumber } from "@/lib/utils";
import type { ReviewView } from "@/types/index";

const initialState: ReviewActionState = {
  success: false,
  message: "",
};

function ReviewForm({
  productId,
  productSlug,
  isLoggedIn,
  existingReview,
}: {
  productId: string;
  productSlug: string;
  isLoggedIn: boolean;
  existingReview?: ReviewView;
}) {
  const [state, formAction, isPending] = useActionState(
    upsertReviewAction,
    initialState,
  );
  const [rating, setRating] = useState(existingReview?.rating ?? 5);

  if (!isLoggedIn) {
    return (
      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4 text-center">
        <p className="text-xs leading-6 text-muted-foreground sm:text-sm">
          شما هم می‌توانید درباره این کالا دیدگاه خود را ثبت کنید.
        </p>
        <Link
          href={`/signin?callbackUrl=${encodeURIComponent(`/product/${productSlug}`)}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full gap-2",
          )}
        >
          <LogIn className="size-4" aria-hidden="true" />
          ورود و ثبت دیدگاه
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-border/70 bg-card p-4 shadow-xs"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
        <MessageSquarePlus
          className="size-4 text-sky-500"
          aria-hidden="true"
        />
        <h3 className="text-sm font-bold text-foreground">
          {existingReview ? "ویرایش دیدگاه شما" : "ثبت دیدگاه جدید"}
        </h3>
      </div>

      {/* Star Picker */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          امتیاز شما ({formatNumber(rating)} از ۵)
        </span>
        <div
          role="group"
          aria-label="انتخاب امتیاز از ۱ تا ۵"
          className="flex items-center gap-1"
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= rating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`امتیاز ${star} ستاره`}
                aria-pressed={star === rating}
                className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Star
                  className={cn(
                    "size-5 transition-colors",
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-title" className="text-xs">
          عنوان نظر
        </Label>
        <Input
          id="review-title"
          name="title"
          defaultValue={existingReview?.title ?? ""}
          placeholder="مثلاً کیفیت ساخت فوق‌العاده"
          required
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-comment" className="text-xs">
          متن دیدگاه
        </Label>
        <textarea
          id="review-comment"
          name="comment"
          rows={3}
          defaultValue={existingReview?.comment ?? ""}
          placeholder="تجربه خود را از کیفیت، کارایی و ارزش خرید این محصول بنویسید..."
          required
          className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      {state.message && (
        <div
          role={state.success ? "status" : "alert"}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium",
            state.success
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {state.success ? (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <Button
        type="submit"
        size="sm"
        disabled={isPending}
        className="h-9 w-full gap-1.5"
      >
        {isPending && (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        )}
        <span>{existingReview ? "به‌روزرسانی دیدگاه" : "ثبت دیدگاه"}</span>
      </Button>
    </form>
  );
}

export default ReviewForm;
