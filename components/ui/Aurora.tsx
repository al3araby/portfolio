/** Decorative animated aurora blobs. Drop as the first child of a
 *  `relative` section — it sits behind the section content.
 *  No `overflow-hidden`: the blurred blobs must be allowed to bleed past
 *  the section edges so they blend softly into neighbouring sections.
 *  Clipping them here produces a hard horizontal seam at the boundary
 *  (`body` already sets `overflow-x: hidden`, so no sideways scroll). */
export default function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
    </div>
  );
}
