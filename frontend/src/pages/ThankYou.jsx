function ThankYou() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="bg-white border border-stone-100 shadow-sm p-12 max-w-lg w-full text-center">

        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200
          flex items-center justify-center mx-auto mb-6 text-amber-600 text-xl">
          ✓
        </div>

        <h2 className="text-3xl font-light text-stone-800 mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          You're All Set!
        </h2>

        <p className="text-stone-400 text-sm font-light leading-relaxed mb-8">
          Your onboarding is complete. Your coach will be in touch shortly.
          Check your email for next steps and session details.
        </p>

        <div className="bg-stone-50 border border-stone-100 rounded px-6 py-4 text-xs
          text-stone-400 tracking-widest uppercase">
          We'll see you at your first session 🎯
        </div>

      </div>
    </div>
  )
}

export default ThankYou