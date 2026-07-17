import { useState } from "react";
import {
  Zap, Settings, Wrench, Star, Eye, LogOut, Plus, Trash2, X, Menu,
  ChevronRight, LayoutGrid, Image as ImageIcon, RotateCcw,
} from "lucide-react";
import type { SiteData, GalleryItem, ReviewItem, GalleryCategory } from "./types";
import { DEFAULT_DATA } from "./types";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Section = "general" | "hero" | "services" | "gallery" | "reviews";

interface Props {
  data: SiteData;
  onChange: (d: SiteData) => void;
  onExit: () => void;
  onLogout: () => void;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SERVICE_NAMES_FR = [
  "Installations Électriques",
  "Fourniture de Climatisation",
  "Installation Climatisation",
  "Pose d'Unités Fournies",
  "Entretien & Maintenance",
  "Batteries Domestiques",
];

const CAT_LABEL: Record<GalleryCategory, string> = {
  ac: "Climatisation",
  electrical: "Électricité",
  batteries: "Batteries",
};

const CAT_COLOR: Record<GalleryCategory, string> = {
  ac: "bg-blue-100 text-blue-700",
  electrical: "bg-yellow-100 text-yellow-700",
  batteries: "bg-green-100 text-green-700",
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 " +
  "focus:outline-none focus:border-[#0F3D66] focus:ring-2 focus:ring-[#0F3D66]/10 transition-all";

// ─── TINY HELPERS ─────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {title && (
        <h3 className="font-bold text-[#0F3D66] text-sm mb-4 pb-3 border-b border-gray-50">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function ImgPreview({ src, aspect = "video" }: { src: string; aspect?: "video" | "square" }) {
  if (!src) return null;
  return (
    <div className={`mt-2 rounded-xl overflow-hidden bg-gray-100 ${aspect === "square" ? "aspect-square" : "aspect-video"}`}>
      <img src={src} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
    </div>
  );
}

// ─── PANELS ───────────────────────────────────────────────────────────────────

function GeneralPanel({ data, update }: { data: SiteData; update: (p: Partial<SiteData>) => void }) {
  const handleReset = () => {
    if (window.confirm("Réinitialiser TOUTES les données aux valeurs par défaut ?")) {
      update(DEFAULT_DATA);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Card title="Identité">
        <Field label="Nom de l'entreprise">
          <input
            type="text"
            className={inputCls}
            value={data.companyName}
            onChange={(e) => update({ companyName: e.target.value })}
          />
        </Field>
      </Card>

      <Card title="Coordonnées">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Téléphone">
            <input
              type="tel"
              className={inputCls}
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="+32 470 000 000"
            />
          </Field>
          <Field label="E-mail">
            <input
              type="email"
              className={inputCls}
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="info@exemple.be"
            />
          </Field>
          <Field
            label="Lien WhatsApp"
            hint="Format : https://wa.me/32470XXXXXX"
          >
            <input
              type="url"
              className={inputCls}
              value={data.whatsapp}
              onChange={(e) => update({ whatsapp: e.target.value })}
              placeholder="https://wa.me/32470123456"
            />
          </Field>
          <Field label="Adresse / Zone">
            <input
              type="text"
              className={inputCls}
              value={data.address}
              onChange={(e) => update({ address: e.target.value })}
              placeholder="Belgique"
            />
          </Field>
        </div>
      </Card>

      <Card title="Heures d'ouverture">
        <Field label="Horaires" hint="Utilisez ↵ pour les retours à la ligne">
          <textarea
            className={inputCls + " resize-none"}
            rows={3}
            value={data.hours}
            onChange={(e) => update({ hours: e.target.value })}
          />
        </Field>
      </Card>

      <div className="border border-red-100 bg-red-50 rounded-2xl p-5">
        <h3 className="font-bold text-red-600 text-sm mb-1">Zone de danger</h3>
        <p className="text-red-400 text-xs mb-3">Cette action efface toutes vos modifications et restaure les données d'exemple.</p>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          <RotateCcw size={14} />
          Réinitialiser aux valeurs par défaut
        </button>
      </div>
    </div>
  );
}

function HeroPanel({ data, update }: { data: SiteData; update: (p: Partial<SiteData>) => void }) {
  const [newCert, setNewCert] = useState("");
  const [newBrand, setNewBrand] = useState("");

  const addCert = () => {
    const val = newCert.trim();
    if (!val) return;
    update({ heroCerts: [...data.heroCerts, val] });
    setNewCert("");
  };

  const addBrand = () => {
    const val = newBrand.trim();
    if (!val) return;
    update({ brands: [...data.brands, val] });
    setNewBrand("");
  };

  return (
    <div className="flex flex-col gap-5">
      <Card title="Image de fond (Hero)">
        <Field label="URL de l'image" hint="Recommandé : 1920×1080, format paysage">
          <input
            type="url"
            className={inputCls}
            value={data.heroImage}
            onChange={(e) => update({ heroImage: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
        </Field>
        <ImgPreview src={data.heroImage} />
      </Card>

      <Card title="Badges de certification">
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {data.heroCerts.map((cert, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 bg-[#EEF2F7] text-[#0F3D66] text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {cert}
              <button
                onClick={() => update({ heroCerts: data.heroCerts.filter((_, idx) => idx !== i) })}
                className="text-[#0F3D66]/40 hover:text-[#0F3D66] transition-colors ml-0.5"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className={inputCls}
            placeholder="Nouveau badge (ex: Qualiwall)"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCert()}
          />
          <button
            onClick={addCert}
            className="px-4 py-2.5 bg-[#0F3D66] text-white rounded-lg flex-shrink-0 hover:bg-[#0c2f50] transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </Card>

      <Card title="Marques installées">
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {data.brands.map((brand, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {brand}
              <button
                onClick={() => update({ brands: data.brands.filter((_, idx) => idx !== i) })}
                className="text-gray-400 hover:text-gray-700 transition-colors ml-0.5"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className={inputCls}
            placeholder="Nouvelle marque (ex: Toshiba)"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBrand()}
          />
          <button
            onClick={addBrand}
            className="px-4 py-2.5 bg-[#0F3D66] text-white rounded-lg flex-shrink-0 hover:bg-[#0c2f50] transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
      </Card>
    </div>
  );
}

function ServicesPanel({ data, update }: { data: SiteData; update: (p: Partial<SiteData>) => void }) {
  const updateImg = (i: number, val: string) => {
    const imgs = [...data.serviceImages];
    imgs[i] = val;
    update({ serviceImages: imgs });
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3">
        Remplacez l'image de chaque carte de service par n'importe quelle URL d'image.
      </p>
      {SERVICE_NAMES_FR.map((name, i) => (
        <Card key={i} title={`${i + 1}. ${name}`}>
          <Field label="URL de l'image">
            <input
              type="url"
              className={inputCls}
              value={data.serviceImages[i] || ""}
              onChange={(e) => updateImg(i, e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </Field>
          <ImgPreview src={data.serviceImages[i]} />
        </Card>
      ))}
    </div>
  );
}

function GalleryPanel({ data, update }: { data: SiteData; update: (p: Partial<SiteData>) => void }) {
  const [form, setForm] = useState({ img: "", cat: "ac" as GalleryCategory, alt: "" });

  const addPhoto = () => {
    if (!form.img.trim()) return;
    const newItem: GalleryItem = { id: Date.now(), ...form };
    update({ galleryItems: [...data.galleryItems, newItem] });
    setForm({ img: "", cat: "ac", alt: "" });
  };

  const removePhoto = (id: number) =>
    update({ galleryItems: data.galleryItems.filter((g) => g.id !== id) });

  return (
    <div className="flex flex-col gap-5">
      <Card title="Ajouter une photo">
        <Field label="URL de l'image">
          <input
            type="url"
            className={inputCls}
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Catégorie">
            <select
              className={inputCls}
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value as GalleryCategory })}
            >
              <option value="ac">Climatisation</option>
              <option value="electrical">Électricité</option>
              <option value="batteries">Batteries</option>
            </select>
          </Field>
          <Field label="Description (texte alt)">
            <input
              type="text"
              className={inputCls}
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              placeholder="Description de la photo"
            />
          </Field>
        </div>
        <ImgPreview src={form.img} />
        <button
          onClick={addPhoto}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#16A34A] text-white rounded-xl text-sm font-bold hover:bg-[#15803d] transition-colors"
        >
          <Plus size={16} />
          Ajouter la photo
        </button>
      </Card>

      <Card title={`Photos actuelles — ${data.galleryItems.length} photo${data.galleryItems.length !== 1 ? "s" : ""}`}>
        {data.galleryItems.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Aucune photo pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.galleryItems.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-video"
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all flex items-center justify-center">
                  <button
                    onClick={() => removePhoto(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <span
                  className={`absolute bottom-1.5 left-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLOR[item.cat]}`}
                >
                  {CAT_LABEL[item.cat]}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ReviewsPanel({ data, update }: { data: SiteData; update: (p: Partial<SiteData>) => void }) {
  const blank: ReviewItem = { name: "", initials: "", bg: "#0F3D66", rating: 5, date: "", text: "", reply: "" };
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<ReviewItem>(blank);

  const startEdit = (i: number) => {
    setAdding(false);
    setEditIdx(i);
    setForm(data.reviews[i]);
  };

  const startAdd = () => {
    setEditIdx(null);
    setAdding(true);
    setForm(blank);
  };

  const cancel = () => {
    setAdding(false);
    setEditIdx(null);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (adding) {
      update({ reviews: [...data.reviews, form] });
    } else if (editIdx !== null) {
      const next = [...data.reviews];
      next[editIdx] = form;
      update({ reviews: next });
    }
    cancel();
  };

  const remove = (i: number) => {
    update({ reviews: data.reviews.filter((_, idx) => idx !== i) });
    if (editIdx === i) cancel();
  };

  const renderForm = () => (
    <div className="bg-[#F4F8FF] border border-[#0F3D66]/10 rounded-xl p-4 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nom complet">
          <input
            type="text"
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jean Dupont"
          />
        </Field>
        <Field label="Initiales (2 lettres)">
          <input
            type="text"
            className={inputCls}
            maxLength={2}
            value={form.initials}
            onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })}
            placeholder="JD"
          />
        </Field>
        <Field label="Date">
          <input
            type="text"
            className={inputCls}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder="Nov 2024"
          />
        </Field>
        <Field label="Couleur de l'avatar">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.bg}
              onChange={(e) => setForm({ ...form, bg: e.target.value })}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
            />
            <input
              type="text"
              className={inputCls}
              value={form.bg}
              onChange={(e) => setForm({ ...form, bg: e.target.value })}
            />
          </div>
        </Field>
      </div>

      <Field label="Note">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm({ ...form, rating: n })}
              className={`text-2xl leading-none transition-colors ${form.rating >= n ? "text-yellow-400" : "text-gray-200"}`}
            >
              ★
            </button>
          ))}
        </div>
      </Field>

      <Field label="Texte de l'avis">
        <textarea
          className={inputCls + " resize-none"}
          rows={3}
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="Excellent travail, je recommande…"
        />
      </Field>

      <Field label="Réponse du propriétaire">
        <textarea
          className={inputCls + " resize-none"}
          rows={2}
          value={form.reply}
          onChange={(e) => setForm({ ...form, reply: e.target.value })}
          placeholder="Merci pour votre confiance…"
        />
      </Field>

      <div className="flex gap-2 pt-1">
        <button
          onClick={save}
          className="flex-1 py-2.5 bg-[#16A34A] text-white rounded-xl text-sm font-bold hover:bg-[#15803d] transition-colors"
        >
          {adding ? "Ajouter l'avis" : "Enregistrer les modifications"}
        </button>
        <button
          onClick={cancel}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={startAdd}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#0F3D66]/25 text-[#0F3D66] rounded-xl text-sm font-semibold hover:border-[#0F3D66]/50 hover:bg-[#EEF2F7] transition-all"
      >
        <Plus size={16} />
        Ajouter un avis client
      </button>

      {adding && renderForm()}

      {data.reviews.map((r, i) => (
        <Card key={i}>
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: r.bg }}
            >
              {r.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                <span className="text-yellow-400 text-xs tracking-tight">{"★".repeat(r.rating)}</span>
                <span className="text-gray-400 text-xs">{r.date}</span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{r.text}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => startEdit(i)}
                className="px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-[#0F3D66] hover:bg-[#EEF2F7] rounded-lg transition-colors"
              >
                Éditer
              </button>
              <button
                onClick={() => remove(i)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {editIdx === i && <div className="mt-3">{renderForm()}</div>}
        </Card>
      ))}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard({ data, onChange, onExit, onLogout }: Props) {
  const [section, setSection] = useState<Section>("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const update = (patch: Partial<SiteData>) => onChange({ ...data, ...patch });

  const sections: { id: Section; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: "general", label: "Général", icon: Settings },
    { id: "hero", label: "Hero", icon: ImageIcon },
    { id: "services", label: "Services", icon: Wrench },
    { id: "gallery", label: "Galerie", icon: LayoutGrid },
    { id: "reviews", label: "Avis clients", icon: Star },
  ];

  const current = sections.find((s) => s.id === section)!;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-[Inter,sans-serif]">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-56 bg-[#0F3D66] flex flex-col flex-shrink-0
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none truncate">{data.companyName}</p>
            <p className="text-white/45 text-xs mt-0.5">Dashboard admin</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {sections.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSection(s.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/55 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{s.label}</span>
                {active && <ChevronRight size={13} />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 flex flex-col gap-0.5 flex-shrink-0">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/55 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
          >
            <Eye size={16} />
            Voir le site
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white/55 hover:text-white hover:bg-white/8 text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-16 px-5 flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-[#0F3D66] text-base">{current.label}</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-3 py-1 font-medium">
              ✓ Sauvegarde automatique
            </span>
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F3D66] text-white rounded-xl text-sm font-bold hover:bg-[#0c2f50] transition-colors"
            >
              <Eye size={14} />
              Voir le site
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-5 lg:p-8">
            {section === "general" && <GeneralPanel data={data} update={update} />}
            {section === "hero" && <HeroPanel data={data} update={update} />}
            {section === "services" && <ServicesPanel data={data} update={update} />}
            {section === "gallery" && <GalleryPanel data={data} update={update} />}
            {section === "reviews" && <ReviewsPanel data={data} update={update} />}
          </div>
        </main>
      </div>
    </div>
  );
}
