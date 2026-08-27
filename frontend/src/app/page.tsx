import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF6F0] text-[#3A342E]">
      {/* Header / Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#3A342E]">
          The Memoir Project
        </h1>
        <Link
          href="/login"
          className="text-xs font-semibold text-[#C2683D] hover:underline"
        >
          Log in
        </Link>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Column: Text & Buttons */}
        <div className="flex-1 max-w-lg space-y-6">
          <h2 className="font-serif text-4xl sm:text-5xl font-medium leading-tight text-[#3A342E]">
            Save the memories <br />
            before they fade.
          </h2>
          <p className="text-base text-[#3A342E]/70 leading-relaxed max-w-md">
            Every family has stories worth preserving. Create one shared memoir where your family can collect voices, photographs, and memories of someone you love.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-full bg-[#C2683D] text-white text-sm font-medium hover:bg-[#a8562f] transition-colors"
            >
              Start here
            </Link>
            <Link
              href="/onboarding"
              className="px-6 py-3 rounded-full border border-[#3A342E]/30 text-[#3A342E] text-sm font-medium hover:border-[#3A342E] transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Image with Soft Rounded Frame */}
        <div className="flex-1 flex justify-center w-full max-w-md">
          <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden shadow-sm border-[8px] border-white bg-stone-200">
            <Image
              src="/memoir-hero.png"
              alt="Family looking at photo album together"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </main>

      {/* As Seen In Section */}
      <section className="border-t border-[#3A342E]/10 py-8 bg-white/40">
        <div className="max-w-7xl mx-auto px-8 text-center space-y-4">
          <p className="text-[11px] font-bold tracking-widest text-[#3A342E]/40 uppercase">
            AS SEEN IN
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 font-serif text-xl sm:text-2xl text-[#3A342E]/60">
            <span className="font-semibold">The Times</span>
            <span className="font-semibold">Chronicle</span>
            <span className="font-semibold">Legacy</span>
            <span className="font-semibold">Heritage</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3A342E]/10 py-10 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#3A342E]">
              The Memoir Project
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs text-[#3A342E]/70">
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:underline">Privacy Policy</Link>
              <Link href="#" className="hover:underline">Terms of Service</Link>
            </div>
            <Link href="#" className="hover:underline">Help Center</Link>
          </div>

          <p className="text-xs text-[#3A342E]/50">
            © 2024 The Memoir Project. Preserve your legacy.
          </p>
        </div>
      </footer>
    </div>
  );
}
