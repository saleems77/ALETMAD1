"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const MultiChannelCenter = () => {
  const [activeChannel, setActiveChannel] = useState("email");
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch('/channels.json')
      .then(res => res.json())
      .then(data => setChannels(data));
  }, []);

  return (
    <Tabs value={activeChannel} onValueChange={setActiveChannel}>
      <TabsList>
        {channels.map(channel => (
          <TabsTrigger key={channel.id} value={channel.type}>
            {channel.icon} {channel.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* ... */}
    </Tabs>
  );
};
export default MultiChannelCenter;