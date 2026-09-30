"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { AlertCircle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { rejectServiceOrder } from "./rejectServiceOrder";

interface RejectDeliveryModalProps {
  orderId: string;
  orderTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RejectDeliveryModal({
  orderId,
  orderTitle,
  isOpen,
  onClose,
}: RejectDeliveryModalProps) {
  const t = useTranslations("Orders");
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setReason("");
    onClose();
  };

  const handleReject = async () => {
    if (!orderId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await rejectServiceOrder(orderId, reason);
      if (res.success) {
        toast.success(
          res.message ||
            (t.has?.("deliveryRejected") ? t("deliveryRejected") : "Delivery rejected successfully")
        );
        setReason("");
        onClose();
        router.refresh();
      } else {
        toast.error(
          res.message ||
            (t.has?.("rejectDeliveryError") ? t("rejectDeliveryError") : "Failed to reject delivery")
        );
      }
    } catch {
      toast.error(
        t.has?.("rejectDeliveryUnexpected")
          ? t("rejectDeliveryUnexpected")
          : "An error occurred while rejecting delivery"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-white/15 bg-secondary text-white sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-red-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
              <AlertCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              {t.has?.("rejectDeliveryTitle") ? t("rejectDeliveryTitle") : "Reject Service Delivery"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-white/75 leading-relaxed">
            {t.has?.("rejectDeliveryDescription")
              ? t("rejectDeliveryDescription")
              : "When rejected, the order status will return to In Progress, allowing the provider to address your concerns and redeliver."}
            {orderTitle && (
              <span className="block mt-1 text-xs text-white/55 font-medium truncate">
                {orderTitle}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label htmlFor="rejection-reason" className="text-sm font-semibold text-white/90">
            {t.has?.("rejectionReason")
              ? t("rejectionReason")
              : "Reason for rejection (optional)"}
          </label>
          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              t.has?.("rejectionReasonPlaceholder")
                ? t("rejectionReasonPlaceholder")
                : "The delivery does not meet my requirements because..."
            }
            disabled={isSubmitting}
            rows={4}
            className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-primary focus-visible:ring-1"
          />
          <p className="text-xs text-white/50">
            Providing feedback helps the provider make the necessary corrections quickly.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            {t.has?.("close") ? t("close") : "Cancel"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting}
            className="rounded-xl shadow-md shadow-red-900/40"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {t.has?.("confirmRejectDelivery")
              ? t("confirmRejectDelivery")
              : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
