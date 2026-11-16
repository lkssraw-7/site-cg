"use client";

import { useEffect, useRef, useState } from "react";
import type { Globe, Marker } from "cobe";
import type { MotionValue } from "motion/react";
import { CINEMA, easeRange } from "@/components/home/cinema-timeline";
import { presenceCountries } from "@/data/global-presence";
import { AMERICAS, GLOBE_SCALE, MARKER_ELEVATION, focusLocation, dragGlobeView, nearestAngle, projectLocation, spreadLabels, type GlobeView } from "@/components/home/globe-geometry";

const orange: [number, number, number] = [244 / 255, 129 / 255, 32 / 255];
const graphite: [number, number, number] = [23 / 255, 33 / 255, 44 / 255];
const asset = (name: string) => `/images/global-presence/${name}.svg`;
type Selection = { id: string; revision: number };
type Controller = { focus: (selection: Selection) => void };

/** Adapted from the supplied 21st.dev GlobeCdn: COBE canvas + pointer rotation.
 * Demo traffic and continuous rotation are removed. Rendering is demand-driven.
 */
export function PresenceGlobe({ selection, reduced, sceneProgress }: { selection: Selection; reduced: boolean; sceneProgress: MotionValue<number> }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labels = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const currentSelection = useRef(selection);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    currentSelection.current = selection;
    controller.current?.focus(selection);
  }, [selection]);

  useEffect(() => {
    const element = root.current, surface = canvas.current, labelRoot = labels.current;
    if (!element || !surface || !labelRoot) return;
    let globe: Globe | null = null;
    let disposed = false, loading = false, inView = false, failed = false;
    let frame = 0, lastTime = 0, size = 0;
    let view = { ...AMERICAS }, target = { ...AMERICAS };
    let selected = currentSelection.current.id;
    let pointer: { id: number; x: number; y: number; view: GlobeView; touch: boolean } | null = null;
    const labelElements = Array.from(labelRoot.querySelectorAll<HTMLElement>('[data-country-label]'));
    const lines = Array.from(labelRoot.querySelectorAll<SVGLineElement>('line'));

    let detail = easeRange(sceneProgress.get(), CINEMA.globeComplete, .97);
    let near = false;
    const routes = presenceCountries.slice(1).map(country => ({ from: presenceCountries[0].location, to: country.location }));
    const markerData = (): Marker[] => detail === 0 ? [] : presenceCountries.map(country => ({
      location: country.location, size: (country.id === selected ? .035 : .018) * detail,
      color: country.id === selected ? orange : graphite,
    }));

    const layers = () => ({ markers: markerData(), arcs: detail > 0 ? routes : [], arcWidth: .35 * detail });

    const paintLabels = () => {
      const points = presenceCountries.map((country, index) => ({ ...projectLocation(country.location, view), index, side: country.side }));
      const placed = ['left', 'right'].flatMap(side => spreadLabels(points.filter(point => point.side === side && point.visible), size));
      labelElements.forEach((label, index) => {
        const point = points[index], country = presenceCountries[index];
        const visible = point.visible && (size > 440 || country.id === selected);
        label.style.visibility = visible ? 'visible' : 'hidden';
        lines[index].style.visibility = visible ? 'visible' : 'hidden';
        if (!visible) return;
        const width = label.offsetWidth, height = label.offsetHeight;
        let left: number, top: number;
        if (size <= 440) {
          left = Math.min(size - width - 8, Math.max(8, point.x * size + 16));
          top = Math.min(size - height - 8, Math.max(8, point.y * size + 8));
        } else {
          left = country.side === 'left' ? 8 : size - width - 8;
          top = (placed.find(item => item.index === index)?.labelY ?? point.y) * size - height / 2;
        }
        label.style.transform = `translate3d(${left}px,${top}px,0)`;
        const line = lines[index];
        line.setAttribute('x1', String(point.x * size));
        line.setAttribute('y1', String(point.y * size));
        line.setAttribute('x2', String(country.side === 'left' ? left + width : left));
        line.setAttribute('y2', String(top + height / 2));
      });
    };

    const paint = () => {
      if (!globe || !inView || document.hidden || failed) return;
      globe.update({ ...view });
      paintLabels();
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; };
    const tick = (time: number) => {
      frame = 0;
      if (disposed || !inView || document.hidden || !globe || failed) return;
      const dt = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const follow = reduced || pointer ? 1 : 1 - Math.exp(-dt / .15);
      view.phi += (target.phi - view.phi) * follow;
      view.theta += (target.theta - view.theta) * follow;
      const settled = Math.abs(view.phi - target.phi) + Math.abs(view.theta - target.theta) < .0001;
      if (settled) view = { ...target };
      paint();
      if (!settled) frame = requestAnimationFrame(tick);
      else lastTime = 0;
    };
    const requestPaint = () => {
      if (!frame && !disposed && inView && !document.hidden && globe && !failed) frame = requestAnimationFrame(tick);
    };
    const focus = (next: Selection) => {
      selected = next.id;
      const country = presenceCountries.find(item => item.id === selected)!;
      const destination = next.revision ? focusLocation(country.location) : AMERICAS;
      target = { phi: nearestAngle(destination.phi, view.phi), theta: destination.theta };
      if (reduced) view = { ...target };
      if (globe && inView && !document.hidden) globe.update({ markers: markerData() });
      requestPaint();
    };
    controller.current = { focus };

    const resize = () => {
      // Labels and canvas share layout coordinates; the section's entrance scale
      // is applied afterward to both, without affecting projection or resolution.
      size = element.clientWidth;
      if (globe && size > 0 && inView && !document.hidden) {
        // COBE 2.0.1 multiplies these CSS dimensions by DPR internally.
        globe.update({ width: size, height: size, mapSamples: size < 440 ? 10000 : 20000, ...layers() });
        requestPaint();
      }
    };
    const fail = () => { failed = true; stop(); setReady(false); };
    const init = async () => {
      if (disposed || loading || globe || failed) return;
      loading = true;
      try {
        const { default: createGlobe } = await import('cobe');
        if (disposed) return;
        size = element.clientWidth;
        const context = surface.getContext('webgl2', { alpha: true, antialias: true }) || surface.getContext('webgl', { alpha: true, antialias: true });
        if (!context || !size) { fail(); return; }
        globe = createGlobe(surface, {
          width: size, height: size, devicePixelRatio: Math.min(window.devicePixelRatio || 1, size < 440 ? 1.5 : 2),
          ...AMERICAS, dark: 0, diffuse: 1.5, mapSamples: size < 440 ? 10000 : 20000, mapBrightness: 10,
          baseColor: [1, 1, 1], markerColor: graphite, glowColor: [.98, .98, .976],
          scale: GLOBE_SCALE, markerElevation: MARKER_ELEVATION, ...layers(),
          arcColor: orange, arcHeight: .12, opacity: 1,
        });
        setReady(true);
        focus(currentSelection.current);
        requestPaint();
      } catch { if (!disposed) fail(); }
    };
    const warmGlobe = () => {
      if (near && sceneProgress.get() >= .62 && !document.hidden) void init();
    };
    const nearby = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      warmGlobe();
    }, { rootMargin: '300px' });
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) { resize(); requestPaint(); } else stop();
    });
    nearby.observe(element);
    visibility.observe(element);
    const unsubscribe = sceneProgress.on('change', value => {
      if (!globe) warmGlobe();
      const next = easeRange(value, CINEMA.globeComplete, .97);
      if (next === detail) return;
      detail = next;
      if (globe && inView && !document.hidden && !failed) globe.update(layers());
    });
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const onVisibility = () => { if (document.hidden) stop(); else { warmGlobe(); resize(); requestPaint(); } };
    const down = (event: PointerEvent) => {
      if (!globe || failed || !event.isPrimary || event.button !== 0) return;
      // Keep pointer focus on this control without moving the page or focusing <main>.
      if (event.pointerType !== 'touch') event.preventDefault();
      surface.focus({ preventScroll: true });
      stop(); target = { ...view };
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, view: { ...view }, touch: event.pointerType === 'touch' };
      surface.setPointerCapture(event.pointerId);
      surface.dataset.dragging = 'true';
    };
    const move = (event: PointerEvent) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      target = dragGlobeView(pointer.view, event.clientX - pointer.x, event.clientY - pointer.y, size, pointer.touch);
      requestPaint();
    };
    const up = () => {
      const id = pointer?.id;
      pointer = null;
      delete surface.dataset.dragging;
      if (id !== undefined && surface.hasPointerCapture(id)) surface.releasePointerCapture(id);
    };
    const key = (event: KeyboardEvent) => {
      if (!globe || failed || event.altKey || event.ctrlKey || event.metaKey) return;
      const steps: Record<string, [number, number]> = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, -.12], ArrowDown: [0, .12] };
      const step = steps[event.key];
      if (!step) return;
      event.preventDefault();
      target = { phi: target.phi + step[0], theta: Math.max(-1.1, Math.min(1.1, target.theta + step[1])) };
      requestPaint();
    };
    const lost = (event: Event) => { event.preventDefault(); fail(); };
    surface.addEventListener('keydown', key);
    surface.addEventListener('pointerdown', down);
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerup', up);
    surface.addEventListener('pointercancel', up);
    surface.addEventListener('lostpointercapture', up);
    surface.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true; unsubscribe(); stop(); controller.current = null;
      nearby.disconnect(); visibility.disconnect(); observer.disconnect();
      surface.removeEventListener('keydown', key);
      surface.removeEventListener('pointerdown', down); surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerup', up); surface.removeEventListener('pointercancel', up);
      surface.removeEventListener('lostpointercapture', up); surface.removeEventListener('webglcontextlost', lost);
      document.removeEventListener('visibilitychange', onVisibility);
      globe?.destroy();
    };
  }, [reduced, sceneProgress]);

  const selectedCountry = presenceCountries.find(country => country.id === selection.id)!;
  return <div className="presence-globe-wrap">
    <div ref={root} id="presence-globe" className="presence-globe" data-ready={ready || undefined} role="group" aria-label={`Globo da presença internacional. País destacado: ${selectedCountry.name}. Use a lista de países para selecionar.`}>
      <svg className="presence-globe-fallback" viewBox="0 0 708 708" aria-hidden="true">
        <image href={asset('sphere')} x="79" y="79" width="550" height="550" />
        <image href={asset('geography')} width="708" height="708" />
        <g className="presence-map-details">
        {presenceCountries.slice(1).map(country => <image key={country.id} href={asset(country.id)} width="708" height="708" />)}
        {presenceCountries.map(country => <image key={country.id} href={asset(country.id === selection.id ? 'marker-selected' : 'marker')} x={country.fallback[0] - 10} y={country.fallback[1] - 10} width="20" height="20" />)}
        </g>
      </svg>
      <canvas ref={canvas} tabIndex={ready ? 0 : -1} role="img" aria-label="Globo interativo: arraste para girar ou use as setas do teclado." aria-describedby="presence-globe-hint" />
      <div ref={labels} className="presence-globe-labels" aria-hidden="true">
        <svg className="presence-label-lines">{presenceCountries.map(country => <line key={country.id} />)}</svg>
        {presenceCountries.map(country => <span key={country.id} data-country-label={country.id} data-selected={selection.id === country.id || undefined}>{country.name}</span>)}
      </div>
      {!ready && <span className="presence-static-label" aria-hidden="true" style={{ left: `${Math.min(65, selectedCountry.fallback[0] / 708 * 100 + 3)}%`, top: `${selectedCountry.fallback[1] / 708 * 100}%` }}>{selectedCountry.name}</span>}
    </div>
    <p id="presence-globe-hint" className="presence-globe-hint">{ready ? 'Arraste para explorar ou selecione um país na lista.' : 'Selecione um país na lista para destacar no mapa.'}</p>
  </div>;
}
