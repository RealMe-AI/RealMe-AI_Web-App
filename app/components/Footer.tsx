import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              <Image src="/logo.png" alt="RealMe logo" width={48} height={48} />
            </div>
            <div className="text-white font-semibold">RealMe AI</div>
          </div>
          <p className="mt-4 text-slate-400 max-w-sm">
            Converse. Learn. Evolve. Professionally with AI-powered multilingual
            conversations.
          </p>
        </div>
      </div>

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
