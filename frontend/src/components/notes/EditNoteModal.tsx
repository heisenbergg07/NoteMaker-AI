import { useState } from "react";

import { updateNote } from "../../features/notes/notes.api";
import type { Note } from "../../features/notes/note.types";

type EditNoteModalProps = {
  note: Note;
  onClose: () => void;
  onUpdated: (note: Note) => void;
};

function EditNoteModal({
  note,
  onClose,
  onUpdated,
}: EditNoteModalProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(
    note.content ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updatedNote = await updateNote(
        note.id,
        {
          title: title.trim(),
          content: content.trim(),
        }
      );

      onUpdated(updatedNote);

      onClose();
    } catch (error) {
      console.error(
        "Failed to update note:",
        error
      );

      setError("Unable to update note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Edit Note
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your note details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Content
            </label>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={
              loading || !title.trim()
            }
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditNoteModal;
