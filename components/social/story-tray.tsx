"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Loader2,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import MentionText from "@/components/social/mention-text";
import MentionTextarea from "@/components/social/mention-textarea";

import {
  createClient,
} from "@/lib/supabase/client";


type Story = {
  id: string;
  user_id: string;
  media_url: string;
  media_path: string;
  media_type:
    | "image"
    | "video";
  caption: string | null;
  created_at: string;
  expires_at: string;
};


type Profile = {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
};


type StoryGroup = {
  profile: Profile;
  stories: Story[];
};


const MAX_STORY_SIZE =
  25 *
  1024 *
  1024;


const STORY_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];


export default function StoryTray({
  currentUserId,
  canPost,
}: {
  currentUserId:
    | string
    | null;
  canPost: boolean;
}) {
  const supabase =
    useMemo(
      () =>
        createClient() as any,
      [],
    );


  const [
    groups,
    setGroups,
  ] =
    useState<StoryGroup[]>(
      [],
    );


  const [
    viewedStoryIds,
    setViewedStoryIds,
  ] =
    useState<Set<string>>(
      new Set(),
    );


  const [
    likedStoryIds,
    setLikedStoryIds,
  ] =
    useState<Set<string>>(
      new Set(),
    );


  const [
    likeCounts,
    setLikeCounts,
  ] =
    useState<Map<string, number>>(
      new Map(),
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    composerOpen,
    setComposerOpen,
  ] =
    useState(false);


  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(
      null,
    );


  const [
    filePreview,
    setFilePreview,
  ] =
    useState<string | null>(
      null,
    );


  const [
    caption,
    setCaption,
  ] =
    useState("");


  const [
    uploadBusy,
    setUploadBusy,
  ] =
    useState(false);


  const [
    uploadError,
    setUploadError,
  ] =
    useState("");


  const [
    activeGroupIndex,
    setActiveGroupIndex,
  ] =
    useState(-1);


  const [
    activeStoryIndex,
    setActiveStoryIndex,
  ] =
    useState(0);


  const [
    progress,
    setProgress,
  ] =
    useState(0);


  const [
    paused,
    setPaused,
  ] =
    useState(false);


  const [
    viewersOpen,
    setViewersOpen,
  ] =
    useState(false);


  const [
    viewerProfiles,
    setViewerProfiles,
  ] =
    useState<Profile[]>(
      [],
    );


  const [
    storyReply,
    setStoryReply,
  ] =
    useState("");


  const [
    replyBusy,
    setReplyBusy,
  ] =
    useState(false);


  const [
    replyError,
    setReplyError,
  ] =
    useState("");


  const loadStories =
    useCallback(
      async () => {

        setLoading(
          true,
        );


        const now =
          new Date()
            .toISOString();


        const {
          data:
            storyRows,
        } =
          await supabase
            .from(
              "social_stories",
            )
            .select(
              "id, user_id, media_url, media_path, media_type, caption, created_at, expires_at",
            )
            .eq(
              "status",
              "active",
            )
            .gt(
              "expires_at",
              now,
            )
            .order(
              "created_at",
              {
                ascending:
                  true,
              },
            )
            .limit(
              100,
            );


        const stories =
          (
            storyRows ??
            []
          ) as Story[];


        if (
          !stories.length
        ) {
          setGroups(
            [],
          );

          setViewedStoryIds(
            new Set(),
          );

          setLikedStoryIds(
            new Set(),
          );

          setLikeCounts(
            new Map(),
          );

          setLoading(
            false,
          );

          return;
        }


        const userIds =
          Array.from(
            new Set(
              stories.map(
                (
                  story,
                ) =>
                  story.user_id,
              ),
            ),
          );


        const storyIds =
          stories.map(
            (
              story,
            ) =>
              story.id,
          );


        const [
          profileResult,
          viewsResult,
          likesResult,
        ] =
          await Promise.all([

            supabase
              .from(
                "social_profiles",
              )
              .select(
                "user_id, username, display_name, avatar_url",
              )
              .in(
                "user_id",
                userIds,
              ),

            currentUserId
              ? supabase
                  .from(
                    "social_story_views",
                  )
                  .select(
                    "story_id",
                  )
                  .eq(
                    "user_id",
                    currentUserId,
                  )
                  .in(
                    "story_id",
                    storyIds,
                  )
              : Promise.resolve({
                  data:
                    [],
                }),

            supabase
              .from(
                "social_story_likes",
              )
              .select(
                "story_id, user_id",
              )
              .in(
                "story_id",
                storyIds,
              ),

          ]);


        const profiles =
          (
            profileResult.data ??
            []
          ) as Profile[];


        const profileMap =
          new Map(
            profiles.map(
              (
                profile,
              ) => [
                profile.user_id,
                profile,
              ],
            ),
          );


        const viewed =
          new Set<string>(
            (
              viewsResult.data ??
              []
            ).map(
              (
                row: any,
              ) =>
                row.story_id,
            ),
          );


        const likes =
          likesResult.data ??
          [];


        const myLiked =
          new Set<string>();


        const counts =
          new Map<string, number>();


        for (
          const like
          of likes
        ) {

          counts.set(
            like.story_id,
            (
              counts.get(
                like.story_id,
              ) ??
              0
            ) +
              1,
          );


          if (
            currentUserId &&
            like.user_id ===
              currentUserId
          ) {
            myLiked.add(
              like.story_id,
            );
          }

        }


        const grouped =
          new Map<
            string,
            StoryGroup
          >();


        for (
          const story
          of stories
        ) {

          const profile =
            profileMap.get(
              story.user_id,
            );


          if (!profile) {
            continue;
          }


          if (
            !grouped.has(
              story.user_id,
            )
          ) {
            grouped.set(
              story.user_id,
              {
                profile,
                stories:
                  [],
              },
            );
          }


          grouped
            .get(
              story.user_id,
            )!
            .stories
            .push(
              story,
            );
        }


        const nextGroups =
          Array.from(
            grouped.values(),
          );


        nextGroups.sort(
          (
            a,
            b,
          ) => {

            if (
              currentUserId
            ) {

              if (
                a.profile
                  .user_id ===
                currentUserId
              ) {
                return -1;
              }


              if (
                b.profile
                  .user_id ===
                currentUserId
              ) {
                return 1;
              }

            }


            const aSeen =
              a.stories.every(
                (
                  story,
                ) =>
                  viewed.has(
                    story.id,
                  ),
              );


            const bSeen =
              b.stories.every(
                (
                  story,
                ) =>
                  viewed.has(
                    story.id,
                  ),
              );


            if (
              aSeen !==
              bSeen
            ) {
              return aSeen
                ? 1
                : -1;
            }


            const aTime =
              new Date(
                a.stories[
                  a.stories.length -
                    1
                ].created_at,
              ).getTime();


            const bTime =
              new Date(
                b.stories[
                  b.stories.length -
                    1
                ].created_at,
              ).getTime();


            return (
              bTime -
              aTime
            );

          },
        );


        setGroups(
          nextGroups,
        );


        setViewedStoryIds(
          viewed,
        );


        setLikedStoryIds(
          myLiked,
        );


        setLikeCounts(
          counts,
        );


        if (
          typeof window !==
          "undefined"
        ) {

          const requestedStory =
            new URLSearchParams(
              window.location.search,
            ).get(
              "story",
            );


          if (requestedStory) {

            const groupIndex =
              nextGroups.findIndex(
                (
                  group,
                ) =>
                  group.stories.some(
                    (
                      story,
                    ) =>
                      story.id ===
                      requestedStory,
                  ),
              );


            if (
              groupIndex >=
              0
            ) {

              const storyIndex =
                nextGroups[
                  groupIndex
                ].stories.findIndex(
                  (
                    story,
                  ) =>
                    story.id ===
                    requestedStory,
                );


              setActiveGroupIndex(
                groupIndex,
              );


              setActiveStoryIndex(
                Math.max(
                  storyIndex,
                  0,
                ),
              );


              setProgress(
                0,
              );


              window.history.replaceState(
                {},
                "",
                "/social-connect",
              );

            }

          }

        }


        setLoading(
          false,
        );

      },
      [
        currentUserId,
        supabase,
      ],
    );


  useEffect(() => {
    void loadStories();
  }, [
    loadStories,
  ]);


  useEffect(() => {

    const channel =
      supabase
        .channel(
          "social-stories-live",
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",
            schema:
              "public",
            table:
              "social_stories",
          },
          () => {
            void loadStories();
          },
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",
            schema:
              "public",
            table:
              "social_story_likes",
          },
          () => {
            void loadStories();
          },
        )
        .subscribe();


    return () => {
      void supabase.removeChannel(
        channel,
      );
    };

  }, [
    loadStories,
    supabase,
  ]);


  useEffect(() => {

    if (
      !selectedFile
    ) {
      setFilePreview(
        null,
      );

      return;
    }


    const url =
      URL.createObjectURL(
        selectedFile,
      );


    setFilePreview(
      url,
    );


    return () => {
      URL.revokeObjectURL(
        url,
      );
    };

  }, [
    selectedFile,
  ]);


  const currentGroup =
    activeGroupIndex >=
      0
      ? groups[
          activeGroupIndex
        ]
      : null;


  const currentStory =
    currentGroup
      ?.stories[
        activeStoryIndex
      ] ??
    null;


  function closeViewer() {
    setActiveGroupIndex(
      -1,
    );

    setActiveStoryIndex(
      0,
    );

    setProgress(
      0,
    );

    setPaused(
      false,
    );

    setViewersOpen(
      false,
    );
  }


  function nextStory() {

    if (!currentGroup) {
      return;
    }


    if (
      activeStoryIndex <
      currentGroup
        .stories
        .length -
        1
    ) {

      setActiveStoryIndex(
        (
          current,
        ) =>
          current +
          1,
      );

      setProgress(
        0,
      );

      return;
    }


    if (
      activeGroupIndex <
      groups.length -
        1
    ) {

      setActiveGroupIndex(
        (
          current,
        ) =>
          current +
          1,
      );

      setActiveStoryIndex(
        0,
      );

      setProgress(
        0,
      );

      return;
    }


    closeViewer();
  }


  function previousStory() {

    if (
      activeStoryIndex >
      0
    ) {

      setActiveStoryIndex(
        (
          current,
        ) =>
          current -
          1,
      );

      setProgress(
        0,
      );

      return;
    }


    if (
      activeGroupIndex >
      0
    ) {

      const previous =
        groups[
          activeGroupIndex -
            1
        ];


      setActiveGroupIndex(
        (
          current,
        ) =>
          current -
          1,
      );


      setActiveStoryIndex(
        previous
          .stories
          .length -
          1,
      );


      setProgress(
        0,
      );

      return;
    }


    setProgress(
      0,
    );
  }


  function openGroup(
    index: number,
  ) {

    const group =
      groups[
        index
      ];


    const unseenIndex =
      group.stories.findIndex(
        (
          story,
        ) =>
          !viewedStoryIds.has(
            story.id,
          ),
      );


    setActiveGroupIndex(
      index,
    );


    setActiveStoryIndex(
      unseenIndex >=
        0
        ? unseenIndex
        : 0,
    );


    setProgress(
      0,
    );
  }


  useEffect(() => {

    if (
      !currentStory ||
      currentStory.media_type ===
        "video" ||
      paused
    ) {
      return;
    }


    const timer =
      window.setInterval(
        () => {

          setProgress(
            (
              current,
            ) => {

              const next =
                current +
                0.02;


              if (
                next >=
                1
              ) {

                window.setTimeout(
                  () =>
                    nextStory(),
                  0,
                );


                return 1;
              }


              return next;

            },
          );

        },
        100,
      );


    return () =>
      window.clearInterval(
        timer,
      );

  }, [
    currentStory?.id,
    paused,
  ]);


  useEffect(() => {

    if (
      !currentStory ||
      !currentUserId
    ) {
      return;
    }


    void supabase
      .from(
        "social_story_views",
      )
      .upsert(
        {
          story_id:
            currentStory.id,

          user_id:
            currentUserId,

          viewed_at:
            new Date()
              .toISOString(),
        },
        {
          onConflict:
            "story_id,user_id",
        },
      );


    setViewedStoryIds(
      (
        previous,
      ) => {

        const next =
          new Set(
            previous,
          );


        next.add(
          currentStory.id,
        );


        return next;

      },
    );

  }, [
    currentStory?.id,
    currentUserId,
    supabase,
  ]);


  function selectStoryFile(
    file:
      File |
      undefined,
  ) {

    if (!file) {
      return;
    }


    setUploadError(
      "",
    );


    if (
      !STORY_TYPES.includes(
        file.type,
      )
    ) {

      setUploadError(
        "Story must be JPG, PNG, WEBP, MP4 or WEBM.",
      );

      return;
    }


    if (
      file.size >
      MAX_STORY_SIZE
    ) {

      setUploadError(
        "Story media must be smaller than 25 MB.",
      );

      return;
    }


    setSelectedFile(
      file,
    );
  }


  async function uploadStory() {

    if (
      !currentUserId ||
      !canPost ||
      !selectedFile
    ) {
      return;
    }


    setUploadBusy(
      true,
    );


    setUploadError(
      "",
    );


    const isVideo =
      selectedFile.type
        .startsWith(
          "video/",
        );


    const extension =
      selectedFile.name
        .split(".")
        .pop()
        ?.toLowerCase() ??
      (
        isVideo
          ? "mp4"
          : "jpg"
      );


    const folder =
      crypto.randomUUID();


    const path =
      `${currentUserId}/${folder}/${crypto.randomUUID()}.${extension}`;


    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "social-stories",
        )
        .upload(
          path,
          selectedFile,
          {
            cacheControl:
              "86400",
          },
        );


    if (
      uploadError
    ) {

      setUploadError(
        uploadError.message,
      );

      setUploadBusy(
        false,
      );

      return;
    }


    const {
      data:
        publicData,
    } =
      supabase.storage
        .from(
          "social-stories",
        )
        .getPublicUrl(
          path,
        );


    const {
      error:
        insertError,
    } =
      await supabase
        .from(
          "social_stories",
        )
        .insert({
          user_id:
            currentUserId,

          media_url:
            publicData.publicUrl,

          media_path:
            path,

          media_type:
            isVideo
              ? "video"
              : "image",

          caption:
            caption.trim() ||
            null,
        });


    if (
      insertError
    ) {

      await supabase.storage
        .from(
          "social-stories",
        )
        .remove([
          path,
        ]);


      setUploadError(
        insertError.message,
      );

      setUploadBusy(
        false,
      );

      return;
    }


    setSelectedFile(
      null,
    );

    setCaption(
      "",
    );

    setComposerOpen(
      false,
    );

    setUploadBusy(
      false,
    );


    await loadStories();
  }


  async function toggleLike() {

    if (
      !currentStory ||
      !currentUserId
    ) {
      return;
    }


    const liked =
      likedStoryIds.has(
        currentStory.id,
      );


    setLikedStoryIds(
      (
        previous,
      ) => {

        const next =
          new Set(
            previous,
          );


        if (liked) {
          next.delete(
            currentStory.id,
          );
        } else {
          next.add(
            currentStory.id,
          );
        }


        return next;

      },
    );


    setLikeCounts(
      (
        previous,
      ) => {

        const next =
          new Map(
            previous,
          );


        next.set(
          currentStory.id,
          Math.max(
            0,
            (
              next.get(
                currentStory.id,
              ) ??
              0
            ) +
              (
                liked
                  ? -1
                  : 1
              ),
          ),
        );


        return next;

      },
    );


    if (liked) {

      await supabase
        .from(
          "social_story_likes",
        )
        .delete()
        .eq(
          "story_id",
          currentStory.id,
        )
        .eq(
          "user_id",
          currentUserId,
        );

    } else {

      await supabase
        .from(
          "social_story_likes",
        )
        .insert({
          story_id:
            currentStory.id,

          user_id:
            currentUserId,
        });

    }
  }


  async function deleteCurrentStory() {

    if (
      !currentStory ||
      currentStory.user_id !==
        currentUserId
    ) {
      return;
    }


    if (
      !window.confirm(
        "Delete this Story now?",
      )
    ) {
      return;
    }


    await supabase.storage
      .from(
        "social-stories",
      )
      .remove([
        currentStory.media_path,
      ]);


    await supabase
      .from(
        "social_stories",
      )
      .delete()
      .eq(
        "id",
        currentStory.id,
      )
      .eq(
        "user_id",
        currentUserId,
      );


    closeViewer();


    await loadStories();
  }


  async function openViewers() {

    if (
      !currentStory ||
      currentStory.user_id !==
        currentUserId
    ) {
      return;
    }


    const {
      data:
        views,
    } =
      await supabase
        .from(
          "social_story_views",
        )
        .select(
          "user_id",
        )
        .eq(
          "story_id",
          currentStory.id,
        );


    const ids =
      Array.from(
        new Set(
          (
            views ??
            []
          ).map(
            (
              view: any,
            ) =>
              view.user_id,
          ),
        ),
      );


    if (
      !ids.length
    ) {

      setViewerProfiles(
        [],
      );

      setViewersOpen(
        true,
      );

      return;
    }


    const {
      data:
        profiles,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "user_id, username, display_name, avatar_url",
        )
        .in(
          "user_id",
          ids,
        );


    setViewerProfiles(
      (
        profiles ??
        []
      ) as Profile[],
    );


    setViewersOpen(
      true,
    );
  }


  async function sendStoryReply() {

    if (
      !currentStory ||
      !currentUserId ||
      currentStory.user_id ===
        currentUserId ||
      replyBusy
    ) {
      return;
    }


    const text =
      storyReply.trim();


    if (!text) {
      return;
    }


    setReplyBusy(
      true,
    );


    setReplyError(
      "",
    );


    const {
      data:
        conversationId,
      error:
        replyRpcError,
    } =
      await supabase.rpc(
        "social_reply_to_story",
        {
          p_story_id:
            currentStory.id,

          p_body:
            text,
        },
      );


    if (
      replyRpcError
    ) {

      setReplyError(
        replyRpcError.message,
      );


      setReplyBusy(
        false,
      );


      return;
    }


    setStoryReply(
      "",
    );


    setReplyBusy(
      false,
    );


    if (
      conversationId
    ) {

      window.location.assign(
        `/social-connect/chats/${conversationId}`,
      );

    }

  }


  function timeLabel(
    createdAt: string,
  ) {

    const hours =
      Math.max(
        0,
        Math.floor(
          (
            Date.now() -
            new Date(
              createdAt,
            ).getTime()
          ) /
            3600000,
        ),
      );


    if (
      hours < 1
    ) {
      return "now";
    }


    return `${hours}h`;
  }


  const ownGroupIndex =
    currentUserId
      ? groups.findIndex(
          (
            group,
          ) =>
            group.profile
              .user_id ===
            currentUserId,
        )
      : -1;


  return (
    <>

      <section className="mx-auto mt-5 max-w-2xl px-4">

        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex gap-4 overflow-x-auto px-4 pb-1">

            {currentUserId &&
              canPost && (
              <div className="w-[76px] shrink-0 text-center">

                <div className="relative mx-auto w-fit">

                  <button
                    type="button"
                    onClick={() => {

                      if (
                        ownGroupIndex >=
                        0
                      ) {
                        openGroup(
                          ownGroupIndex,
                        );
                      } else {
                        setComposerOpen(
                          true,
                        );
                      }

                    }}
                    className="rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                  >

                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-lg font-black text-slate-500 dark:border-slate-900 dark:bg-slate-800">

                      {ownGroupIndex >=
                        0 &&
                      groups[
                        ownGroupIndex
                      ].profile
                        .avatar_url ? (
                        <img
                          src={
                            groups[
                              ownGroupIndex
                            ].profile
                              .avatar_url!
                          }
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        "You"
                      )}

                    </div>

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setComposerOpen(
                        true,
                      )
                    }
                    className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white dark:border-slate-900"
                    title="Add Story"
                  >
                    <Plus
                      size={14}
                    />
                  </button>

                </div>


                <p className="mt-2 truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                  Your story
                </p>

              </div>
            )}


            {loading ? (
              <div className="flex h-20 items-center px-5">
                <Loader2
                  className="animate-spin text-blue-600"
                  size={20}
                />
              </div>
            ) : (
              groups.map(
                (
                  group,
                  index,
                ) => {

                  if (
                    currentUserId &&
                    group.profile
                      .user_id ===
                      currentUserId &&
                    canPost
                  ) {
                    return null;
                  }


                  const seen =
                    group.stories.every(
                      (
                        story,
                      ) =>
                        viewedStoryIds.has(
                          story.id,
                        ),
                    );


                  return (
                    <button
                      key={
                        group.profile
                          .user_id
                      }
                      type="button"
                      onClick={() =>
                        openGroup(
                          index,
                        )
                      }
                      className="w-[76px] shrink-0 text-center"
                    >

                      <div
                        className={`mx-auto rounded-full p-[3px] ${
                          seen
                            ? "bg-slate-300 dark:bg-slate-700"
                            : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                        }`}
                      >

                        <div className="h-16 w-16 rounded-full border-[3px] border-white bg-slate-100 dark:border-slate-900 dark:bg-slate-800">

                          {group.profile
                            .avatar_url ? (
                            <img
                              src={
                                group.profile
                                  .avatar_url
                              }
                              alt=""
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-black text-slate-500">
                              {
                                group.profile
                                  .display_name
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()
                              }
                            </div>
                          )}

                        </div>

                      </div>


                      <p className="mt-2 truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                        {
                          group.profile
                            .username
                        }
                      </p>

                    </button>
                  );

                },
              )
            )}

          </div>

        </div>

      </section>


      {composerOpen &&
        currentUserId &&
        canPost && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">

          <div className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600">
                  Social Connect
                </p>


                <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                  Add Story
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setComposerOpen(
                    false,
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
              >
                <X
                  size={19}
                />
              </button>

            </div>


            {uploadError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                {
                  uploadError
                }
              </div>
            )}


            <label className="mt-5 block cursor-pointer overflow-hidden rounded-[22px] border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">

              {filePreview &&
              selectedFile ? (

                selectedFile.type
                  .startsWith(
                    "video/",
                  ) ? (
                  <video
                    src={
                      filePreview
                    }
                    controls
                    playsInline
                    className="max-h-[520px] w-full object-contain"
                  />
                ) : (
                  <img
                    src={
                      filePreview
                    }
                    alt="Story preview"
                    className="max-h-[520px] w-full object-contain"
                  />
                )

              ) : (

                <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">

                  <Plus
                    size={35}
                    className="text-pink-600"
                  />


                  <p className="mt-4 font-black text-slate-950 dark:text-white">
                    Choose Story Media
                  </p>


                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    JPG, PNG, WEBP, MP4 or WEBM · maximum 25 MB
                  </p>

                </div>

              )}


              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                className="hidden"
                onChange={(
                  event,
                ) =>
                  selectStoryFile(
                    event.target.files?.[0],
                  )
                }
              />

            </label>


            <div className="mt-5">

              <MentionTextarea
                value={
                  caption
                }
                onChange={
                  setCaption
                }
                rows={3}
                maxLength={
                  500
                }
                placeholder="Add a caption… use @username to mention someone"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-950 outline-none focus:border-pink-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

            </div>


            <div className="mt-2 text-right text-xs font-semibold text-slate-400">
              {
                caption.length
              }
              /500
            </div>


            <button
              type="button"
              disabled={
                !selectedFile ||
                uploadBusy
              }
              onClick={
                uploadStory
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3.5 font-black text-white disabled:opacity-50"
            >

              {uploadBusy && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              Share Story

            </button>

          </div>

        </div>
      )}


      {currentStory &&
        currentGroup && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black"
          onPointerDown={() =>
            setPaused(
              true,
            )
          }
          onPointerUp={() =>
            setPaused(
              false,
            )
          }
          onPointerCancel={() =>
            setPaused(
              false,
            )
          }
        >

          <div className="relative h-full w-full max-w-[540px] overflow-hidden bg-black sm:h-[94vh] sm:rounded-[24px]">

            <div className="absolute left-0 right-0 top-0 z-30 p-3">

              <div className="flex gap-1">

                {currentGroup.stories.map(
                  (
                    story,
                    index,
                  ) => {

                    const width =
                      index <
                      activeStoryIndex
                        ? 100
                        : index >
                            activeStoryIndex
                          ? 0
                          : progress *
                            100;


                    return (
                      <div
                        key={
                          story.id
                        }
                        className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
                      >

                        <div
                          className="h-full bg-white"
                          style={{
                            width:
                              `${width}%`,
                          }}
                        />

                      </div>
                    );

                  },
                )}

              </div>


              <div className="mt-3 flex items-center gap-3">

                <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-700">

                  {currentGroup.profile
                    .avatar_url ? (
                    <img
                      src={
                        currentGroup.profile
                          .avatar_url
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-black text-white">
                      {
                        currentGroup.profile
                          .display_name
                          .charAt(
                            0,
                          )
                          .toUpperCase()
                      }
                    </div>
                  )}

                </div>


                <div className="min-w-0 flex-1 text-white">

                  <p className="truncate text-sm font-black">
                    @
                    {
                      currentGroup.profile
                        .username
                    }
                  </p>


                  <p className="text-[11px] text-white/65">
                    {
                      timeLabel(
                        currentStory.created_at,
                      )
                    }
                  </p>

                </div>


                {currentStory
                  .user_id ===
                  currentUserId && (
                  <button
                    type="button"
                    onPointerDown={(
                      event,
                    ) =>
                      event.stopPropagation()
                    }
                    onClick={
                      deleteCurrentStory
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white"
                    title="Delete Story"
                  >
                    <Trash2
                      size={17}
                    />
                  </button>
                )}


                <button
                  type="button"
                  onPointerDown={(
                    event,
                  ) =>
                    event.stopPropagation()
                  }
                  onClick={
                    closeViewer
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white"
                >
                  <X
                    size={20}
                  />
                </button>

              </div>

            </div>


            {currentStory
              .media_type ===
              "video" ? (

              <video
                key={
                  currentStory.id
                }
                src={
                  currentStory.media_url
                }
                autoPlay
                muted={
                  false
                }
                playsInline
                onTimeUpdate={(
                  event,
                ) => {

                  const video =
                    event.currentTarget;


                  if (
                    video.duration >
                    0
                  ) {
                    setProgress(
                      video.currentTime /
                        video.duration,
                    );
                  }

                }}
                onEnded={
                  nextStory
                }
                ref={(
                  video,
                ) => {

                  if (!video) {
                    return;
                  }


                  if (paused) {
                    video.pause();
                  } else {
                    void video.play()
                      .catch(
                        () => {},
                      );
                  }

                }}
                className="h-full w-full object-contain"
              />

            ) : (

              <img
                src={
                  currentStory.media_url
                }
                alt="Story"
                className="h-full w-full object-contain"
              />

            )}


            <button
              type="button"
              aria-label="Previous Story"
              onClick={
                previousStory
              }
              className="absolute bottom-24 left-0 top-24 z-20 w-[28%]"
            >
              <ChevronLeft
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 text-white/70 sm:block"
              />
            </button>


            <button
              type="button"
              aria-label="Next Story"
              onClick={
                nextStory
              }
              className="absolute bottom-24 right-0 top-24 z-20 w-[28%]"
            >
              <ChevronRight
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-white/70 sm:block"
              />
            </button>


            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-20">

              {currentStory.caption && (
                <MentionText
                  text={
                    currentStory.caption
                  }
                  className="mb-4 block whitespace-pre-wrap break-words text-sm leading-6 text-white"
                />
              )}


              {currentUserId &&
                currentStory.user_id !==
                  currentUserId && (
                <form
                  onSubmit={(
                    event,
                  ) => {
                    event.preventDefault();

                    void sendStoryReply();
                  }}
                  onPointerDown={(
                    event,
                  ) =>
                    event.stopPropagation()
                  }
                  className="mb-3"
                >

                  <div className="flex items-end gap-2">

                    <div className="min-w-0 flex-1">

                      <MentionTextarea
                        value={
                          storyReply
                        }
                        onChange={
                          setStoryReply
                        }
                        rows={1}
                        maxLength={
                          2000
                        }
                        placeholder="Reply to Story..."
                        onKeyDown={(
                          event,
                        ) => {

                          if (
                            event.key ===
                              "Enter" &&
                            !event.shiftKey
                          ) {

                            event.preventDefault();

                            void sendStoryReply();

                          }

                        }}
                        className="max-h-28 min-h-11 w-full resize-none rounded-full border border-white/25 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/70 backdrop-blur-md focus:border-white/50"
                      />

                    </div>


                    <button
                      type="submit"
                      disabled={
                        replyBusy ||
                        !storyReply.trim()
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition hover:scale-105 disabled:opacity-40"
                      title="Send Story reply"
                    >
                      <Send
                        size={18}
                      />
                    </button>

                  </div>


                  {replyError && (
                    <p className="mt-2 text-xs font-semibold text-red-300">
                      {
                        replyError
                      }
                    </p>
                  )}

                </form>
              )}


              <div className="flex items-center gap-3">

                {currentStory
                  .user_id ===
                  currentUserId ? (

                  <button
                    type="button"
                    onPointerDown={(
                      event,
                    ) =>
                      event.stopPropagation()
                    }
                    onClick={
                      openViewers
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-black text-white backdrop-blur"
                  >
                    <Eye
                      size={17}
                    />

                    Viewers
                  </button>

                ) : (

                  <div className="flex-1" />

                )}


                <button
                  type="button"
                  disabled={
                    !currentUserId
                  }
                  onPointerDown={(
                    event,
                  ) =>
                    event.stopPropagation()
                  }
                  onClick={
                    toggleLike
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-white backdrop-blur disabled:opacity-50"
                >

                  <Heart
                    size={22}
                    className={
                      likedStoryIds.has(
                        currentStory.id,
                      )
                        ? "fill-pink-500 text-pink-500"
                        : ""
                    }
                  />


                  <span className="text-sm font-black">
                    {
                      likeCounts.get(
                        currentStory.id,
                      ) ??
                      0
                    }
                  </span>

                </button>

              </div>

            </div>

          </div>


          {viewersOpen && (
            <div
              className="absolute inset-0 z-[100] flex items-end justify-center bg-black/55 sm:items-center"
              onPointerDown={(
                event,
              ) =>
                event.stopPropagation()
              }
            >

              <div className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white p-5 dark:bg-slate-900 sm:rounded-[28px]">

                <div className="flex items-center justify-between">

                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    Story Viewers
                  </h3>


                  <button
                    type="button"
                    onClick={() =>
                      setViewersOpen(
                        false,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                  >
                    <X
                      size={18}
                    />
                  </button>

                </div>


                <div className="mt-4 space-y-2">

                  {!viewerProfiles.length && (
                    <p className="py-8 text-center text-sm text-slate-500">
                      No viewers yet.
                    </p>
                  )}


                  {viewerProfiles.map(
                    (
                      profile,
                    ) => (
                      <a
                        key={
                          profile.user_id
                        }
                        href={`/social-connect/u/${profile.username}`}
                        className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >

                        {profile.avatar_url ? (
                          <img
                            src={
                              profile.avatar_url
                            }
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-black text-slate-600 dark:bg-slate-700 dark:text-white">
                            {
                              profile.display_name
                                .charAt(
                                  0,
                                )
                                .toUpperCase()
                            }
                          </div>
                        )}


                        <div>

                          <p className="text-sm font-black text-slate-950 dark:text-white">
                            {
                              profile.display_name
                            }
                          </p>


                          <p className="text-xs text-slate-500">
                            @
                            {
                              profile.username
                            }
                          </p>

                        </div>

                      </a>
                    ),
                  )}

                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </>
  );
}
