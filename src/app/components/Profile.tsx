import { MoreVertical } from "lucide-react";

const Profile = ({ expanded }) => {
  return (
    <div>
      <div className="border-t flex  p-3">
        <div className="w-10 h-10 rounded-md bg-gray-200 text-emerald-400 flex items-center justify-center font-semibold">
          N
        </div>
        <div
          className={`flex justify-between items-center overflow-hidden transition-all ${
            expanded ? "w-54 ml-4" : "w-0"
          }`}
        >
          <div className="leading-4">
            <h4 className="font-semibold">hola</h4>
            <span className="text-xs text-gray-600">Hola@123gmail.com</span>
          </div>
          <MoreVertical size={20} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
