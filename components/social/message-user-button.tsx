import {
  MessageCircle,
} from "lucide-react";

import {
  startConversation,
} from "@/app/social-connect/actions";


export default function MessageUserButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  return (
    <form
      action={
        startConversation
      }
    >
      <input
        type="hidden"
        name="target_user_id"
        value={
          targetUserId
        }
      />

      <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <MessageCircle
          size={16}
        />

        Message
      </button>
    </form>
  );
}
