"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Critical Error</h2>
          <p className="text-gray-600 mb-6">A critical application error occurred and the page could not be loaded.</p>
          <button 
             className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
             onClick={() => reset()}
          >
             Try again
          </button>
        </div>
      </body>
    </html>
  );
}
