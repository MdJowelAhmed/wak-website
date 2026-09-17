export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#54331C] text-white">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-white/70">This page could not be found.</p>
          <a
            href="/"
            className="mt-8 rounded-xl border-2 border-[#E87524] px-6 py-3 text-[#E87524] transition-colors hover:bg-[#E87524] hover:text-white"
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
