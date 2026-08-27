"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { AgentSignupForm } from "../forms/agent-signup-form";
import AuthModal from "../index";

interface AgentSignupModalProps {
  trigger: React.ReactNode;
}

export function AgentSignupModal({ trigger }: AgentSignupModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitchToSignIn = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-transparent border-none shadow-none focus:outline-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Agent Sign Up</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center w-full animate-in zoom-in-95 duration-300">
          <AgentSignupForm onSwitch={handleSwitchToSignIn} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
