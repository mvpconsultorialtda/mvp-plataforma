export function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-6 text-center text-xs text-muted space-y-2">
      <p>
        Projeto financiado pela{" "}
        <span className="font-semibold">CAPES — Coordenação de Aperfeiçoamento de Pessoal de Nível Superior</span>
      </p>
      <p>
        Edital nº 3/2025 — InovaEDUCAÇÃO | Programa Universidade Aberta do Brasil (UAB)
      </p>
      <p className="text-muted/60">
        MVP Consultoria em Tecnologia LTDA &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
