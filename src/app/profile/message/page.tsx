import MessagePage from "@/components/(customer-pages)/profile/message";
import { readEntityId } from "@/components/(customer-pages)/profile/message/types";
import getProfile from "../../../../helpers/getProfile";

export default async function MessageRoute() {
  const profile = await getProfile();
  return <MessagePage currentUserId={readEntityId(profile)} />;
}
