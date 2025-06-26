// "use client";
// import { useEffect, useState } from "react";
// import { MoreVertical } from "lucide-react";
// import { useSession } from "@/hooks/useSession";
// import { generateAvatarDataUri } from "@/lib/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
//   DropdownMenuShortcut,
// } from "@/components/ui/dropdown-menu";
// import { signOut } from "@/lib/methods/users";
// import { useRouter } from 'nextjs-toploader/app';

// const Profile = ({ expanded }: { expanded: boolean }) => {
//   const { session } = useSession();
//   const name = session?.user?.name ?? "Guest";
//   const email = session?.user?.email ?? "guest@example.com";
//   const [avatarSvg, setAvatarSvg] = useState("");

//   useEffect(() => {
//     if (!email) return;
//     generateAvatarDataUri(email).then(setAvatarSvg);
//   }, [email]);

//   return (
//     <div className="border-t flex p-3">
//       <div
//         className="w-10 h-10 rounded-md m-auto"
//         dangerouslySetInnerHTML={{ __html: avatarSvg }}
//       />

//       <div
//         className={`flex justify-between items-center overflow-hidden transition-all ${
//           expanded ? "w-54 ml-4" : "w-0"
//         }`}
//       >
//         <div className="leading-4">
//           <h4 className="font-semibold">{name}</h4>
//           <span className="text-xs text-gray-600">{email}</span>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <MoreVertical size={22} />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56" align="start">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>About</DropdownMenuItem>
//             <DropdownMenuItem>Privacy Police</DropdownMenuItem>
//             <DropdownMenuItem>Verify Email</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={signOut}>
//               Log out
//               <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// };

// export default Profile;

"use client";
import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { generateAvatarDataUri } from "@/lib/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { sendVerify, signOut } from "@/lib/methods/users";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner"; // Assuming sonner is used for toasts

const Profile = ({ expanded }: { expanded: boolean }) => {
  const { session } = useSession();
  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "guest@example.com";
  const [avatarSvg, setAvatarSvg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!email) return;
    generateAvatarDataUri(email).then(setAvatarSvg);
  }, [email]);

  const handleVerifyEmail = async () => {
    try {
      await sendVerify(email); // Call BetterAuth API to send verification email
      console.log(email);

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send verification email. Please try again.");
      console.error("Verification email error:", error);
    }
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical size={22} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>About</DropdownMenuItem>
            <DropdownMenuItem>Privacy Police</DropdownMenuItem>
            <DropdownMenuItem onClick={handleVerifyEmail}>
              Verify Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Profile;
