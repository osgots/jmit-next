import type {
  ReactNode,
} from "react";

import SocialShellNav from "@/components/social/social-shell-nav";


export default function SocialConnectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}

      <SocialShellNav />
    </>
  );
}
