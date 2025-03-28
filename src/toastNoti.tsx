import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AchievementUnlocker() {
  const [achieved, setAchieved] = useState<boolean>(false);

  const unlockAchievement = (): void => {
    setAchieved(false);
    toast.success(
      <div className="text-left pl-2 space-y-1">
        <h1 className="text-sm">Achievement Unlocked!</h1>
        <p className="text-xl font-semibold">Top Fundraiser</p>
      </div>,
      {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#a7fca7",
          color: "#000",
          borderRadius: "8px",
          padding: "12px 30px 12px 20px",
          margin: "4px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        },
      }
    );
  };

  return (
    <div className="bg-gray-100 px-10 py-12 text-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Achievement Notification (DEMO)</h1>
      <button
        className="cursor-pointer px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition"
        onClick={unlockAchievement}
        disabled={achieved}
      >
        {achieved ? "Achievement Unlocked!" : "Unlock Achievement"}
      </button>

      {/* Toast Notification Container */}
      <Toaster />
    </div>
  );
}
