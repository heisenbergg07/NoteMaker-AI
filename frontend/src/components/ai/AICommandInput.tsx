import { useEffect, useState } from "react";

const PLACEHOLDER =
  "Ask NoteMaker AI to create, update, find or complete a note...";

function AICommandInput() {
  const [command, setCommand] = useState("");
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setAnimatedPlaceholder(
        PLACEHOLDER.slice(0, index)
      );

      if (index >= PLACEHOLDER.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return;
    }

    console.log("AI command:", trimmedCommand);

    setCommand("");
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3 shadow-lg">
        <textarea
          value={command}
          onChange={(event) =>
            setCommand(event.target.value)
          }
          placeholder={animatedPlaceholder}
          rows={3}
          className="w-full resize-none bg-transparent px-2 py-2 text-base text-white outline-none placeholder:text-slate-500"
        />

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            🎤
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!command.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AICommandInput;
