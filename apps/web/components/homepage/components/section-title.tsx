export const SectionTitle = ({
  eyebrow,
  title,
  copy,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
}) => (
  <div className="mb-8 text-center">
    {eyebrow && (
      <span className="text-[10px] tracking-[0.12em] text-primary font-extrabold">
        {eyebrow}
      </span>
    )}
    <h2 className="my-[7px] text-2xl leading-[1.1] text-foreground">{title}</h2>
    {copy && <p className="m-0 text-[11px] text-muted-foreground">{copy}</p>}
  </div>
);
