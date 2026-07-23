/** Decorative animated aurora blobs. Drop as the first child of a
 *  `relative` section — it sits behind the section content. */
export default function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
    </div>
  );
}
