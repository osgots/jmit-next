"use client";

import {
  Eye,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function PostViewCount({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [
    count,
    setCount,
  ] =
    useState(
      initialCount,
    );


  useEffect(() => {
    let active =
      true;


    async function register() {
      const supabase =
        createClient();


      const {
        data,
      } =
        await supabase.rpc(
          "social_register_post_view",
          {
            p_post_id:
              postId,
          },
        );


      if (
        active &&
        data !== null &&
        data !== undefined
      ) {
        setCount(
          Number(data),
        );
      }
    }


    register();


    return () => {
      active =
        false;
    };
  }, [
    postId,
  ]);


  return (
    <div
      title={`${count.toLocaleString()} views`}
      className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200"
    >
      <Eye
        size={21}
      />

      {count.toLocaleString()}
    </div>
  );
}
