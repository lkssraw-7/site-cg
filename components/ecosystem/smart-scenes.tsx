"use client";
import { useSiteReducedMotion } from "@/components/motion/motion-system";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Lightbulb, Moon, Play, Smartphone, Sun, Thermometer, Volume2 } from "lucide-react";

const scenes = [
  { id: "welcome", title: "Boas-vindas", Icon: Sun, heading: "A casa recebe você.", text: "Iluminação acolhedora, temperatura confortável e sua trilha sonora em um único cenário.", light: "Luz acolhedora", climate: "Conforto térmico", audio: "Música ambiente", shade: 0 },
  { id: "cinema", title: "Cinema", Icon: Play, heading: "O ambiente entra no clima.", text: "As luzes diminuem e o entretenimento ganha espaço. Uma cena pensada para o seu momento de pausa.", light: "Iluminação suave", climate: "Ambiente ajustado", audio: "Som e imagem", shade: 0.38 },
  { id: "night", title: "Boa noite", Icon: Moon, heading: "Menos comandos. Mais descanso.", text: "Uma combinação de funções para encerrar o dia, com luzes discretas e ambientes preparados para descansar.", light: "Luz de apoio", climate: "Modo descanso", audio: "Áudio desligado", shade: 0.62 },
];

export function SmartScenes() {
  const [active, setActive] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const reduced = useSiteReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = scenes[active];
  return <div className="smart-scenes">
    <div className="scene-image"><Image src="/images/dreamhome-hero.webp" alt="Simulação visual de uma sala com iluminação integrada" fill sizes="(max-width: 800px) 100vw, 60vw" /><motion.div className="scene-dimmer" initial={false} animate={{ opacity: scene.shade }} transition={{ duration: reduced || keyboard ? 0 : .28, ease: [0.23, 1, 0.32, 1] }} /><div className="scene-image-label"><Smartphone aria-hidden="true" size={17} /> Sua casa, em um toque.</div><span className="image-caption">Demonstração ilustrativa · imagem gerada por IA</span></div>
    <div className="scene-controls"><p className="eyebrow">Experimente uma cena</p>
      <div className="scene-tabs" role="tablist" aria-label="Cenas de uma casa inteligente">
        {scenes.map(({ id, title, Icon }, i) => <button key={id} ref={el => { buttons.current[i] = el; }} id={`tab-${id}`} type="button" role="tab" aria-selected={i === active} aria-controls={`panel-${id}`} tabIndex={i === active ? 0 : -1} onClick={event => { setKeyboard(event.detail === 0); setActive(i); }} onKeyDown={event => {
          let next = i;
          if (event.key === "ArrowRight") next = (i + 1) % scenes.length;
          else if (event.key === "ArrowLeft") next = (i + scenes.length - 1) % scenes.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = scenes.length - 1;
          else return;
          event.preventDefault(); setKeyboard(true); setActive(next); buttons.current[next]?.focus();
        }}><Icon size={16} aria-hidden="true" />{title}</button>)}
      </div>
      {scenes.map((item, index) => <div key={item.id} role="tabpanel" id={`panel-${item.id}`} aria-labelledby={`tab-${item.id}`} hidden={index !== active} tabIndex={0} className="scene-panel">
        {index === active && <motion.div key={item.id} initial={reduced || keyboard ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced || keyboard ? 0 : .18 }}>
          <h3>{item.heading}</h3><p>{item.text}</p>
          <ul className="scene-devices"><li><Lightbulb aria-hidden="true" size={18} /><span>Iluminação<strong>{item.light}</strong></span></li><li><Thermometer aria-hidden="true" size={18} /><span>Climatização<strong>{item.climate}</strong></span></li><li><Volume2 aria-hidden="true" size={18} /><span>Entretenimento<strong>{item.audio}</strong></span></li></ul>
        </motion.div>}
      </div>)}
      <p className="scene-note">Exemplo de integração. Funções e compatibilidade dependem dos dispositivos e do projeto contratado.</p>
      <span className="sr-only" aria-live="polite">Cena {scene.title} selecionada.</span>
    </div>
  </div>;
}
