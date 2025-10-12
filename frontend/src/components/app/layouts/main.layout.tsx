import type { FC } from "react";
import { Tabs } from "@/components/ui/tabs";
import { setMsgId } from "@/store/messages.store";
import CallTab from "@/tabs/call.tabs";
import GroupTab from "@/tabs/group.tabs";
import MessagesTab from "@/tabs/messages.tabs";
import SettingsTab from "@/tabs/settings.tabs";
import SideBar, { type SideBarTabsKeysType } from "../ui/sidebar";
import Socket from "../logic/socket";

const MainLayout: FC = () => {
  const handleValueChange = (value: SideBarTabsKeysType) => {
    if (value) {
      setMsgId(null);
    }
  };
  return (
    <Tabs
      className="h-screen w-screen flex flex-row items-start gap-0"
      defaultValue={"message" satisfies SideBarTabsKeysType}
      onValueChange={handleValueChange as unknown as () => void}
      orientation="vertical"
    >
      <SideBar />

      <MessagesTab />
      <GroupTab />
      <CallTab />
      <SettingsTab />
      <Socket />
    </Tabs>
  );
};

export default MainLayout;
