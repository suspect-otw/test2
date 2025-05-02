import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center bg-background border-t mx-auto text-center text-xs gap-2 py-10">
      <p>
        Powered by{" "}
        <Link href="https://github.com/suspect-otw">
          suspect-otw
        </Link>
      </p>
    </footer>
  );
}