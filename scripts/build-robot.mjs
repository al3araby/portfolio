// One-off asset pipeline: raw OBJ (10.8MB, no normals) -> welded, decimated,
// normal-baked binary GLB for the web. Run: node scripts/build-robot.mjs
import fs from "node:fs";
import obj2gltf from "obj2gltf";
import { NodeIO } from "@gltf-transform/core";
import { weld, simplify, prune, dedup } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";

const SRC = "public/models/robot.obj";
const OUT = "public/models/robot.glb";
const RATIO = 0.25; // keep ~25% of triangles

const tris = (doc) =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((m) => m.listPrimitives())
    .reduce((n, p) => {
      const idx = p.getIndices();
      const pos = p.getAttribute("POSITION");
      return n + (idx ? idx.getCount() : pos.getCount()) / 3;
    }, 0);

console.log("converting OBJ -> glTF (this parses ~10.8MB of text)…");
const glb = await obj2gltf(SRC, { binary: true });
fs.mkdirSync("public/models", { recursive: true });

const io = new NodeIO();
const doc = await io.readBinary(new Uint8Array(glb));
console.log(`  raw triangles:      ${Math.round(tris(doc)).toLocaleString()}`);

const hasNormals = doc
  .getRoot()
  .listMeshes()
  .flatMap((m) => m.listPrimitives())
  .every((p) => p.getAttribute("NORMAL"));
console.log(`  normals present:    ${hasNormals}`);

await MeshoptSimplifier.ready;
await doc.transform(
  dedup(),
  weld({ tolerance: 0.0001 }),
  simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.01 }),
  prune(),
);
console.log(`  after decimation:   ${Math.round(tris(doc)).toLocaleString()}`);

await io.write(OUT, doc);
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`✓ wrote ${OUT} (${kb} KB)`);
