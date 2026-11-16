"use client";

import { useState } from "react";
import type { MotionValue } from "motion/react";
import { presenceCountries } from "@/data/global-presence";
import { PresenceGlobe } from "@/components/ui/presence-globe";
import "./global-presence.css";

export function GlobalPresence({ animated, reduced, sceneProgress }: { animated: boolean; reduced: boolean; sceneProgress: MotionValue<number> }) {
  const [selection, setSelection] = useState({ id: 'brasil', revision: 0 });
  return <section id={animated ? undefined : "presenca-internacional"} className="global-presence" aria-labelledby="presence-title">
    <div className="presence-panel">
      <div className="presence-layout">
        <div className="presence-copy">
          <p className="presence-eyebrow">Presença internacional</p>
          <h2 id="presence-title">Nossa engenharia<br />ultrapassa <span>fronteiras.</span></h2>
          <p className="presence-company">Cordeiro Engenharia</p>
          <p className="presence-description">De Indaiatuba para o mundo. Nossa experiência em engenharia e tecnologia já atravessou fronteiras, com serviços realizados em sete países da América Latina e do Caribe.</p>
        </div>
        <div className="presence-visual">
          <PresenceGlobe selection={selection} reduced={reduced} sceneProgress={sceneProgress} />
          <p className="presence-origin">Origem conceitual · Indaiatuba, SP</p>
        </div>
        <div className="presence-overview">
          <div className="presence-stat"><span>07</span><p>Países com<br />serviços realizados</p></div>
          <ul className="presence-countries" aria-label="Países com serviços realizados — selecione para destacar no globo">
            {presenceCountries.map(country => <li key={country.id}>
              <button type="button" aria-pressed={selection.id === country.id} aria-controls="presence-globe" onClick={() => setSelection(previous => ({ id: country.id, revision: previous.revision + 1 }))}>
                <span aria-hidden="true" />{country.name}
              </button>
            </li>)}
          </ul>
        </div>
        <p className="presence-note">Experiência internacional da Cordeiro Engenharia. Marcadores por país e conexões ilustrativas.</p>
      </div>
    </div>
  </section>;
}
