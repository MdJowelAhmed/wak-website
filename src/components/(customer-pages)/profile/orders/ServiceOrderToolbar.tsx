"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Check, Loader2, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";
import { myFetch } from "../../../../../helpers/myFetch";
import { completeServiceOrder } from "./completeServiceOrder";
import ReviewModal from "./ReviewModal";
import { isDeliveredStatus, type Order } from "./types";

export default function ServiceOrderToolbar({ order }: { order: Order }) {
  const t = useTranslations("Orders");
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const isDelivered = isDeliveredStatus(order.orderStatus);

  const handleMessage = async () => {
    if (!order.sellerId) {
      toast.error(t("missingSeller"));
      return;
    }

    setIsCreatingChat(true);
    try {
      const res = await myFetch("/chats/", {
        method: "POST",
        body: { otherParticipantId: order.sellerId },
      });

      if (res?.success) {
        const chatId = res.data?._id || res.data?.id;
        router.push(chatId ? `/profile/message/${chatId}` : "/profile/message");
      } else {
        toast.error(res?.message || t("chatError"));
      }
    } catch {
      toast.error(t("chatUnexpected"));
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleAccept = async () => {
    if (!order.dbId || isAccepting) return;

    setIsAccepting(true);
    try {
      const res = await completeServiceOrder(order.dbId);
      if (res.success) {
        toast.success(res.message || t("deliveryAccepted"));
        router.refresh();
      } else {
        toast.error(res.message || t("acceptError"));
      }
    } catch {
      toast.error(t("acceptUnexpected"));
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {isDelivered && (
        <Button
          type="button"
          onClick={handleAccept}
          disabled={isAccepting}
          className="rounded-xl shadow-md shadow-primary/30"
        >
          {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {t("accept")}
        </Button>
      )}
      <Button
        type="button"
        variant={isDelivered ? "outline" : "default"}
        onClick={handleMessage}
        disabled={isCreatingChat}
        className={
          isDelivered
            ? "rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white"
            : "rounded-xl shadow-md shadow-primary/20"
        }
      >
        {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
        {t("contactSeller")}
      </Button>
      {(order.canReview || order.alreadyReviewed) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setReviewOpen(true)}
          disabled={order.alreadyReviewed}
          className="rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <Star className="h-4 w-4" />
          {order.alreadyReviewed ? t("reviewed") : t("leaveReview")}
        </Button>
      )}
      <ReviewModal
        order={order}
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        type="service"
      />
    </div>
  );
}
