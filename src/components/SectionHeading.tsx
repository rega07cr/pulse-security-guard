import { Reveal } from './Reveal'
export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <Reveal className="mx-auto max-w-2xl text-center">{eyebrow && <p>{eyebrow}</p>}<h2>{title}</h2>{description && <p>{description}</p>}</Reveal>
