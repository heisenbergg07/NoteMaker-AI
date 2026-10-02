import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import AppLayout from "../../components/layout/AppLayout";
import AICommandInput from "../../components/ai/AICommandInput";
import NoteCard from "../../components/notes/NoteCard";
import CreateNoteModal from "../../components/notes/CreateNoteModal";
import EditNoteModal from "../../components/notes/EditNoteModal";

import { useAuthStore } from "../../store/auth.store";

import {
  completeNote,
  deleteNote,
  getNotes,
} from "../../features/notes/notes.api";

import type { Note } from "../../features/notes/note.types";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // -----------------------------------
  // Notes state
  // -----------------------------------

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------------
  // Edit modal state
  // -----------------------------------

  const [selectedNote, setSelectedNote] =
    useState<Note | null>(null);

  // -----------------------------------
  // URL state
  // -----------------------------------

  const filter =
    searchParams.get("filter") ?? "all";

  const shouldOpenCreateModal =
    searchParams.get("create") === "true";

  // -----------------------------------
  // Fetch notes
  // -----------------------------------

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getNotes();

        setNotes(result);
      } catch (error) {
        console.error(
          "Failed to fetch notes:",
          error
        );

        setError(
          "Unable to load your notes."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // -----------------------------------
  // Dashboard statistics
  // -----------------------------------

  const totalNotes = notes.length;

  const pendingNotes = notes.filter(
    (note) => note.status === "PENDING"
  ).length;

  const completedNotes = notes.filter(
    (note) => note.status === "COMPLETED"
  ).length;

  // -----------------------------------
  // Filter notes
  // -----------------------------------

  const filteredNotes = notes.filter(
    (note) => {
      if (filter === "pending") {
        return note.status === "PENDING";
      }

      if (filter === "completed") {
        return note.status === "COMPLETED";
      }

      return true;
    }
  );

  // -----------------------------------
  // Create Note
  // -----------------------------------

  const handleNoteCreated = (
    newNote: Note
  ) => {
    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);
  };

  // -----------------------------------
  // Update Note
  // -----------------------------------

  const handleNoteUpdated = (
    updatedNote: Note
  ) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id
          ? updatedNote
          : note
      )
    );
  };

  // -----------------------------------
  // Complete Note
  // -----------------------------------

  const handleCompleteNote = async (
    note: Note
  ) => {
    try {
      const updatedNote =
        await completeNote(note.id);

      setNotes((currentNotes) =>
        currentNotes.map((currentNote) =>
          currentNote.id === updatedNote.id
            ? updatedNote
            : currentNote
        )
      );
    } catch (error) {
      console.error(
        "Failed to complete note:",
        error
      );
    }
  };

  // -----------------------------------
  // Delete Note
  // -----------------------------------

  const handleDeleteNote = async (
    note: Note
  ) => {
    const shouldDelete =
      window.confirm(
        `Delete "${note.title}"?`
      );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteNote(note.id);

      setNotes((currentNotes) =>
        currentNotes.filter(
          (currentNote) =>
            currentNote.id !== note.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete note:",
        error
      );
    }
  };

  // -----------------------------------
  // Filter title
  // -----------------------------------

  const getNotesTitle = () => {
    if (filter === "pending") {
      return "Pending Notes";
    }

    if (filter === "completed") {
      return "Completed Notes";
    }

    return "Recent Notes";
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">
                Welcome back
              </p>

              <h1 className="mt-1 text-3xl font-bold text-white">
                {user?.name ?? "User"}
              </h1>

              <p className="mt-2 text-slate-400">
                What would you like to do
                with your notes?
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard?create=true"
                )
              }
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              + New Note
            </button>
          </div>

          {/* AI Command */}

          <div className="mb-10 max-w-4xl">
            <AICommandInput onNoteCreated={handleNoteCreated}/>
          </div>

          {/* Statistics */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Notes"
              value={totalNotes}
            />

            <StatCard
              title="Pending"
              value={pendingNotes}
            />

            <StatCard
              title="Completed"
              value={completedNotes}
            />
          </div>

          {/* Notes Section */}

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6">

            {/* Section Header */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {getNotesTitle()}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filter === "pending" &&
                    "Notes that still need your attention."}

                  {filter === "completed" &&
                    "Notes you've completed."}

                  {filter === "all" &&
                    "Your latest notes and tasks."}
                </p>
              </div>

              {!loading && !error && (
                <span className="text-sm text-slate-500">
                  {filteredNotes.length}{" "}
                  {filteredNotes.length === 1
                    ? "note"
                    : "notes"}
                </span>
              )}
            </div>

            {/* Loading */}

            {loading && (
              <div className="flex min-h-48 items-center justify-center">
                <p className="text-sm text-slate-400">
                  Loading notes...
                </p>
              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="flex min-h-48 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Please try again later.
                  </p>
                </div>
              </div>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              filteredNotes.length === 0 && (
                <div className="flex min-h-48 items-center justify-center">
                  <div className="text-center">

                    <p className="text-slate-400">
                      {filter === "pending"
                        ? "You don't have any pending notes."
                        : filter ===
                            "completed"
                          ? "You haven't completed any notes yet."
                          : "You don't have any notes yet."}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {filter === "all"
                        ? "Ask NoteMaker AI or create your first note."
                        : "Select another category from the sidebar."}
                    </p>

                  </div>
                </div>
              )}

            {/* Notes Grid */}

            {!loading &&
              !error &&
              filteredNotes.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                  {filteredNotes.map(
                    (note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onComplete={
                          handleCompleteNote
                        }
                        onEdit={
                          setSelectedNote
                        }
                        onDelete={
                          handleDeleteNote
                        }
                      />
                    )
                  )}

                </div>
              )}

          </div>
        </div>
      </div>

      {/* Create Note Modal */}

      <CreateNoteModal
        isOpen={shouldOpenCreateModal}
        onClose={() =>
          navigate("/dashboard")
        }
        onCreated={handleNoteCreated}
      />

      {/* Edit Note Modal */}

      {selectedNote && (
        <EditNoteModal
          key={selectedNote.id}
          note={selectedNote}
          onClose={() =>
            setSelectedNote(null)
          }
          onUpdated={handleNoteUpdated}
        />
      )}

    </AppLayout>
  );
}

/* -----------------------------------
   Stat Card
------------------------------------ */

type StatCardProps = {
  title: string;
  value: number;
};

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default DashboardPage;
