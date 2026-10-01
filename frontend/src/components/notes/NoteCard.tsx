import type { Note } from "../../features/notes/note.types";
import { Trash2 } from "lucide-react";

type NoteCardProps = {
  note: Note;

  onComplete: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

function NoteCard({
  note,
  onComplete,
  onEdit,
  onDelete,
}: NoteCardProps) {
  const isCompleted =
    note.status === "COMPLETED";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">

      {/* Title + Status */}

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

      {/* Content */}

      {note.content && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-400">
          {note.content}
        </p>
      )}

      {/* Created date */}

      <p className="mt-4 text-xs text-slate-600">
        {new Date(
          note.createdAt
        ).toLocaleDateString()}
      </p>

      {/* Actions */}

      <div className="mt-5 flex items-center gap-2 border-t border-slate-800 pt-4">

        {!isCompleted && (
          <button
            type="button"
            onClick={() => onComplete(note)}
            className="rounded-lg bg-emerald-950 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-900"
          >
            ✓ Complete
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(note)}
          className="rounded-lg px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(note)}
          title="Delete note"
          aria-label={`Delete ${note.title}`}
          className="ml-auto rounded-lg p-2 text-slate-500 transition hover:bg-red-950 hover:text-red-400"
          >
            <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}

export default NoteCard;

