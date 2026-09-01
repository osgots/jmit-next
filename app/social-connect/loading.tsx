export default function SocialLoading() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 dark:bg-slate-950">

      <div className="mx-auto max-w-3xl">

        <div className="h-5 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />

        <div className="mt-3 h-10 w-52 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />


        <div className="mt-8 space-y-5">

          {[0, 1, 2].map(
            (
              item,
            ) => (
              <div
                key={
                  item
                }
                className="overflow-hidden rounded-[26px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              >

                <div className="flex items-center gap-3 p-4">

                  <div className="h-11 w-11 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />


                  <div className="flex-1">

                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                    <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>


                <div className="aspect-video animate-pulse bg-slate-100 dark:bg-slate-800" />


                <div className="space-y-2 p-4">

                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
