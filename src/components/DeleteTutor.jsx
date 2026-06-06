"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@heroui/react";
import { toast } from "react-hot-toast";

export function DeleteTutor({ tutor, onDeleted }) {
  const { _id, tutorName } = tutor;
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!_id) {
      toast.error("Invalid tutor ID");
      return;
    }

    setIsPending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://tutorflux-serve-2.onrender.com/tutors/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to delete tutor profile");
        return;
      }

      toast.success(`${tutorName || "Tutor"} profile deleted successfully!`);
      setIsOpen(false);
      onDeleted?.();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/50 rounded-xl font-medium transition-all"
        size="sm"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 border border-slate-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Tutor Profile
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete the profile for{" "}
                  <strong className="text-slate-700 dark:text-slate-200">{tutorName || "this tutor"}</strong>? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="light"
                onPress={() => setIsOpen(false)}
                disabled={isPending}
                className="font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                isLoading={isPending}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25"
              >
                {isPending ? "Deleting..." : "Delete Profile"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}