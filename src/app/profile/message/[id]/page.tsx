import MessagePage from "@/components/(customer-pages)/profile/message";
import { getMessagePageBootstrap } from "@/components/(customer-pages)/profile/message/data";

export default async function ChatIdRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMessagePageBootstrap(id);
  return <MessagePage {...data} />;
}
