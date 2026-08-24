interface LivePreviewProps {
  variant: "live";
  title: string;
  relationship: string;
}

interface CoverPreviewProps {
  variant: "cover";
  title: string;
  establishedYear: string | null;
}

type MemoirPreviewCardProps = LivePreviewProps | CoverPreviewProps;

export function MemoirPreviewCard(props: MemoirPreviewCardProps) {
  if (props.variant === "live") {
    const { title, relationship } = props;
    return (
      <div className="relative flex min-h-[240px] w-full flex-col justify-center rounded-2xl border border-charcoal/10 bg-white p-8 shadow-sm">
        <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-[11px] font-medium tracking-wide text-charcoal/70">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
          LIVE PREVIEW
        </span>
        <p className="font-serif text-2xl leading-snug text-charcoal">
          {title || "The Story of Grandma Ayesha"}
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-charcoal/50">
          {relationship || "My grandmother"}
        </p>
      </div>
    );
  }

  const { title, establishedYear } = props;
  return (
    <div className="relative mx-auto flex aspect-[3/4] w-full max-w-xs flex-col items-center justify-between overflow-hidden rounded-2xl bg-charcoal px-6 py-10 text-center text-cream shadow-lg">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5ZM20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z"
          stroke="#D4AF6A"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col items-center gap-4">
        <p className="font-serif text-2xl leading-snug">
          {title || "The Harrison Legacy"}
        </p>
        <span className="h-px w-16 bg-[#D4AF6A]" />
        {establishedYear && (
          <p className="text-xs uppercase tracking-[0.2em] text-cream/70">
            Est. {establishedYear}
          </p>
        )}
      </div>
      <div className="h-16 w-24 rounded-md bg-cream/10" />
    </div>
  );
}
