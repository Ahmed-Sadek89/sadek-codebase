export function TrustedBy({ names }: { names: string[] }) {
  if (!names.length) return null;
  return (
    <div className="mt-20 text-[8px] tracking-[0.12em] text-muted-foreground max-[700px]:mt-[60px]">
      TRUSTED BY FORWARD-THINKING TEAMS AND STUDIOS
      <div className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 text-xs tracking-normal text-muted-foreground max-[700px]:justify-start">
        {names.map((name) => (
          <b key={name}>{name}</b>
        ))}
      </div>
    </div>
  );
}
