type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="section-shell py-16 md:py-20">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="display mt-3 text-5xl leading-none md:text-7xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-muted md:text-lg">{description}</p>
    </section>
  );
}
