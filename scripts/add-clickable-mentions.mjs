import fs from "node:fs";

const file =
  "app/social-connect/post/[id]/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


if (
  !code.includes(
    `import MentionText from "@/components/social/mention-text";`,
  )
) {
  code =
    code.replace(
      `import CommentControls from "@/components/social/comment-controls";`,
      `import CommentControls from "@/components/social/comment-controls";
import MentionText from "@/components/social/mention-text";`,
    );
}


code =
  code.replace(
`                  <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                    {
                      post.caption
                    }
                  </p>`,
`                  <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                    <MentionText
                      text={
                        post.caption
                      }
                    />
                  </p>`,
  );


code =
  code.replace(
`                            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                              {
                                comment.body
                              }
                            </p>`,
`                            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                              <MentionText
                                text={
                                  comment.body
                                }
                              />
                            </p>`,
  );


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "✓ Post captions and comments now render clickable @mentions.",
);
