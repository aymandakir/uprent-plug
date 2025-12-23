'use client';

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@rentfusion/database";

type Channels = {
  email: boolean;
  push: boolean;
  sms: boolean;
  telegram: boolean;
};

export function NotificationSettings({ userId }: { userId: string }) {
  const [channels, setChannels] = useState<Channels>({
    email: true,
    push: false,
    sms: false,
    telegram: false
  });

  const handleToggle = async (channel: keyof Channels) => {
    const newChannels = { ...channels, [channel]: !channels[channel] };
    setChannels(newChannels);

    try {
      await supabase
        .from("search_profiles")
        .update({
          notification_channels: Object.entries(newChannels)
            .filter(([, enabled]) => enabled)
            .map(([ch]) => ch)
        })
        .eq("user_id", userId);

      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-brand-400" />
        <h3 className="text-lg font-semibold text-gray-900">Notification Channels</h3>
      </div>

      <div className="space-y-4">
        <ChannelRow
          icon={<Mail className="w-5 h-5 text-gray-600" />}
          title="Email"
          description="Get alerts in your inbox"
          enabled={channels.email}
          onToggle={() => handleToggle("email")}
        />

        <ChannelRow
          icon={<Smartphone className="w-5 h-5 text-gray-600" />}
          title="Push Notifications"
          description="Get instant mobile alerts"
          enabled={channels.push}
          onToggle={() => handleToggle("push")}
        />

        <ChannelRow
          icon={<MessageSquare className="w-5 h-5 text-gray-600" />}
          title="SMS"
          description="Premium only - Text alerts"
          enabled={channels.sms}
          onToggle={() => handleToggle("sms")}
          muted
        />

        <ChannelRow
          icon={<MessageSquare className="w-5 h-5 text-gray-600" />}
          title="Telegram"
          description="Premium only - Telegram bot alerts"
          enabled={channels.telegram}
          onToggle={() => handleToggle("telegram")}
          muted
        />
      </div>
    </div>
  );
}

function ChannelRow({
  icon,
  title,
  description,
  enabled,
  onToggle,
  muted
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${
        muted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}

