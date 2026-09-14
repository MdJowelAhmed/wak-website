import MessagePage from "@/components/(customer-pages)/profile/message";
import { getMessagePageBootstrap } from "@/components/(customer-pages)/profile/message/data";

export default async function MessageRoute() {
  const data = await getMessagePageBootstrap();
  return <MessagePage {...data} />;
}
