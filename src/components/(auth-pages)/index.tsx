
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/ui/dialog";
import { AuthContainer } from "./components/auth-container";

interface AuthModalProps {
  trigger: React.ReactNode;
}

export default function AuthModal({ trigger }: AuthModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden border-none shadow-none [&>button]:text-zinc-500 [&>button]:hover:text-zinc-800 [&>button]:opacity-100 [&>button]:top-6 [&>button]:right-6 ">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <AuthContainer />
      </DialogContent>
    </Dialog>
  );
}
