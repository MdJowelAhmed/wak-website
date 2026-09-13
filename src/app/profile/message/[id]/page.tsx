import MessagePage from "@/components/(customer-pages)/profile/message";
import { readEntityId } from "@/components/(customer-pages)/profile/message/types";
import getProfile from "../../../../../helpers/getProfile";

export default async function ChatIdRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile();
  return <MessagePage currentUserId={readEntityId(profile)} initialChatId={id} />;
}
