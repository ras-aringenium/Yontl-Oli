import { useState, useEffect, useCallback, createContext, useContext, Component } from "react";
import type { ReactNode } from "react";
import {
  LogOut, Settings, Wrench, Image, Star, Shield, Zap, ChevronDown, ChevronUp,
  Plus, Trash2, Eye, EyeOff, GripVertical, Save, X, Check, Upload, Menu,
} from "lucide-react";
import { supabase } from "../../../utils/supabase/client";
import {
  fetchBusinessSettings, fetchAllServices, fetchAllGallery, fetchAllReviews,
  fetchAllCertifications, fetchAllBrands, uploadImage, deleteImage,
  DbBusinessSettings, DbService, DbGalleryItem, DbReview, DbCertification, DbBrand,
} from "../lib/db";

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class PanelErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message ?? String(e) }; }
  render() {
    if (this.state.error) return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-xl">
        <p className="font-bold text-red-700 mb-2">Erreur de rendu</p>
        <p className="text-sm text-red-600 font-mono break-all">{this.state.error}</p>
        <button onClick={() => this.setState({ error: null })}
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold">
          Réessayer
        </button>
      </div>
    );
    return this.props.children;
  }
}

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthCtx = createContext<{ token: string | null; refreshToken: string | null }>({ token: null, refreshToken: null });

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const inp = "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
const btn = "px-4 py-2 rounded-lg text-sm font-semibold transition-colors";
const primaryBtn = `${btn} bg-[#0F3D66] text-white hover:bg-[#0c2f50] disabled:opacity-50`;
const dangerBtn = `${btn} bg-red-50 text-red-600 hover:bg-red-100 border border-red-200`;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Card({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function ImgUpload({ bucket, currentUrl, onUpload, aspect = "video" }: { bucket: string; currentUrl: string; onUpload: (url: string) => void; aspect?: "video" | "square" }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const aspectClass = aspect === "square" ? "aspect-square" : "aspect-video";

  const { token, refreshToken } = useContext(AuthCtx);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      if (!token || !refreshToken) throw new Error("Session expirée — veuillez vous reconnecter.");
      await supabase.auth.setSession({ access_token: token, refresh_token: refreshToken });

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
        contentType: file.type || "image/jpeg",
      });

      if (error) throw new Error(error.message);
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      onUpload(urlData.publicUrl);
    } catch (err: any) {
      setUploadError(err?.message ?? "Upload failed.");
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {currentUrl && (
        <img src={currentUrl} alt="" className={`w-full ${aspectClass} object-cover rounded-lg bg-gray-100`} />
      )}
      <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm font-medium ${uploading ? "border-blue-300 text-blue-500 bg-blue-50" : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50"}`}>
        <Upload size={15} />
        {uploading ? "Uploading…" : currentUrl ? "Replace image" : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={uploading} />
      </label>
      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 break-all">{uploadError}</p>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${checked ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
      {checked ? <Eye size={13} /> : <EyeOff size={13} />}
      {label}
    </button>
  );
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={`text-xl leading-none transition-colors ${s <= value ? "text-yellow-400" : "text-gray-300"}`}>★</button>
      ))}
    </div>
  );
}

