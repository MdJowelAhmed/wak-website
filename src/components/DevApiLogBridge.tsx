import DevApiConsole from "@/components/DevApiConsole";
import { consumeApiDebugLogs } from "../../helpers/logServerApi";

export default async function DevApiLogBridge({
  children,
}: {
  children: React.ReactNode;
}) {
  const resolved = await children;

  if (process.env.NODE_ENV !== "development") {
    return resolved;
  }

  return (
    <>
      {resolved}
      <DevApiConsole logs={consumeApiDebugLogs()} />
    </>
  );
}
