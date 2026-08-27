import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-6xl mb-4">404 Not Found</h1>
            <p className="text-gray-400 mb-8">Your visited page not found. You may go home page.</p>
            <Link
                href="/"
                className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors"
            >
                Back to Home Page
            </Link>
        </div>
    );
}