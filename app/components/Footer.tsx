import Image from "next/image";

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
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
            <a>Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
