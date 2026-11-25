"use client";

import { useState, useTransition } from "react";
import {
  Bot,
  Loader2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyzeProductReviewsAI } from "@/lib/actions/review.action";
import { formatNumber } from "@/lib/utils";
import type { ReviewAIAnalysis } from "@/types/index";

function ReviewAIInsightCard({
  productId,
  reviewCount,
}: {
  productId: string;
  reviewCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<ReviewAIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (reviewCount === 0) {
    return null;
  }

  const handleAnalyze = () => {
    setError(null);
    startTransition(async () => {
      const res = await analyzeProductReviewsAI(productId);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
      } else {
        setError(res.message ?? "خطا در تحلیل نظرات.");
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/8 via-card to-indigo-500/8 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
            <Sparkles className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground sm:text-base">
              تحلیل هوشمند دیدگاه‌ها با AI
            </h3>
            <p className="text-[11px] text-muted-foreground">
              خلاصه‌سازی خودکار نقاط قوت، ضعف و میزان رضایت کاربران
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={analysis ? "outline" : "default"}
          size="sm"
          disabled={isPending}
          onClick={handleAnalyze}
          className="gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              در حال تحلیل...
            </>
          ) : (
            <>
              <Bot className="size-3.5" aria-hidden="true" />
              {analysis ? "تحلیل مجدد" : "شروع تحلیل هوشمند"}
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="mt-3 text-xs font-medium text-destructive">{error}</p>
      )}

      {analysis && (
        <div className="mt-4 space-y-4 border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="gap-1 border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              {analysis.source === "gemini"
                ? "تحلیل با Gemini AI"
                : "تحلیلگر هوشمند ولورا"}
            </Badge>

            <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              رضایت خریداران: {formatNumber(analysis.satisfactionPercent)}٪
            </span>
          </div>

          <p className="text-xs leading-6 text-foreground/90 sm:text-sm sm:leading-7">
            {analysis.summary}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {analysis.pros.length > 0 && (
              <div className="space-y-2 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <ThumbsUp className="size-3.5" aria-hidden="true" />
                  نقاط قوت از دید کاربران
                </p>
                <ul className="space-y-1 text-xs leading-5 text-muted-foreground">
                  {analysis.pros.map((pro) => (
                    <li key={pro}>• {pro}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.cons.length > 0 && (
              <div className="space-y-2 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <ThumbsDown className="size-3.5" aria-hidden="true" />
                  نکات قابل توجه / ضعف‌ها
                </p>
                <ul className="space-y-1 text-xs leading-5 text-muted-foreground">
                  {analysis.cons.map((con) => (
                    <li key={con}>• {con}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {analysis.recommendation && (
            <div className="rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs font-medium text-foreground">
              {analysis.recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewAIInsightCard;
