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
          <div className="flex gap-3 mt-6">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              T
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              F
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              L
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              I
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="text-slate-400 space-y-2">
            <li>Home</li>
            <li>Dashboard</li>
            <li>Pricing</li>
            <li>Settings</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Get Started</h4>
          <ul className="text-slate-400 space-y-2">
            <li>Sign Up</li>
            <li>Sign In</li>
            <li>Try Free Now</li>
          </ul>
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
