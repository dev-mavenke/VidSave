const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. VidSave does not require sign-up or social account access."
  },
  {
    q: "Can I download private or restricted videos?",
    a: "No. VidSave is only for public media links you have permission to save."
  },
  {
    q: "Which platforms are supported?",
    a: "TikTok, Instagram, Twitter/X, and YouTube public video links are supported."
  }
];

export default function FAQ() {
  return (
    <section className="mx-auto mt-20 max-w-5xl px-5">
      <h2 className="text-3xl font-black">FAQ</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
          >
            <h3 className="font-bold">{item.q}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
