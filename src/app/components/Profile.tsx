"use client";
import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { generateAvatarDataUri } from "@/lib/avatar";

const Profile = ({ expanded }: { expanded: boolean }) => {
  const { session } = useSession();
  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "guest@example.com";
  const [avatarSvg, setAvatarSvg] = useState("");

  useEffect(() => {
    if (!email) return;
    generateAvatarDataUri(email).then(setAvatarSvg);
  }, [email]);

  return (
    <div className="border-t flex p-3">
      <div
        className="w-10 h-10 rounded-md m-auto"
        dangerouslySetInnerHTML={{ __html: avatarSvg }}
      />

      <div
        className={`flex justify-between items-center overflow-hidden transition-all ${
          expanded ? "w-54 ml-4" : "w-0"
        }`}
      >
        <div className="leading-4">
          <h4 className="font-semibold">{name}</h4>
          <span className="text-xs text-gray-600">{email}</span>
        </div>
        <MoreVertical size={20} />
      </div>
    </div>
  );
};

export default Profile;
