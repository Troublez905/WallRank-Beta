type PlaceholderItem = {
  title: string;
  body: string;
};

type PlaceholderGridProps = {
  items: PlaceholderItem[];
};

export function PlaceholderGrid({ items }: PlaceholderGridProps) {
  return (
    <div className="section-shell grid gap-4 pb-16 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="panel rounded-[28px] p-6">
          <h2 className="display text-3xl">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
