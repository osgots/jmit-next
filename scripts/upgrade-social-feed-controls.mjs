import fs from "node:fs";

const file =
  "app/social-connect/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


if (
  !code.includes(
    `import PostControls from "@/components/social/post-controls";`,
  )
) {
  code =
    code.replace(
      `import SocialBadge from "@/components/social/social-badge";`,
      `import SocialBadge from "@/components/social/social-badge";
import PostControls from "@/components/social/post-controls";
import SocialNav from "@/components/social/social-nav";`,
    );
}


const target =
`  const canPost =
    myProfile &&
    (`;


const insert =
`  const {
    data: savedRows,
  } =
    user && postIds.length
      ? await supabase
          .from("social_saved_posts")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", postIds)
      : { data: [] };

  const savedSet =
    new Set(
      (
        savedRows ??
        []
      ).map(
        (row) =>
          row.post_id,
      ),
    );

  const {
    count: unreadNotifications,
  } =
    user
      ? await supabase
          .from("social_notifications")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id)
          .eq("is_read", false)
      : { count: 0 };

`;


if (
  !code.includes(
    "data: savedRows",
  )
) {
  code =
    code.replace(
      target,
      insert +
        target,
    );
}


const articleHeader =
`                    <div className="flex items-center gap-3 p-4">`;


const controlsTarget =
`                      </Link>
                    </div>
                    {post.media_type ===`;


const controlsReplacement =
`                      </Link>

                      {user && myProfile && (
                        <PostControls
                          postId={post.id}
                          isOwner={user.id === post.user_id}
                          isSaved={savedSet.has(post.id)}
                          returnTo="/social-connect"
                        />
                      )}
                    </div>
                    {post.media_type ===`;


if (
  code.includes(
    controlsTarget,
  )
) {
  code =
    code.replaceAll(
      controlsTarget,
      controlsReplacement,
    );
}


const closeMain =
`      </section>
    </main>`;


const navReplacement =
`      </section>

      <SocialNav
        username={myProfile?.username ?? null}
        canPost={Boolean(canPost)}
        unread={unreadNotifications ?? 0}
      />

      <div className="h-20 md:h-0" />
    </main>`;


if (
  code.includes(
    closeMain,
  )
) {
  code =
    code.replace(
      closeMain,
      navReplacement,
    );
}


fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Saved controls and Social navigation added to feed.",
);
