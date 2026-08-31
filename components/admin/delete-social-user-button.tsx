"use client";

import {
  Trash2,
} from "lucide-react";

import {
  deleteSocialUser,
} from "@/app/admin/social/users/actions";

export default function DeleteSocialUserButton({
  userId,
}: {
  userId: string;
}) {
  return (
    <form
      action={deleteSocialUser}
    >
      <input
        type="hidden"
        name="user_id"
        value={userId}
      />

      <button
        type="submit"
        onClick={(event) => {
          const confirmed =
            window.confirm(
              "Permanently delete this account and its Social Connect data? This cannot be undone.",
            );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
        className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
      >
        <Trash2 size={13} />

        Delete
      </button>
    </form>
  );
}
