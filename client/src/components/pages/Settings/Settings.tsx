import { SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="rounded-full border p-4">
        <SettingsIcon className="size-28" />
      </div>

      <span className="text-lg font-medium">Manage your account</span>
    </div>
  );
};

export default Settings;
