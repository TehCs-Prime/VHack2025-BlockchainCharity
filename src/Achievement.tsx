import { useState } from "react";

interface Achievement {
  id: number;
  title: string;
  progress: number;
  criteria: string;
  achieved: boolean;
  icon: string;
}

export default function AchievementDashboard() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [viewCompleted, setViewCompleted] = useState<boolean>(true);

  const achievements: Achievement[] = [
    { id: 1, title: "First-Time Donor", progress: 100, criteria: "Make your first donation", achieved: true, icon: "fa-heart text-red-600" },
    { id: 2, title: "Monthly Contributor", progress: 60, criteria: "Donate for 6 consecutive months", achieved: false, icon: "fa-trophy text-yellow-400" },
    { id: 3, title: "Top Fundraiser", progress: 30, criteria: "Raise $500 for charity", achieved: false, icon: "fa-star text-yellow-300" },
    { id: 4, title: "Active Supporter", progress: 80, criteria: "Participate in 10 charity events", achieved: false, icon: "fa-users text-purple-600" },
    { id: 5, title: "Generous Donor", progress: 50, criteria: "Donate over $1000", achieved: false, icon: "fa-gift text-green-500" },
  ];

  const completedAchievements: Achievement[] = achievements.filter((ach) => ach.progress === 100);
  const inProgressAchievements: Achievement[] = achievements.filter((ach) => ach.progress < 100).sort((a, b) => b.progress - a.progress);

  return (
    <div className="bg-gray-100 px-10 py-12 text-center">
      <h1 className="text-4xl font-semibold text-gray-800 mb-10">My Achievements</h1>
      <div className="px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-4">
        {achievements.slice(0, 4).map((ach) => (
          <div key={ach.id} className="bg-white shadow-lg rounded-xl p-6 text-left">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 p-4 rounded-full text-xl">
                <i className={`fas ${ach.icon}`}></i>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-700">{ach.title}</h2>
                <p className="text-sm text-gray-600">{ach.criteria}</p>
                <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={ach.progress === 100 ? "bg-green-500 h-full rounded-full" : "bg-blue-500 h-full rounded-full"}
                    style={{ width: `${ach.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition cursor-pointer"
          onClick={() => setShowAll(true)}
        >
          View More
        </button>
      </div>

      {showAll && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex flex-col justify-center items-center p-6">
          <div className="bg-white rounded-lg px-6 pt-6 w-full max-w-2xl h-[80%] overflow-y-auto relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Achievements</h2>
            <div className="flex justify-center gap-4 mb-4">
              <button
                className={`cursor-pointer px-4 py-2 rounded-full font-semibold ${viewCompleted ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                onClick={() => setViewCompleted(true)}
              >
                Completed
              </button>
              <button
                className={`cursor-pointer px-4 py-2 rounded-full font-semibold ${!viewCompleted ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
                onClick={() => setViewCompleted(false)}
              >
                In Progress
              </button>
            </div>

            <button
              className="cursor-pointer absolute top-4 right-4 px-3 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition"
              onClick={() => {
                setShowAll(false);
                setViewCompleted(true);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="bg-white rounded-lg px-6 w-full max-w-2xl h-[80%] overflow-y-auto">
              <div className="space-y-4">
                {(viewCompleted ? completedAchievements : inProgressAchievements).map((ach) => (
                  <div key={ach.id} className="bg-white shadow-lg rounded-xl p-6 text-left">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-200 p-4 rounded-full text-xl">
                        <i className={`fas ${ach.icon}`}></i>
                      </div>
                      <div className="flex-1 relative">
                        <h2 className="text-xl font-semibold text-gray-700">{ach.title}</h2>
                        <p className="text-sm text-gray-600">{ach.criteria}</p>
                        <p className="text-xs absolute right-0 bottom-4">{ach.progress}%</p>
                        <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className={ach.progress === 100 ? "bg-green-500 h-full rounded-full" : "bg-blue-500 h-full rounded-full"}
                            style={{ width: `${ach.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
