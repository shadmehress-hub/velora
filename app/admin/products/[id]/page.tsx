import { Suspense } from "react";
import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminProductById } from "@/lib/actions/admin.action";

async function EditProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}

export default function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <EditProductContent params={props.params} />
    </Suspense>
  );
}
