"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import type { CustomOffer, OfferPaymentMethod } from "../types";

interface CustomOfferCardProps {
  offer: CustomOffer;
  messageId: string | number;
  canRespond: boolean;
  onAccept: (offerId: string, paymentMethod: OfferPaymentMethod) => Promise<void>;
  onReject: (offerId: string, messageId: string | number) => Promise<void>;
}

type DialogStep = "closed" | "payment" | "acceptConfirm" | "rejectConfirm";

const PAYMENT_LABEL: Record<OfferPaymentMethod, string> = {
  stripe: "Stripe",
  paychangu: "PayChangu",
};

function formatOfferPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function CustomOfferCard({
  offer,
  messageId,
  canRespond,
  onAccept,
  onReject,
}: CustomOfferCardProps) {
  const [step, setStep] = useState<DialogStep>("closed");
  const [paymentMethod, setPaymentMethod] = useState<OfferPaymentMethod>("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = () => {
    if (isSubmitting) return;
    setStep("closed");
  };

  const handleConfirmAccept = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAccept(offer.offerId, paymentMethod);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onReject(offer.offerId, messageId);
      setStep("closed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-2 w-72 max-w-full rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
      <p className="mb-2 text-sm font-bold text-zinc-800">Custom offer</p>
      <p className="mb-1 text-sm font-semibold leading-tight text-zinc-900">{offer.title}</p>
      {offer.description && (
        <p className="mt-1 mb-3 line-clamp-3 text-xs leading-relaxed text-zinc-600">
          {offer.description}
        </p>
      )}
      <p className="mb-4 text-lg font-bold text-primary">{formatOfferPrice(offer.price)}</p>

      {offer.status === "pending" && canRespond && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPaymentMethod("stripe");
              setStep("payment");
            }}
            className="flex-1 cursor-pointer rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setStep("rejectConfirm")}
            className="flex-1 cursor-pointer rounded-lg border border-primary bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-orange-50"
          >
            Reject
          </button>
        </div>
      )}

      {offer.status === "pending" && !canRespond && (
        <p className="inline-block rounded bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-500">
          Waiting for response
        </p>
      )}
      {offer.status === "rejected" && (
        <p className="inline-block rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-500">
          Offer rejected
        </p>
      )}
      {offer.status === "accepted" && (
        <p className="inline-block rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
          Offer accepted
        </p>
      )}

      <Dialog
        open={step !== "closed"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent
          className="max-w-sm rounded-2xl border-card-border bg-white text-card-foreground"
          onPointerDownOutside={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
        >
          {step === "payment" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Choose payment method</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Select how you want to pay {formatOfferPrice(offer.price)} for this offer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2 py-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    paymentMethod === "stripe"
                      ? "bg-primary text-white"
                      : "border border-card-border bg-section-bg text-card-foreground hover:border-primary/40"
                  }`}
                >
                  Stripe
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paychangu")}
                  className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    paymentMethod === "paychangu"
                      ? "bg-primary text-white"
                      : "border border-card-border bg-section-bg text-card-foreground hover:border-primary/40"
                  }`}
                >
                  PayChangu
                </button>
              </div>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setStep("acceptConfirm")}>
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "acceptConfirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Confirm payment</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Accept “{offer.title}” and pay {formatOfferPrice(offer.price)} with{" "}
                  {PAYMENT_LABEL[paymentMethod]}? You will be redirected to complete payment.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => setStep("payment")}
                >
                  Back
                </Button>
                <Button type="button" disabled={isSubmitting} onClick={handleConfirmAccept}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Confirm & pay
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "rejectConfirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-card-foreground">Reject offer</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Reject “{offer.title}”? The provider will be notified and you won’t be able to accept it later.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" disabled={isSubmitting} onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSubmitting}
                  onClick={handleConfirmReject}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Reject offer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
