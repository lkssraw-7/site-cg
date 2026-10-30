// Individual sections own their motion; never animate the entire document,
// which would also move fixed skip links and duplicate every entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="ecosystem-route">{children}</div>;
}
