import { useEffect, useState } from "react";
import API from "../api";

export default function Main() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("fuzzy");
  const [aiResponse, setAiResponse] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =========================
  // LOAD NOTES
  // =========================
  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // =========================
  // CREATE NOTE (FIXED)
  // =========================
  const createNote = async () => {
    try {
      const res = await API.post("/notes", {
        title: "",
        content: "New note...", // 🔥 IMPORTANT FIX
      });

      setNotes([res.data, ...notes]);
      setSelectedNote(res.data);
    } catch (err) {
      console.error("Create note error:", err.response?.data || err.message);
      alert("Failed to create note");
    }
  };

  // =========================
  // UPDATE NOTE
  // =========================
  const updateNote = async () => {
    if (!selectedNote) return;

    try {
      await API.put(`/notes/${selectedNote._id}`, selectedNote);
      fetchNotes();
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to save note");
    }
  };

  // =========================
  // SEARCH
  // =========================
  const searchNotes = async () => {
    if (!query.trim()) {
      fetchNotes();
      return;
    }

    try {
      const res = await API.get(
        `/notes/search?q=${encodeURIComponent(query)}&mode=${mode}`
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      alert("Search failed");
    }
  };

  // =========================
  // AI QUERY
  // =========================
  const queryAI = async () => {
    if (!query.trim()) return;

    try {
      const res = await API.post("/llm/query-notes", {
        query,
      });
      setAiResponse(res.data.response);
    } catch (err) {
      console.error("AI error:", err.response?.data || err.message);
      setAiResponse("AI request failed");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const deleteNote = async () => {
  if (!selectedNote) return;

  try {
    await API.delete(`/notes/${selectedNote._id}`);

    // remove from UI
    setNotes(notes.filter(n => n._id !== selectedNote._id));
    setSelectedNote(null);
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert("Failed to delete note");
  }
};

  return (
    <div className="flex flex-col h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-900 text-white">
        <h1 className="font-bold text-lg">Notes AI</h1>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="flex flex-1">

        {/* ================= LEFT PANEL ================= */}
        <div className="w-1/4 border-r p-3 overflow-y-auto">
          <div className="flex mb-2 gap-2">
            <input
              className="border p-1 w-full"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="fuzzy">Fuzzy</option>
              <option value="exact">Exact</option>
            </select>
          </div>

          <button
            onClick={searchNotes}
            className="w-full bg-gray-200 p-1 mb-2"
          >
            Search
          </button>

          <button
            onClick={createNote}
            className="w-full bg-blue-500 text-white p-1 mb-3 hover:bg-blue-600"
          >
            + New Note
          </button>

          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => setSelectedNote(note)}
              className={`p-2 border mb-2 cursor-pointer hover:bg-gray-100 ${
                selectedNote?._id === note._id ? "bg-gray-200" : ""
              }`}
            >
              <div className="font-bold">
                {note.title || "Untitled"}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {note.content}
              </div>
            </div>
          ))}
        </div>

        {/* ================= CENTER EDITOR ================= */}
        <div className="w-2/4 p-4">
          {selectedNote ? (
            <>
              <input
                className="w-full border p-2 mb-2 text-lg"
                placeholder="Title"
                value={selectedNote.title}
                onChange={(e) =>
                  setSelectedNote({
                    ...selectedNote,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                className="w-full border p-2 h-64"
                placeholder="Write your note..."
                value={selectedNote.content}
                onChange={(e) =>
                  setSelectedNote({
                    ...selectedNote,
                    content: e.target.value,
                  })
                }
              />

              <div className="flex gap-2 mt-2">
                <button
                  onClick={updateNote}
                  className="bg-green-500 text-white p-2 hover:bg-green-600"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 text-white p-2 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a note</p>
          )}
        </div>

        {/* ================= RIGHT AI PANEL ================= */}
        <div className="w-1/4 border-l p-3">
          <h2 className="font-bold mb-2">AI Assistant</h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Ask about your notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={queryAI}
            className="w-full bg-purple-500 text-white p-2 hover:bg-purple-600"
          >
            Ask AI
          </button>

          <div className="mt-3 text-sm whitespace-pre-wrap">
            {aiResponse}
          </div>
        </div>
        {showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    
    <div className="bg-white p-6 rounded shadow-lg w-80">
      <h2 className="text-lg font-bold mb-3">Delete Note?</h2>
      
      <p className="text-sm text-gray-600 mb-4">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await deleteNote();
            setShowDeleteModal(false);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete "<b>{selectedNote?.title || "Untitled"}</b>"
        </button>

      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}