function SaveBadge({ saving }: { saving: boolean }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${saving ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-700"}`}>
      {saving ? "Saving…" : "✓ Saved"}
    </span>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (token: string, refreshToken: string, user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else onLogin(data.session?.access_token ?? "", data.session?.refresh_token ?? "", data.user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#0F3D66] flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-[#0F3D66] text-sm leading-none">Admin</p>
            <p className="text-gray-400 text-xs mt-0.5">Tableau de bord</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Email">
            <input type="email" required className={inp} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoFocus />
          </Field>
          <Field label="Mot de passe">
            <input type="password" required className={inp} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </Field>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className={primaryBtn}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="text-center text-gray-400 text-xs mt-6">
          Créez un compte administrateur dans votre tableau de bord Supabase → Authentication → Users
        </p>
      </div>
    </div>
  );
}

// ─── BUSINESS SETTINGS ────────────────────────────────────────────────────────
function BusinessPanel() {
  const [data, setData] = useState<DbBusinessSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);

  useEffect(() => { fetchBusinessSettings().then(setData); }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    await supabase.from("business_settings").update({ ...data, updated_at: new Date().toISOString() }).eq("id", data.id);
    setSaving(false);
    setSaved(true);
  };

  const update = (patch: Partial<DbBusinessSettings>) => {
    setData((d) => d ? { ...d, ...patch } : d);
    setSaved(false);
  };

  if (!data) return <p className="text-sm text-gray-400 p-4">Loading…</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Paramètres généraux</h2>
        <div className="flex items-center gap-3">
          <SaveBadge saving={saving} />
          <button onClick={save} disabled={saved} className={primaryBtn}>
            <Save size={14} className="inline mr-1.5" />Sauvegarder
          </button>
        </div>
      </div>

      <Card title="Informations de contact">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom de l'entreprise">
            <input className={inp} value={data.company_name} onChange={(e) => update({ company_name: e.target.value })} />
          </Field>
          <Field label="Email affiché">
            <input type="email" className={inp} value={data.contact_email} onChange={(e) => update({ contact_email: e.target.value })} />
          </Field>
          <Field label="Téléphone">
            <input className={inp} value={data.phone_number} onChange={(e) => update({ phone_number: e.target.value })} />
          </Field>
          <Field label="WhatsApp URL" hint="Format: https://wa.me/32XXXXXXXXX">
            <input className={inp} value={data.whatsapp_number} onChange={(e) => update({ whatsapp_number: e.target.value })} />
          </Field>
          <Field label="Adresse">
            <input className={inp} value={data.address} onChange={(e) => update({ address: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="Horaires d'ouverture">
        <div className="grid sm:grid-cols-3 gap-4">
          {(["fr", "nl", "en"] as const).map((lang) => (
            <Field key={lang} label={lang === "fr" ? "Français" : lang === "nl" ? "Nederlands" : "English"}>
              <textarea className={inp + " resize-none"} rows={3}
                value={data[`opening_hours_${lang}`]}
                onChange={(e) => update({ [`opening_hours_${lang}`]: e.target.value } as any)} />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Texte devis gratuit">
        <div className="grid sm:grid-cols-3 gap-4">
          {(["fr", "nl", "en"] as const).map((lang) => (
            <Field key={lang} label={lang === "fr" ? "Français" : lang === "nl" ? "Nederlands" : "English"}>
              <input className={inp} value={data[`free_quote_text_${lang}`]}
                onChange={(e) => update({ [`free_quote_text_${lang}`]: e.target.value } as any)} />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Image hero (bannière principale)">
        <ImgUpload bucket="hero" currentUrl={data.hero_image_url}
          onUpload={(url) => update({ hero_image_url: url })} />
      </Card>
    </div>
  );
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function ServicesPanel() {
  const [services, setServices] = useState<DbService[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => { fetchAllServices().then(setServices); }, []);

  const save = async (svc: DbService) => {
    setSaving(svc.id);
    await supabase.from("services").update({ ...svc, updated_at: new Date().toISOString() }).eq("id", svc.id);
    setSaving(null);
  };

  const update = (id: string, patch: Partial<DbService>) => {
    setServices((s) => s.map((svc) => svc.id === id ? { ...svc, ...patch } : svc));
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-gray-800">Services</h2>
      {services.map((svc) => {
        const open = editing === svc.id;
        return (
          <Card key={svc.id}>
            <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={() => setEditing(open ? null : svc.id)}>
              <div className="flex items-center gap-3 min-w-0">
                <img src={svc.image_url} alt="" className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{svc.title_fr}</p>
                  <p className="text-gray-400 text-xs">Ordre: {svc.display_order} · {svc.active ? "Actif" : "Masqué"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Toggle checked={svc.active} label={svc.active ? "Actif" : "Masqué"}
                  onChange={(v) => { update(svc.id, { active: v }); }} />
                {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {open && (
              <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Ordre d'affichage">
                    <input type="number" className={inp} value={svc.display_order}
                      onChange={(e) => update(svc.id, { display_order: +e.target.value })} />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {(["fr", "nl", "en"] as const).map((lang) => (
                    <Field key={lang} label={`Titre ${lang.toUpperCase()}`}>
                      <input className={inp} value={svc[`title_${lang}`]}
                        onChange={(e) => update(svc.id, { [`title_${lang}`]: e.target.value } as any)} />
                    </Field>
                  ))}
                  {(["fr", "nl", "en"] as const).map((lang) => (
                    <Field key={`desc_${lang}`} label={`Description ${lang.toUpperCase()}`}>
                      <textarea className={inp + " resize-none"} rows={3} value={svc[`description_${lang}`]}
                        onChange={(e) => update(svc.id, { [`description_${lang}`]: e.target.value } as any)} />
                    </Field>
                  ))}
                </div>
                <Field label="Image">
                  <ImgUpload bucket="services" currentUrl={svc.image_url}
                    onUpload={(url) => update(svc.id, { image_url: url })} />
                </Field>
                <div className="flex justify-end">
                  <button onClick={() => save(svc)} disabled={saving === svc.id} className={primaryBtn}>
                    {saving === svc.id ? "Sauvegarde…" : <><Save size={14} className="inline mr-1.5" />Sauvegarder</>}
                  </button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function GalleryPanel() {
  type GalleryRow = DbGalleryItem & { services: { slug: string; title_fr: string } | null };
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [services, setServices] = useState<DbService[]>([]);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({ service_id: "", image_url: "", alt_text_fr: "", alt_text_nl: "", alt_text_en: "", display_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);

  const load = () => {
    fetchAllGallery().then((d) => setItems(d as GalleryRow[]));
    fetchAllServices().then(setServices);
  };
  useEffect(load, []);

  const addItem = async () => {
    if (!newItem.image_url) return;
    await supabase.from("gallery_items").insert({ ...newItem, active: true });
    setNewItem({ service_id: "", image_url: "", alt_text_fr: "", alt_text_nl: "", alt_text_en: "", display_order: 0 });
    setAdding(false);
    load();
  };

  const updateItem = async (item: GalleryRow) => {
    await supabase.from("gallery_items").update(item).eq("id", item.id);
    setEditId(null);
    load();
  };

  const deleteItem = async (item: GalleryRow) => {
    if (!confirm("Supprimer cette image ?")) return;
    if (item.image_url) await deleteImage("gallery", item.image_url);
    await supabase.from("gallery_items").delete().eq("id", item.id);
    load();
  };

  const toggleActive = async (item: GalleryRow) => {
    await supabase.from("gallery_items").update({ active: !item.active }).eq("id", item.id);
    load();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Galerie</h2>
        <button onClick={() => setAdding(true)} className={primaryBtn}>
          <Plus size={14} className="inline mr-1.5" />Ajouter une image
        </button>
      </div>

      {adding && (
        <Card title="Nouvelle image">
          <div className="flex flex-col gap-4">
            <Field label="Image">
              <ImgUpload bucket="gallery" currentUrl={newItem.image_url}
                onUpload={(url) => setNewItem((n) => ({ ...n, image_url: url }))} />
            </Field>
            <Field label="Service lié">
              <select className={inp} value={newItem.service_id}
                onChange={(e) => setNewItem((n) => ({ ...n, service_id: e.target.value }))}>
                <option value="">— Aucun —</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.title_fr}</option>)}
              </select>
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              {(["fr", "nl", "en"] as const).map((lang) => (
                <Field key={lang} label={`Texte alt ${lang.toUpperCase()}`}>
                  <input className={inp} value={newItem[`alt_text_${lang}`]}
                    onChange={(e) => setNewItem((n) => ({ ...n, [`alt_text_${lang}`]: e.target.value }))} />
                </Field>
              ))}
            </div>
            <Field label="Ordre">
              <input type="number" className={inp} value={newItem.display_order}
                onChange={(e) => setNewItem((n) => ({ ...n, display_order: +e.target.value }))} />
            </Field>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setAdding(false)} className={`${btn} bg-gray-100 text-gray-600`}>Annuler</button>
              <button onClick={addItem} disabled={!newItem.image_url} className={primaryBtn}>Ajouter</button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isEditing = editId === item.id;
          return (
            <div key={item.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${!item.active ? "opacity-60" : ""}`}>
              <div className="relative">
                <img src={item.image_url} alt={item.alt_text_fr} className="w-full aspect-video object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => toggleActive(item)}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white shadow text-gray-600 transition-colors">
                    {item.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => deleteItem(item)}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-red-50 shadow text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {isEditing ? (
                <div className="p-3 flex flex-col gap-3">
                  <Field label="Image">
                    <ImgUpload bucket="gallery" currentUrl={item.image_url}
                      onUpload={(url) => setItems((s) => s.map((i) => i.id === item.id ? { ...i, image_url: url } : i))} />
                  </Field>
                  <Field label="Service">
                    <select className={inp} value={item.service_id ?? ""}
                      onChange={(e) => setItems((s) => s.map((i) => i.id === item.id ? { ...i, service_id: e.target.value || null } : i))}>
                      <option value="">— Aucun —</option>
                      {services.map((s) => <option key={s.id} value={s.id}>{s.title_fr}</option>)}
                    </select>
                  </Field>
                  {(["fr", "nl", "en"] as const).map((lang) => (
                    <Field key={lang} label={`Alt ${lang.toUpperCase()}`}>
                      <input className={inp} value={item[`alt_text_${lang}`] ?? ""}
                        onChange={(e) => setItems((s) => s.map((i) => i.id === item.id ? { ...i, [`alt_text_${lang}`]: e.target.value } : i))} />
                    </Field>
                  ))}
                  <Field label="Ordre">
                    <input type="number" className={inp} value={item.display_order}
                      onChange={(e) => setItems((s) => s.map((i) => i.id === item.id ? { ...i, display_order: +e.target.value } : i))} />
                  </Field>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(null)} className={`flex-1 ${btn} bg-gray-100 text-gray-600`}>Annuler</button>
                    <button onClick={() => updateItem(item)} className={`flex-1 ${primaryBtn}`}>Sauvegarder</button>
                  </div>
                </div>
              ) : (
                <div className="p-3">
                  <p className="text-xs text-gray-500 truncate">{item.alt_text_fr || "Sans description"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.services?.title_fr ?? "Aucun service"}</p>
                  <button onClick={() => setEditId(item.id)} className="mt-2 w-full text-xs text-blue-600 hover:text-blue-800 font-medium">Modifier</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── REVIEW FORM (outside panel to prevent focus loss on re-render) ────────────
type ReviewRow = DbReview & { services: { title_fr: string } | null };

function ReviewForm({ data, onChange, onSave, onCancel, services }: {
  data: any; onChange: (p: any) => void; onSave: () => void; onCancel: () => void; services: DbService[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom du client">
          <input className={inp} value={data.customer_name} onChange={(e) => onChange({ customer_name: e.target.value })} />
        </Field>
        <Field label="Ville">
          <input className={inp} value={data.customer_city} onChange={(e) => onChange({ customer_city: e.target.value })} />
        </Field>
        <Field label="Service">
          <select className={inp} value={data.service_id ?? ""}
            onChange={(e) => onChange({ service_id: e.target.value || null })}>
            <option value="">— Aucun —</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.title_fr}</option>)}
          </select>
        </Field>
        <Field label="Note">
          <Stars value={data.rating} onChange={(v) => onChange({ rating: v })} />
        </Field>
        <Field label="Ordre">
          <input type="number" className={inp} value={data.display_order} onChange={(e) => onChange({ display_order: +e.target.value })} />
        </Field>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {(["fr", "nl", "en"] as const).map((lang) => (
          <Field key={lang} label={`Avis ${lang.toUpperCase()}`}>
            <textarea className={inp + " resize-none"} rows={4} value={data[`review_text_${lang}`]}
              onChange={(e) => onChange({ [`review_text_${lang}`]: e.target.value })} />
          </Field>
        ))}
        {(["fr", "nl", "en"] as const).map((lang) => (
          <Field key={`reply_${lang}`} label={`Réponse propriétaire ${lang.toUpperCase()}`}>
            <textarea className={inp + " resize-none"} rows={3} value={data[`owner_reply_${lang}`]}
              onChange={(e) => onChange({ [`owner_reply_${lang}`]: e.target.value })} />
          </Field>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className={`${btn} bg-gray-100 text-gray-600`}>Annuler</button>
        <button onClick={onSave} className={primaryBtn}>Sauvegarder</button>
      </div>
    </div>
  );
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function ReviewsPanel() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [services, setServices] = useState<DbService[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const blank = { customer_name: "", customer_city: "", service_id: "", rating: 5, review_text_fr: "", review_text_nl: "", review_text_en: "", owner_reply_fr: "", owner_reply_nl: "", owner_reply_en: "", approved: false, display_order: 0 };
  const [newReview, setNewReview] = useState(blank);

  const load = () => {
    fetchAllReviews().then((d) => setReviews(d as ReviewRow[]));
    fetchAllServices().then(setServices);
  };
  useEffect(load, []);

  const addReview = async () => {
    if (!newReview.customer_name) return;
    await supabase.from("reviews").insert({ ...newReview, service_id: newReview.service_id || null });
    setNewReview(blank);
    setAdding(false);
    load();
  };

  const updateReview = async (r: ReviewRow) => {
    await supabase.from("reviews").update(r).eq("id", r.id);
    setEditId(null);
    load();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Supprimer cet avis ?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    load();
  };

  const toggleApproved = async (r: ReviewRow) => {
    await supabase.from("reviews").update({ approved: !r.approved }).eq("id", r.id);
    load();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Avis clients</h2>
        <button onClick={() => setAdding(true)} className={primaryBtn}>
          <Plus size={14} className="inline mr-1.5" />Ajouter un avis
        </button>
      </div>

      {adding && (
        <Card title="Nouvel avis">
          <ReviewForm data={newReview} services={services}
            onChange={(p) => setNewReview((n) => ({ ...n, ...p }))}
            onSave={addReview}
            onCancel={() => setAdding(false)} />
        </Card>
      )}

      {reviews.map((r) => (
        <Card key={r.id}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-800">{r.customer_name} {r.customer_city && <span className="text-gray-400 font-normal">— {r.customer_city}</span>}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.approved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"}`}>
                  {r.approved ? "Approuvé" : "En attente"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.review_text_fr}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => toggleApproved(r)}
                className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${r.approved ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                {r.approved ? <Check size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => setEditId(editId === r.id ? null : r.id)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                Modifier
              </button>
              <button onClick={() => deleteReview(r.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {editId === r.id && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <ReviewForm data={r} services={services}
                onChange={(p) => setReviews((s) => s.map((rv) => rv.id === r.id ? { ...rv, ...p } : rv))}
                onSave={() => updateReview(r)}
                onCancel={() => setEditId(null)} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── CERTIFICATIONS ───────────────────────────────────────────────────────────
function CertificationsPanel() {
  const [certs, setCerts] = useState<DbCertification[]>([]);
  const [adding, setAdding] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", logo_url: "", description_fr: "", description_nl: "", description_en: "", display_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);

  const load = () => fetchAllCertifications().then(setCerts);
  useEffect(load, []);

  const add = async () => {
    if (!newCert.name) return;
    await supabase.from("certifications").insert({ ...newCert, active: true });
    setNewCert({ name: "", logo_url: "", description_fr: "", description_nl: "", description_en: "", display_order: 0 });
    setAdding(false);
    load();
  };

  const save = async (c: DbCertification) => {
    await supabase.from("certifications").update(c).eq("id", c.id);
    setEditId(null);
    load();
  };

  const del = async (c: DbCertification) => {
    if (!confirm("Supprimer cette certification ?")) return;
    if (c.logo_url) await deleteImage("certifications", c.logo_url);
    await supabase.from("certifications").delete().eq("id", c.id);
    load();
  };

  const toggle = async (c: DbCertification) => {
    await supabase.from("certifications").update({ active: !c.active }).eq("id", c.id);
    load();
  };

  const updateLocal = (id: string, patch: Partial<DbCertification>) =>
    setCerts((s) => s.map((c) => c.id === id ? { ...c, ...patch } : c));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Certifications</h2>
        <button onClick={() => setAdding(true)} className={primaryBtn}>
          <Plus size={14} className="inline mr-1.5" />Ajouter
        </button>
      </div>

      {adding && (
        <Card title="Nouvelle certification">
          <div className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nom"><input className={inp} value={newCert.name} onChange={(e) => setNewCert((n) => ({ ...n, name: e.target.value }))} /></Field>
              <Field label="Ordre"><input type="number" className={inp} value={newCert.display_order} onChange={(e) => setNewCert((n) => ({ ...n, display_order: +e.target.value }))} /></Field>
            </div>
            <Field label="Logo">
              <ImgUpload bucket="certifications" currentUrl={newCert.logo_url} aspect="square"
                onUpload={(url) => setNewCert((n) => ({ ...n, logo_url: url }))} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              {(["fr", "nl", "en"] as const).map((lang) => (
                <Field key={lang} label={`Description ${lang.toUpperCase()}`}>
                  <textarea className={inp + " resize-none"} rows={3} value={newCert[`description_${lang}`]}
                    onChange={(e) => setNewCert((n) => ({ ...n, [`description_${lang}`]: e.target.value }))} />
                </Field>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setAdding(false)} className={`${btn} bg-gray-100 text-gray-600`}>Annuler</button>
              <button onClick={add} className={primaryBtn}>Ajouter</button>
            </div>
          </div>
        </Card>
      )}

      {certs.map((c) => (
        <Card key={c.id}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {c.logo_url ? <img src={c.logo_url} alt={c.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 border" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Shield size={16} className="text-gray-400" /></div>}
              <div>
                <p className="font-semibold text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">Ordre: {c.display_order}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Toggle checked={c.active} label={c.active ? "Actif" : "Masqué"} onChange={() => toggle(c)} />
              <button onClick={() => setEditId(editId === c.id ? null : c.id)} className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">Modifier</button>
              <button onClick={() => del(c)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>
          {editId === c.id && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
              <Field label="Logo">
                <ImgUpload bucket="certifications" currentUrl={c.logo_url} aspect="square"
                  onUpload={(url) => updateLocal(c.id, { logo_url: url })} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom"><input className={inp} value={c.name} onChange={(e) => updateLocal(c.id, { name: e.target.value })} /></Field>
                <Field label="Ordre"><input type="number" className={inp} value={c.display_order} onChange={(e) => updateLocal(c.id, { display_order: +e.target.value })} /></Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {(["fr", "nl", "en"] as const).map((lang) => (
                  <Field key={lang} label={`Description ${lang.toUpperCase()}`}>
                    <textarea className={inp + " resize-none"} rows={3} value={c[`description_${lang}`] ?? ""}
                      onChange={(e) => updateLocal(c.id, { [`description_${lang}`]: e.target.value } as any)} />
                  </Field>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditId(null)} className={`${btn} bg-gray-100 text-gray-600`}>Annuler</button>
                <button onClick={() => save(c)} className={primaryBtn}>Sauvegarder</button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── BRANDS ───────────────────────────────────────────────────────────────────
function BrandsPanel() {
  const [brands, setBrands] = useState<DbBrand[]>([]);
  const [adding, setAdding] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", logo_url: "", display_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);

  const load = () => fetchAllBrands().then(setBrands);
  useEffect(load, []);

  const add = async () => {
    if (!newBrand.name) return;
    await supabase.from("brands").insert({ ...newBrand, active: true });
    setNewBrand({ name: "", logo_url: "", display_order: 0 });
    setAdding(false);
    load();
  };

  const save = async (b: DbBrand) => {
    await supabase.from("brands").update(b).eq("id", b.id);
    setEditId(null);
    load();
  };

  const del = async (b: DbBrand) => {
    if (!confirm("Supprimer cette marque ?")) return;
    if (b.logo_url) await deleteImage("brands", b.logo_url);
    await supabase.from("brands").delete().eq("id", b.id);
    load();
  };

  const toggle = async (b: DbBrand) => {
    await supabase.from("brands").update({ active: !b.active }).eq("id", b.id);
    load();
  };

  const updateLocal = (id: string, patch: Partial<DbBrand>) =>
    setBrands((s) => s.map((b) => b.id === id ? { ...b, ...patch } : b));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Marques</h2>
        <button onClick={() => setAdding(true)} className={primaryBtn}>
          <Plus size={14} className="inline mr-1.5" />Ajouter
        </button>
      </div>

      {adding && (
        <Card title="Nouvelle marque">
          <div className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nom"><input className={inp} value={newBrand.name} onChange={(e) => setNewBrand((n) => ({ ...n, name: e.target.value }))} /></Field>
              <Field label="Ordre"><input type="number" className={inp} value={newBrand.display_order} onChange={(e) => setNewBrand((n) => ({ ...n, display_order: +e.target.value }))} /></Field>
            </div>
            <Field label="Logo">
              <ImgUpload bucket="brands" currentUrl={newBrand.logo_url} aspect="square"
                onUpload={(url) => setNewBrand((n) => ({ ...n, logo_url: url }))} />
            </Field>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setAdding(false)} className={`${btn} bg-gray-100 text-gray-600`}>Annuler</button>
              <button onClick={add} className={primaryBtn}>Ajouter</button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <Card key={b.id}>
            <div className={`flex flex-col gap-3 ${!b.active ? "opacity-60" : ""}`}>
              {b.logo_url
                ? <img src={b.logo_url} alt={b.name} className="h-12 object-contain mx-auto" />
                : <div className="h-12 bg-gray-50 rounded-lg flex items-center justify-center"><p className="font-bold text-gray-500">{b.name}</p></div>}
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
                <div className="flex gap-1">
                  <Toggle checked={b.active} label="" onChange={() => toggle(b)} />
                  <button onClick={() => setEditId(editId === b.id ? null : b.id)} className="px-2 py-1 rounded-lg border border-gray-200 text-xs text-gray-600">Modifier</button>
                  <button onClick={() => del(b)} className="p-1 rounded-lg text-red-400 hover:bg-red-50"><Trash2 size={13} /></button>
                </div>
              </div>
              {editId === b.id && (
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
                  <Field label="Logo">
                    <ImgUpload bucket="brands" currentUrl={b.logo_url} aspect="square"
                      onUpload={(url) => updateLocal(b.id, { logo_url: url })} />
                  </Field>
                  <Field label="Nom"><input className={inp} value={b.name} onChange={(e) => updateLocal(b.id, { name: e.target.value })} /></Field>
                  <Field label="Ordre"><input type="number" className={inp} value={b.display_order} onChange={(e) => updateLocal(b.id, { display_order: +e.target.value })} /></Field>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(null)} className={`flex-1 ${btn} bg-gray-100 text-gray-600`}>Annuler</button>
                    <button onClick={() => save(b)} className={`flex-1 ${primaryBtn}`}>Sauvegarder</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN SHELL ──────────────────────────────────────────────────────────────
type Section = "settings" | "services" | "gallery" | "reviews" | "certifications" | "brands";

const NAV: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "settings", label: "Paramètres", icon: Settings },
  { key: "services", label: "Services", icon: Wrench },
  { key: "gallery", label: "Galerie", icon: Image },
  { key: "reviews", label: "Avis", icon: Star },
  { key: "certifications", label: "Certifications", icon: Shield },
  { key: "brands", label: "Marques", icon: Zap },
];

export default function AdminApp() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<Section>("settings");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setToken(data.session?.access_token ?? null);
      setRefreshToken(data.session?.refresh_token ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
      setRefreshToken(session?.refresh_token ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Chargement…</p></div>;
  if (!user) return <LoginPage onLogin={(t, rt, u) => { setToken(t); setRefreshToken(rt); setUser(u); }} />;


  return (
    <AuthCtx.Provider value={{ token, refreshToken }}>
    <div className="min-h-screen bg-gray-50 flex font-[Inter,sans-serif]">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 bg-[#0F3D66] flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center"><Zap size={14} className="text-white" /></div>
            <span className="font-bold text-white text-sm">Admin</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white/60 hover:text-white"><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { setSection(key); setMobileOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${section === key ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-white/40 text-xs truncate mb-2">{user.email}</p>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors">
            <LogOut size={15} />Se déconnecter
          </button>
          <a href="/#" className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors">
            ← Voir le site
          </a>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-600"><Menu size={20} /></button>
          <h1 className="font-bold text-gray-800">{NAV.find((n) => n.key === section)?.label}</h1>
        </header>
        <div className="p-5 lg:p-8 max-w-5xl mx-auto">
          <PanelErrorBoundary>
            {section === "settings" && <BusinessPanel />}
            {section === "services" && <ServicesPanel />}
            {section === "gallery" && <GalleryPanel />}
            {section === "reviews" && <ReviewsPanel />}
            {section === "certifications" && <CertificationsPanel />}
            {section === "brands" && <BrandsPanel />}
          </PanelErrorBoundary>
        </div>
      </main>
    </div>
    </AuthCtx.Provider>
  );
}
