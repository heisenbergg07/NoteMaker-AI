import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { Note } from "../../features/notes/note.types";
import { sendAICommand } from "../../features/auth/ai.api";

const PLACEHOLDER =
  "Ask NoteMaker AI to create, update, find or complete a note...";

type AICommandInputProps = {
  onNoteCreated: (note: Note) => void;
};

function AICommandInput({
  onNoteCreated,
}: AICommandInputProps) {
  const [command, setCommand] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [
    animatedPlaceholder,
    setAnimatedPlaceholder,
  ] = useState("");

  const recognitionRef =
    useRef<any>(null);

  const transcriptRef =
    useRef("");

  /*
   * We use refs here so the SpeechRecognition
   * callbacks always have access to the latest
   * values without stale React closures.
   */
  const loadingRef =
    useRef(false);

  const onNoteCreatedRef =
    useRef(onNoteCreated);

  /* ----------------------------------
     Keep refs synchronized
  ---------------------------------- */

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    onNoteCreatedRef.current =
      onNoteCreated;
  }, [onNoteCreated]);

  /* ----------------------------------
     Animated Placeholder
  ---------------------------------- */

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setAnimatedPlaceholder(
        PLACEHOLDER.slice(0, index)
      );

      if (
        index >= PLACEHOLDER.length
      ) {
        clearInterval(interval);
      }
    }, 35);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /* ----------------------------------
     Send AI Command
  ---------------------------------- */

  const submitCommand = async (
    text: string
  ) => {
    const trimmedCommand =
      text.trim();

    console.log(
      "Submitting AI command:",
      trimmedCommand
    );

    if (
      !trimmedCommand ||
      loadingRef.current
    ) {
      return;
    }

    try {
      loadingRef.current = true;

      setLoading(true);
      setError("");

      const result =
        await sendAICommand(
          trimmedCommand
        );

      console.log(
        "AI result:",
        result
      );

      if (
        result.type ===
          "tool_result" &&
        result.action ===
          "create_note" &&
        result.data
      ) {
        onNoteCreatedRef.current(
          result.data
        );
      }

      setCommand("");
    } catch (error) {
      console.error(
        "AI command failed:",
        error
      );

      setError(
        "Unable to process your command."
      );
    } finally {
      loadingRef.current = false;

      setLoading(false);
    }
  };

  /* ----------------------------------
     Speech Recognition
  ---------------------------------- */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    console.log(
      "SpeechRecognition:",
      SpeechRecognition
    );

    if (!SpeechRecognition) {
      console.warn(
        "Speech recognition is not supported."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;

    /*
     * Receive speech while the user
     * is speaking instead of waiting
     * only for the final result.
     */
    recognition.interimResults =
      true;

    recognition.lang = "en-US";

    /* ---------- START ---------- */

    recognition.onstart = () => {
      console.log(
        "Recognition started"
      );

      transcriptRef.current = "";

      setIsListening(true);
      setError("");
    };

    /* ---------- RESULT ---------- */

    recognition.onresult = (
      event: any
    ) => {
      console.log(
        "Recognition result:",
        event
      );

      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0]
            .transcript;
      }

      console.log(
        "Transcript:",
        transcript
      );

      transcriptRef.current =
        transcript;

      setCommand(transcript);
    };

    /* ---------- ERROR ---------- */

    recognition.onerror = (
      event: any
    ) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (
        event.error ===
        "not-allowed"
      ) {
        setError(
          "Microphone permission was denied."
        );

        return;
      }

      if (
        event.error ===
        "no-speech"
      ) {
        setError(
          "No speech detected. Please try again."
        );

        return;
      }

      setError(
        `Speech recognition error: ${event.error}`
      );
    };

    /* ---------- END ---------- */

    recognition.onend = () => {
      console.log(
        "Recognition ended"
      );

      setIsListening(false);

      const transcript =
        transcriptRef.current.trim();

      console.log(
        "Final transcript:",
        transcript
      );

      /*
       * Automatically submit once
       * speech recognition ends.
       */
      if (transcript) {
        void submitCommand(
          transcript
        );
      }
    };

    recognitionRef.current =
      recognition;

    return () => {
      recognition.abort();

      recognitionRef.current =
        null;
    };
  }, []);

  /* ----------------------------------
     Microphone
  ---------------------------------- */

  const handleMicClick = () => {
    const recognition =
      recognitionRef.current;

    console.log(
      "Mic clicked"
    );

    if (!recognition) {
      setError(
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    /*
     * Clicking while listening
     * manually stops recognition.
     * onend will then submit.
     */
    if (isListening) {
      console.log(
        "Stopping recognition"
      );

      recognition.stop();

      return;
    }

    transcriptRef.current = "";

    setCommand("");
    setError("");

    console.log(
      "Starting recognition"
    );

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start microphone:",
        error
      );
    }
  };

  /* ----------------------------------
     Manual Submit
  ---------------------------------- */

  const handleSubmit = () => {
    void submitCommand(command);
  };

  /* ----------------------------------
     Enter Key
  ---------------------------------- */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSubmit();
    }
  };

  /* ----------------------------------
     UI
  ---------------------------------- */

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3 shadow-lg">

        {/* Command Input */}

        <textarea
          value={command}
          onChange={(event) =>
            setCommand(
              event.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          placeholder={
            animatedPlaceholder
          }
          rows={3}
          disabled={loading}
          className="w-full resize-none bg-transparent px-2 py-2 text-base text-white outline-none placeholder:text-slate-500 disabled:opacity-60"
        />

        {/* Listening */}

        {isListening && (
          <p className="px-2 pb-2 text-sm text-red-400">
            🎤 Listening...
          </p>
        )}

        {/* Processing */}

        {loading && (
          <p className="px-2 pb-2 text-sm text-indigo-400">
            Processing your
            command...
          </p>
        )}

        {/* Error */}

        {error && (
          <p className="px-2 pb-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Actions */}

        <div className="mt-2 flex items-center justify-between">

          {/* Microphone */}

          <button
            type="button"
            onClick={
              handleMicClick
            }
            disabled={loading}
            title={
              isListening
                ? "Stop listening"
                : "Speak command"
            }
            className={`rounded-lg px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isListening
                ? "bg-red-950 text-red-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {isListening
              ? "⏹"
              : "🎤"}
          </button>

          {/* Send */}

          <button
            type="button"
            onClick={
              handleSubmit
            }
            disabled={
              loading ||
              isListening ||
              !command.trim()
            }
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Thinking..."
              : "Send"}
          </button>
        </div>
      </div>

      <p className="mt-2 px-2 text-xs text-slate-500">
        Type and press Enter, or
        tap the microphone and speak.
      </p>
    </div>
  );
}

export default AICommandInput;

