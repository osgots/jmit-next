"use client";

import {
  Maximize2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";


export default function PostMediaViewer({
  url,
  type,
  alt = "",
}: {
  url: string;
  type: "image" | "video";
  alt?: string;
}) {
  const [
    open,
    setOpen,
  ] =
    useState(false);


  useEffect(() => {
    if (!open) {
      return;
    }


    const old =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    function keyboard(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(
          false,
        );
      }
    }


    window.addEventListener(
      "keydown",
      keyboard,
    );


    return () => {
      document.body.style.overflow =
        old;

      window.removeEventListener(
        "keydown",
        keyboard,
      );
    };
  }, [
    open,
  ]);


  return (
    <>
      <div className="group relative flex h-full min-h-[360px] w-full items-center justify-center bg-black sm:min-h-[500px] lg:min-h-[680px]">

        {type ===
        "video" ? (
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            className="max-h-[760px] w-full object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() =>
              setOpen(
                true,
              )
            }
            className="flex h-full w-full cursor-zoom-in items-center justify-center"
            title="Open full-screen photo"
          >
            <img
              src={url}
              alt={alt}
              className="max-h-[760px] w-full object-contain"
            />

            <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Maximize2
                size={18}
              />
            </span>
          </button>
        )}


        {type ===
          "video" && (
          <button
            type="button"
            onClick={() =>
              setOpen(
                true,
              )
            }
            title="Open full screen"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur"
          >
            <Maximize2
              size={18}
            />
          </button>
        )}
      </div>


      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-2 sm:p-6"
          onClick={() =>
            setOpen(
              false,
            )
          }
        >
          <button
            type="button"
            onClick={() =>
              setOpen(
                false,
              )
            }
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close media"
          >
            <X
              size={23}
            />
          </button>


          {type ===
          "video" ? (
            <video
              src={url}
              controls
              autoPlay
              playsInline
              className="max-h-full max-w-full"
              onClick={(
                event,
              ) =>
                event.stopPropagation()
              }
            />
          ) : (
            <img
              src={url}
              alt={alt}
              className="max-h-full max-w-full object-contain"
              onClick={(
                event,
              ) =>
                event.stopPropagation()
              }
            />
          )}
        </div>
      )}
    </>
  );
}
