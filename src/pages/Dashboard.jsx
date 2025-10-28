// import { useEffect, useState } from "react";
// import MeetingForm from "../Components/MeetingForm";

// export default function Dashboard({ userId }) {
//   const [meetings, setMeetings] = useState([]);

//   const loadMeetings = async () => {
//     const res = await fetch(`http://localhost:4000/meetings/${userId}`);
//     const data = await res.json();
//     setMeetings(data);  
//   };

//   useEffect(() => { loadMeetings(); }, []);

//   return (
//     <div>
//       <h2>My Meetings</h2>
//       <MeetingForm userId={userId} reload={loadMeetings} />
//       <ul>
//         {meetings.map(m => (
//           <li key={m.id}>{m.title} — {m.date} at {m.time}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import MeetingForm from "../Components/MeetingForm";
import { Calendar, Clock, Plus } from "lucide-react";

export default function Dashboard({ userId }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/meetings/${userId}`);
      const data = await res.json();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to load meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMeetings(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Meetings</h1>
              <p className="text-gray-500 mt-1">Manage your upcoming meetings</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold transition duration-200 shadow-sm"
            >
              <Plus size={20} />
              {showForm ? "Cancel" : "New Meeting"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Meeting Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Meeting</h3>
            <MeetingForm userId={userId} reload={() => {
              loadMeetings();
              setShowForm(false);
            }} />
          </div>
        )}

        {/* Meetings List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">
              Upcoming Meetings ({meetings.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-500 mt-4">Loading meetings...</p>
              </div>
            </div>
          ) : meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Calendar size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No meetings yet</h3>
              <p className="text-gray-500 text-center mb-6">Get started by creating your first meeting</p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition duration-200"
              >
                <Plus size={18} />
                Create Meeting
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {meetings.map(m => (
                <div
                  key={m.id}
                  className="px-6 py-5 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {m.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-500" />
                          <span>{m.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-500" />
                          <span>{m.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}