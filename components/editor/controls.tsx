"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";
import { usePosterStore } from "@/lib/use-poster-store";
import { FONT_OPTIONS, PAPER_PRESETS, type PosterConfig } from "@/lib/poster-config";
import { exportPoster, type ExportScale } from "@/lib/export-poster";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Save,
  FolderOpen,
  Upload,
  Shuffle,
} from "lucide-react";

export default function Controls() {
  const store = usePosterStore();
  const { config, update, updatePhoto } = store;
  const [tab, setTab] = useState("text");
  const [exportScale, setExportScale] = useState<ExportScale>(2);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        updatePhoto({
          dataUrl: ev.target?.result as string,
          offsetX: 0,
          offsetY: 0,
          zoom: 1,
          rotation: 0,
        });
      };
      reader.readAsDataURL(file);
    },
    [updatePhoto],
  );

  const handleExport = useCallback(async () => {
    let img: HTMLImageElement | null = null;
    if (config.photo.dataUrl) {
      img = await new Promise<HTMLImageElement>((res) => {
        const i = new Image();
        i.onload = () => res(i);
        i.src = config.photo.dataUrl!;
      });
    }
    await exportPoster(config, img, exportScale);
  }, [config, exportScale]);

  const randomize = useCallback(() => {
    const rp = PAPER_PRESETS[Math.floor(Math.random() * PAPER_PRESETS.length)];
    const rf = () => FONT_OPTIONS[Math.floor(Math.random() * FONT_OPTIONS.length)].value;
    const borders: PosterConfig["borderStyle"][] = ["none", "simple", "ornate", "double"];
    update({
      paperColor: rp.color,
      headerFont: rf(),
      nameFont: rf(),
      borderStyle: borders[Math.floor(Math.random() * borders.length)],
      textureIntensity: 0.2 + Math.random() * 0.8,
      showMarine: Math.random() > 0.2,
      showCornerOrnaments: Math.random() > 0.5,
    });
  }, [update]);

  const tabs = ["text", "photo", "style", "export"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#2a2420]">
        <Btn onClick={store.undo} disabled={!store.canUndo} title="Undo">
          <Undo2 size={16} />
        </Btn>
        <Btn onClick={store.redo} disabled={!store.canRedo} title="Redo">
          <Redo2 size={16} />
        </Btn>
        <Btn onClick={store.reset} title="Reset">
          <RotateCcw size={16} />
        </Btn>
        <Btn onClick={randomize} title="Randomize">
          <Shuffle size={16} />
        </Btn>
        <div className="flex-1" />
        <Btn onClick={store.save} title="Save">
          <Save size={16} />
        </Btn>
        <Btn onClick={() => store.load()} title="Load">
          <FolderOpen size={16} />
        </Btn>
      </div>

      <div className="flex border-b border-[#2a2420]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              tab === t
                ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                : "text-[#6a5a48] hover:text-[#8a7a68]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "text" && (
          <>
            <Field label="Name">
              <input
                type="text"
                value={config.name}
                onChange={(e) => update({ name: e.target.value.toUpperCase() })}
                className="input"
                placeholder="YOUR NAME"
              />
            </Field>
            <Field label="Epithet / Alias">
              <input
                type="text"
                value={config.epithet}
                onChange={(e) => update({ epithet: e.target.value })}
                className="input"
                placeholder="The Pirate King"
              />
            </Field>
            <Field label="Bounty Amount">
              <input
                type="text"
                value={config.bounty}
                onChange={(e) => update({ bounty: e.target.value })}
                className="input"
                placeholder="3,000,000,000"
              />
            </Field>
            <Field label="Bounty Prefix">
              <input
                type="text"
                value={config.bountyPrefix}
                onChange={(e) => update({ bountyPrefix: e.target.value })}
                className="input"
                placeholder="B"
                maxLength={5}
              />
            </Field>
            <Field label="Subtitle">
              <input
                type="text"
                value={config.deadOrAlive}
                onChange={(e) =>
                  update({ deadOrAlive: e.target.value.toUpperCase() })
                }
                className="input"
                placeholder="DEAD OR ALIVE"
              />
            </Field>
          </>
        )}

        {tab === "photo" && (
          <>
            <div
              className="border-2 border-dashed border-[#3d3020] rounded-lg p-6 text-center cursor-pointer hover:border-[#c9a84c] transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-[#6a5a48]" />
              <p className="text-sm text-[#8a7a68]">
                {config.photo.dataUrl
                  ? "Click to replace photo"
                  : "Click to upload photo"}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </div>
            {config.photo.dataUrl && (
              <>
                <Field label={`Zoom: ${config.photo.zoom.toFixed(1)}x`}>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={config.photo.zoom}
                    onChange={(e) =>
                      updatePhoto({ zoom: parseFloat(e.target.value) })
                    }
                    className="range"
                  />
                </Field>
                <Field label={`Rotation: ${config.photo.rotation}°`}>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={config.photo.rotation}
                    onChange={(e) =>
                      updatePhoto({ rotation: parseInt(e.target.value) })
                    }
                    className="range"
                  />
                </Field>
                <Field label="Horizontal Offset">
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={config.photo.offsetX}
                    onChange={(e) =>
                      updatePhoto({ offsetX: parseFloat(e.target.value) })
                    }
                    className="range"
                  />
                </Field>
                <Field label="Vertical Offset">
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={config.photo.offsetY}
                    onChange={(e) =>
                      updatePhoto({ offsetY: parseFloat(e.target.value) })
                    }
                    className="range"
                  />
                </Field>
                <button
                  onClick={() =>
                    updatePhoto({
                      dataUrl: null,
                      offsetX: 0,
                      offsetY: 0,
                      zoom: 1,
                      rotation: 0,
                    })
                  }
                  className="w-full py-2 text-sm text-[#8a7a68] border border-[#3d3020] rounded hover:border-[#5a4a38] transition-colors"
                >
                  Remove Photo
                </button>
              </>
            )}
          </>
        )}

        {tab === "style" && (
          <>
            <Field label="Header Font">
              <select
                value={config.headerFont}
                onChange={(e) => update({ headerFont: e.target.value })}
                className="input"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name Font">
              <select
                value={config.nameFont}
                onChange={(e) => update({ nameFont: e.target.value })}
                className="input"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Body Font">
              <select
                value={config.bodyFont}
                onChange={(e) => update({ bodyFont: e.target.value })}
                className="input"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Paper Color">
              <div className="grid grid-cols-3 gap-2">
                {PAPER_PRESETS.map((p) => (
                  <button
                    key={p.color}
                    onClick={() => update({ paperColor: p.color })}
                    className={`h-10 rounded border-2 transition-colors ${
                      config.paperColor === p.color
                        ? "border-[#c9a84c]"
                        : "border-[#3d3020]"
                    }`}
                    style={{ backgroundColor: p.color }}
                    title={p.label}
                  />
                ))}
              </div>
            </Field>
            <Field label="Paper Texture">
              <div className="grid grid-cols-4 gap-2">
                {(["smooth", "rough", "aged", "burnt"] as const).map((tx) => (
                  <button
                    key={tx}
                    onClick={() => update({ paperTexture: tx })}
                    className={`py-2 text-xs rounded border transition-colors ${
                      config.paperTexture === tx
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-[#3d3020] text-[#6a5a48] hover:text-[#8a7a68]"
                    }`}
                  >
                    {tx}
                  </button>
                ))}
              </div>
            </Field>
            <Field
              label={`Texture: ${Math.round(config.textureIntensity * 100)}%`}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.textureIntensity}
                onChange={(e) =>
                  update({ textureIntensity: parseFloat(e.target.value) })
                }
                className="range"
              />
            </Field>
            <Field label="Border Style">
              <div className="grid grid-cols-4 gap-2">
                {(["none", "simple", "ornate", "double"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => update({ borderStyle: s })}
                    className={`py-2 text-xs rounded border transition-colors ${
                      config.borderStyle === s
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-[#3d3020] text-[#6a5a48] hover:text-[#8a7a68]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Text Color">
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => update({ textColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer bg-transparent"
              />
            </Field>
            <Field label="Accent Color">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => update({ accentColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer bg-transparent"
              />
            </Field>
            <Field label="Border Color">
              <input
                type="color"
                value={config.borderColor}
                onChange={(e) => update({ borderColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer bg-transparent"
              />
            </Field>
            <Toggle
              label="Show Marine"
              on={config.showMarine}
              flip={() => update({ showMarine: !config.showMarine })}
            />
            <Toggle
              label="Corner Ornaments"
              on={config.showCornerOrnaments}
              flip={() =>
                update({ showCornerOrnaments: !config.showCornerOrnaments })
              }
            />
          </>
        )}

        {tab === "export" && (
          <>
            <Field label="Resolution">
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 4] as ExportScale[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setExportScale(s)}
                    className={`py-3 rounded border text-sm transition-colors ${
                      exportScale === s
                        ? "border-[#c9a84c] text-[#c9a84c]"
                        : "border-[#3d3020] text-[#6a5a48]"
                    }`}
                  >
                    {s}x
                    <div className="text-[10px] mt-0.5 text-[#5a4a38]">
                      {600 * s}&times;{850 * s}
                    </div>
                  </button>
                ))}
              </div>
            </Field>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#c9a84c] text-[#0f0b07] font-bold rounded-lg hover:bg-[#dab85c] transition-colors"
            >
              <Download size={18} />
              Download PNG
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#8a7a68] uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  on,
  flip,
}: {
  label: string;
  on: boolean;
  flip: () => void;
}) {
  return (
    <button
      onClick={flip}
      className="flex items-center justify-between w-full py-1.5"
    >
      <span className="text-sm text-[#e8dcc8]">{label}</span>
      <span
        className={`w-10 h-5 rounded-full transition-colors relative ${on ? "bg-[#c9a84c]" : "bg-[#3d3020]"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "left-5" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

function Btn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-2 rounded text-[#8a7a68] hover:text-[#e8dcc8] hover:bg-[#2a2420] disabled:opacity-30 disabled:pointer-events-none transition-colors"
    >
      {children}
    </button>
  );
}
