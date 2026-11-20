export const siteConfig = {
  name: "Conta Bem Organizada",
  domain: "contabemorganizada.com",
  tagline: "Informação clara para cuidar das suas contas.",
  topic: "Impostos e contabilidade",
  seoTitle: "Impostos e contabilidade: notícias e guias | Conta Bem Organizada",
  description: "Notícias, guias e explicações sobre impostos e contabilidade para pessoas e pequenos negócios.",
  audience: "Adultos brasileiros e donos de pequenos negócios",
  locale: "pt-BR",
  colors: { navy: "#0F2A43", mint: "#2BB38A", amber: "#F2B544", background: "#F6F8FA", text: "#0F1B2A" },
  fonts: { heading: "Fraunces", body: "Inter" },
  categories: [
    { slug: "pessoas", name: "Pessoas", topics: ["declarações", "documentos"] },
    { slug: "empresas", name: "Empresas", topics: ["regimes", "obrigações"] },
    { slug: "rotinas", name: "Rotinas", topics: ["notas", "conciliação"] },
    { slug: "calendario", name: "Calendário", topics: ["prazos", "alterações"] },
    { slug: "educacao", name: "Educação", topics: ["conceitos", "organização"] },
  ],
  referenceLinks: [
    { label: "Receita Federal", href: "https://www.gov.br/receitafederal/pt-br" },
    { label: "Agência Sebrae", href: "https://agenciasebrae.com.br/" },
  ],
  footerNote: "Conteúdo informativo. Não substitui um contador.",
} as const;

export type SiteCategory = (typeof siteConfig.categories)[number];
export const getCategory = (slug: string) => siteConfig.categories.find((category) => category.slug === slug);
