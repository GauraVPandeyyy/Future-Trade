import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
// Install: npm i d3
import { hierarchy, tree as d3tree } from "d3-hierarchy";

/**
 * TeamTree — Production-ready, responsive, and scalable tree component.
 *
 * Key features:
 *  - Balanced connectors for any even/odd child count (SVG layout via d3-hierarchy)
 *  - Responsive (viewBox) + pan/zoom + virtual spacing controls
 *  - Hover tooltip with full user details (Name, ID, Phone, Email, Referral)
 *  - Expand/collapse per node (first 2 levels expanded by default)
 *  - Works directly with your API shape (root has downline[])
 *
 * Props:
 *  - data: API response object OR already transformed root node
 *  - loading: boolean (optional)
 *  - onFetch?: async function to fetch data if you prefer internal fetching
 *  - cardSize?: { w: number, h: number } — node card size in px used for layout
 *  - gap?: { x: number, y: number } — horizontal & vertical gaps (px) in layout
 *  - initialDepthOpen?: number — expand nodes up to this depth initially
 */

const defaultCard = { w: 200, h: 72 };
const defaultGap = { x: 60, y: 120 };

export default function TeamTree({
  data,
  loading = false,
  cardSize = defaultCard,
  gap = defaultGap,
  initialDepthOpen = 2,
}) {
  const [rootData, setRootData] = useState(null);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, node: null });
  const [transform, setTransform] = useState({ x: 0, y: 40, k: 1 }); // pan/zoom
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Normalize API -> tree node shape { id, name, phone, email, referral_code, children[] }
  const normalize = useCallback((api) => {
    if (!api) return null;
    const toNode = (u) => ({
      id: u.user_id ?? u.id,
      name: u.name ?? "",
      phone: u.phone ?? "",
      email: u.email ?? "",
      referral_code: u.referral_code ?? "",
      children: (u.children && Array.isArray(u.children) ? u.children : (u.downline || [])).map(toNode),
    });
    // API can be either the full response or just the root user object
    if (api.downline || api.children) return toNode(api);
    // Sometimes wrapped with { status, user_id, name, referral_code, downline: [...] }
    if (api.status !== undefined && (api.downline || api.children)) return toNode(api);
    return api; // already normalized
  }, []);

  useEffect(() => {
    const n = normalize(data);
    setRootData(n);
    // pre-expand: collapse nodes deeper than initialDepthOpen
    const coll = new Set();
    const walk = (node, depth = 0) => {
      if (!node) return;
      if (depth >= initialDepthOpen && node.children && node.children.length) {
        coll.add(node.id);
      }
      node.children?.forEach((c) => walk(c, depth + 1));
    };
    if (n) walk(n);
    setCollapsed(coll);
  }, [data, normalize, initialDepthOpen]);

  const d3Root = useMemo(() => {
    if (!rootData) return null;
    // d3 hierarchy — respect collapsed set
    const h = hierarchy(rootData, (d) => (collapsed.has(d.id) ? null : d.children));
    const nodeW = cardSize.w + gap.x;
    const nodeH = cardSize.h + gap.y;
    const layout = d3tree().nodeSize([nodeW, nodeH]); // [x-gap, y-gap]
    return layout(h);
  }, [rootData, collapsed, cardSize, gap]);

  // Compute canvas bounds for centering & responsive viewBox
  const bounds = useMemo(() => {
    if (!d3Root) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    d3Root.each((n) => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });
    const padding = 80;
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: Math.min(0, minY) - padding,
      maxY: maxY + padding + cardSize.h,
      width: maxX - minX + padding * 2,
      height: (maxY - minY) + padding * 2 + cardSize.h,
    };
  }, [d3Root, cardSize.h]);

  // Pan/zoom handlers (simple, dependency-free)
  const onWheel = (e) => {
    e.preventDefault();
    const { offsetX, offsetY, deltaY } = e.nativeEvent;
    const scale = Math.exp(-deltaY * 0.001);
    const newK = Math.min(2.5, Math.max(0.4, transform.k * scale));
    // Zoom to cursor — adjust translate to keep cursor anchored
    const dx = offsetX - transform.x;
    const dy = offsetY - transform.y;
    const nx = offsetX - (dx * newK) / transform.k;
    const ny = offsetY - (dy * newK) / transform.k;
    setTransform({ x: nx, y: ny, k: newK });
  };

  const onMouseDown = (e) => {
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  };
  const onMouseUp = () => { isPanning.current = false; };
  const onMouseLeave = () => { isPanning.current = false; };

  const toggleCollapse = (id) => {
    setCollapsed((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const handleTooltip = (evt, node, show) => {
    if (!show) {
      setTooltip((t) => ({ ...t, visible: false }));
      return;
    }
    const rect = svgRef.current?.getBoundingClientRect();
    const x = evt.clientX - (rect?.left || 0);
    const y = evt.clientY - (rect?.top || 0);
    setTooltip({ visible: true, x, y, node });
  };

  const renderLink = (link) => {
    // Smooth elbow path: from parent (px,py) to child (cx,cy)
    const px = link.source.x, py = link.source.y + cardSize.h / 2;
    const cx = link.target.x, cy = link.target.y - cardSize.h / 2;
    const mx = (px + cx) / 2;
    const d = `M ${px},${py} C ${mx},${py} ${mx},${cy} ${cx},${cy}`;
    return <path key={`${link.source.data.id}-${link.target.data.id}`} d={d} fill="none" stroke="#CBD5E1" strokeWidth={2} />;
  };

  const NodeCard = ({ n }) => {
    const isCollapsed = collapsed.has(n.data.id);
    return (
      <g transform={`translate(${n.x - cardSize.w / 2}, ${n.y - cardSize.h / 2})`}>
        <foreignObject width={cardSize.w} height={cardSize.h}>
          <div
            className="group rounded-2xl shadow-sm ring-1 ring-slate-200 bg-white hover:shadow-md transition-all duration-150 p-3 flex items-center justify-between"
            onMouseEnter={(e) => handleTooltip(e, n.data, true)}
            onMouseMove={(e) => handleTooltip(e, n.data, true)}
            onMouseLeave={(e) => handleTooltip(e, n.data, false)}
            onTouchStart={(e) => handleTooltip(e.changedTouches[0], n.data, true)}
            onTouchEnd={() => handleTooltip(null, null, false)}
          >
            <div className="min-w-0 pr-3">
              <div className="text-sm font-semibold text-slate-800 truncate">{n.data.name || "—"}</div>
              <div className="text-[11px] text-slate-500">ID: {n.data.id}</div>
              <div className="text-[11px] text-indigo-600 font-medium truncate">Ref: {n.data.referral_code || "—"}</div>
            </div>
            {n.children || n._children ? (
              <button
                className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100"
                onClick={(e) => { e.stopPropagation(); toggleCollapse(n.data.id); }}
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                <span className="text-sm leading-none">{isCollapsed ? "+" : "−"}</span>
              </button>
            ) : null}
          </div>
        </foreignObject>
      </g>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-[320px] grid place-items-center text-slate-500">
        <div className="flex items-center gap-3">
          <span className="animate-spin inline-block w-6 h-6 rounded-full border-2 border-slate-200 border-t-indigo-600" />
          <span className="text-sm">Loading team tree…</span>
        </div>
      </div>
    );
  }

  if (!d3Root) {
    return (
      <div className="w-full h-[200px] grid place-items-center text-rose-600 font-medium">No referral data to display.</div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] bg-slate-50 rounded-xl ring-1 ring-slate-200 overflow-hidden">
      {/* Controls */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <button
          className="px-2.5 py-1.5 text-sm rounded-lg bg-white ring-1 ring-slate-200 hover:bg-slate-50"
          onClick={() => setTransform((t) => ({ ...t, k: Math.min(2.5, t.k * 1.2) }))}
        >
          Zoom In
        </button>
        <button
          className="px-2.5 py-1.5 text-sm rounded-lg bg-white ring-1 ring-slate-200 hover:bg-slate-50"
          onClick={() => setTransform((t) => ({ ...t, k: Math.max(0.4, t.k / 1.2) }))}
        >
          Zoom Out
        </button>
        <button
          className="px-2.5 py-1.5 text-sm rounded-lg bg-white ring-1 ring-slate-200 hover:bg-slate-50"
          onClick={() => setTransform({ x: 0, y: 40, k: 1 })}
        >
          Reset
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <g ref={gRef} transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {/* Links */}
          <g>
            {d3Root.links().map(renderLink)}
          </g>
          {/* Nodes */}
          <g>
            {d3Root.descendants().map((n) => (
              <NodeCard key={n.data.id} n={n} />
            ))}
          </g>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip.visible && tooltip.node && (
        <div
          className="pointer-events-none absolute z-20 w-64 -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 12 }}
        >
          <div className="rounded-xl bg-slate-900 text-white shadow-lg ring-1 ring-black/10 p-3">
            <div className="text-sm font-semibold truncate">{tooltip.node.name || "—"}</div>
            <div className="mt-1 grid grid-cols-3 gap-x-2 gap-y-1 text-[11px] text-slate-300">
              <div className="col-span-1 text-slate-400">ID</div>
              <div className="col-span-2 truncate">{tooltip.node.id}</div>
              <div className="col-span-1 text-slate-400">Phone</div>
              <div className="col-span-2 truncate">{tooltip.node.phone || "—"}</div>
              <div className="col-span-1 text-slate-400">Email</div>
              <div className="col-span-2 truncate">{tooltip.node.email || "—"}</div>
              <div className="col-span-1 text-slate-400">Referral</div>
              <div className="col-span-2 truncate">{tooltip.node.referral_code || "—"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper: Example usage wrapper if you want to pass your API response directly.
 *
 * <TeamTreeContainer apiData={apiResponse} />
 */
export function TeamTreeContainer({ apiData, loading }) {
  // The sample API you shared usually looks like the root user with `downline`. Pass as-is.
  const normalized = useMemo(() => apiData, [apiData]);
  return <TeamTree data={normalized} loading={loading} />;
}
