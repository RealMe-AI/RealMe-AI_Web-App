import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="border-t border-slate-800 text-slate-500 text-sm py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between">
          <div>
            © {new Date().getFullYear()} RealMe AI. All rights reserved.
            @OwenVisuels
          </div>
          <div className="flex gap-4">
            <Link href={"/"}>Privacy Policy</Link>
            <Link href={"/"}>Terms of Service</Link>
            <Link href={"/"}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
