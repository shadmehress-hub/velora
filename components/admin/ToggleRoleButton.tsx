"use client";

import { useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleUserRoleAction } from "@/lib/actions/admin.action";

function ToggleRoleButton({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string;
  currentRole: string;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await toggleUserRoleAction(userId);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="xs"
      disabled={isSelf || isPending}
      onClick={handleClick}
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <RefreshCw className="size-3" />
      )}
      <span>
        {isSelf
          ? "حساب فعلی"
          : currentRole === "admin"
            ? "تغییر به کاربر"
            : "ارتقا به مدیر"}
      </span>
    </Button>
  );
}

export default ToggleRoleButton;
