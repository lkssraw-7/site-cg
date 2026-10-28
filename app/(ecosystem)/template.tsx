import { Reveal } from "@/components/motion/motion-system";

// Uma nova entrada por rota, sem bloquear navegação ou depender de transições
// de saída incompatíveis com a persistência de layouts do App Router.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="ecosystem-route"><Reveal mode="load" className="route-content">{children}</Reveal></div>;
}
