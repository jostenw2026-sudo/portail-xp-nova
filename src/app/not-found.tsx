import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-navy text-white">
      <div className="container-x py-28 text-center">
        <p className="eyebrow mb-3">Erreur 404</p>
        <h1 className="title-hero !text-white">Page introuvable</h1>
        <p className="mx-auto mt-5 max-w-xl text-white/80 text-lg">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="primary">
            Retour à l&apos;accueil
          </Button>
          <Button href="/contact" variant="ghost">
            Nous contacter
          </Button>
        </div>
      </div>
      <div className="h-1.5 bg-gold" />
    </section>
  );
}
