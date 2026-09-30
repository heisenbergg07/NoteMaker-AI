import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import AICommandInput from "../../components/ai/AICommandInput";
import NoteCard from "../../components/notes/NoteCard";

import { useAuthStore } from "../../store/auth.store";

import { getNotes } from "../../features/notes/notes.api";
import type { Note } from "../../features/notes/note.types";

function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notes when Dashboard loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getNotes();

        setNotes(result);
      } catch (error) {
        console.error("Failed to fetch notes:", error);

        setError("Unable to load your notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Calculate dashboard statistics
  const totalNotes = notes.length;

  const pendingNotes = notes.filter(
    (note) => note.status === "PENDING"
  ).length;

  const completedNotes = notes.filter(
    (note) => note.status === "COMPLETED"
  ).length;

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-slate-400">
              Welcome back
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              {user?.name ?? "User"}
            </h1>

            <p className="mt-2 text-slate-400">
              What would you like to do with your notes?
            </p>
          </div>

          {/* AI Command Input */}
          <div className="mb-10 max-w-4xl">
            <AICommandInput />
          </div>

          {/* Dashboard Statistics */}
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

          {/* Recent Notes */}
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-6">

            {/* Notes Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Recent Notes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest notes and tasks
                </p>
              </div>

              {!loading && !error && (
                <span className="text-sm text-slate-500">
                  {notes.length}{" "}
                  {notes.length === 1 ? "note" : "notes"}
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

            {/* Empty State */}
            {!loading &&
              !error &&
              notes.length === 0 && (
                <div className="flex min-h-48 items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-400">
                      You don't have any notes yet.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Ask NoteMaker AI or create your first note.
                    </p>
                  </div>
                </div>
              )}

            {/* Notes Grid */}
            {!loading &&
              !error &&
              notes.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

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
