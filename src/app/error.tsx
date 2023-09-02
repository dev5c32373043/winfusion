'use client';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-yellow-300">
      <h2 className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Dear user,</span>
        <br />
        <span>First of all, we apologize for any inconvenience.</span>
        <br />
        <span>Second, we will fix this issue as soon as possible.</span>
        <br />
        <span>Third, we wish you a good day.</span>
      </h2>

      <button className="btn btn-success text-white" onClick={() => reset()}>
        Refresh & try your luck{' '}
        <span role="img" aria-label="wish you luck">
          🍀
        </span>
      </button>
    </main>
  );
}
