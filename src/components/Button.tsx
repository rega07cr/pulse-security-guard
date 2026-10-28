import type { ReactNode } from 'react'
export function Button({ children, href }: { children: ReactNode; href?: string }) {
  if (href) return <a href={href}>{children}</a>
  return <button>{children}</button>
}
