"use client";

import { MoreVertical } from "lucide-react";
import { useSession } from "@/hooks/useSession";

const Profile = ({ expanded }: { expanded: boolean }) => {
  const { session, loading } = useSession();

  const nameInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";
  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "not signed in";

  return (
    <div className="border-t flex p-3">
      <div className="w-10 h-10 rounded-md bg-gray-200 text-emerald-400 flex items-center justify-center font-semibold">
        {nameInitial}
      </div>
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
