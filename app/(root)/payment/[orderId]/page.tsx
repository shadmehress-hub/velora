import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import ZarinpalMockGateway from "@/components/shared/checkout/ZarinpalMockGateway";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderById } from "@/lib/actions/order.action";

export const metadata: Metadata = {
  title: "درگاه پرداخت زرین‌پال",
};

async function PaymentContent({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  if (order.isPaid) {
    redirect(`/orders/${order.id}?payment=success`);
  }

  return <ZarinpalMockGateway order={order} />;
}

export default function PaymentPage(props: {
  params: Promise<{ orderId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto my-8 max-w-lg">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      }
    >
      <PaymentContent params={props.params} />
    </Suspense>
  );
}
