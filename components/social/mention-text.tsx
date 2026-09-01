import Link from "next/link";


export default function MentionText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const pieces =
    text.split(
      /(@[a-z0-9._]{3,30})/gi,
    );


  return (
    <span
      className={
        className
      }
    >
      {pieces.map(
        (
          piece,
          index,
        ) => {
          if (
            /^@[a-z0-9._]{3,30}$/i.test(
              piece,
            )
          ) {
            const username =
              piece
                .slice(1)
                .toLowerCase();


            return (
              <Link
                key={`${piece}-${index}`}
                href={`/social-connect/u/${username}`}
                className="font-black text-blue-600 hover:underline dark:text-blue-400"
              >
                @{username}
              </Link>
            );
          }


          return (
            <span
              key={
                index
              }
            >
              {piece}
            </span>
          );
        },
      )}
    </span>
  );
}
