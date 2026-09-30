import type { Note } from "../../features/notes/note.types";

type NoteCardProps = {
  note: Note;
};

function NoteCard({
  note,
}: NoteCardProps) {
  const isCompleted =
    note.status === "COMPLETED";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-white">
          {note.title}
        </h3>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isCompleted
              ? "bg-emerald-950 text-emerald-400"
              : "bg-amber-950 text-amber-400"
          }`}
        >
          {isCompleted
            ? "Completed"
            : "Pending"}
        </span>
      </div>

      {note.content && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-400">
          {note.content}
        </p>
      )}

      <p className="mt-4 text-xs text-slate-600">
        {new Date(
          note.createdAt
        ).toLocaleDateString()}
      </p>
    </div>
  );
}

export default NoteCard;
