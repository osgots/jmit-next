import fs from "node:fs";

const file =
  "app/social-connect/notifications/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


if (
  !code.includes(
    `import NotificationLink from "@/components/social/notification-link";`,
  )
) {
  code =
    code.replace(
      `import SocialBadge from "@/components/social/social-badge";`,
      `import SocialBadge from "@/components/social/social-badge";
import NotificationLink from "@/components/social/notification-link";`,
    );
}


code =
  code.replace(
`                <form
                  key={
                    item.id
                  }
                  action={
                    markNotificationRead
                  }
                >
                  <input
                    type="hidden"
                    name="id"
                    value={
                      item.id
                    }
                  />

                  <Link
                    href={
                      destination(
                        item,
                        actor,
                      )
                    }`,
`                <NotificationLink
                  key={
                    item.id
                  }
                  notificationId={
                    item.id
                  }
                  destination={
                    destination(
                      item,
                      actor,
                    )
                  }`,
  );


code =
  code.replace(
`                  </Link>
                </form>`,
`                  </NotificationLink>`,
  );


code =
  code.replace(
    `  markNotificationRead,\n`,
    "",
  );


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "✓ Notification click now marks notification read.",
);
