"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function PromotionsSection() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPromotions() {
      try {
        const response = await fetch("/api/promotions")
        const data = await response.json()
        setPromotions(data.promotions || [])
      } catch (error) {
        console.error("[v0] Error loading promotions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPromotions()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (promotions.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            <Sparkles className="h-4 w-4" />
            Promociones Especiales
          </div>
          <h2 className="text-3xl font-bold text-balance text-foreground md:text-4xl mb-4">Ofertas Exclusivas</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Aprovecha estas oportunidades limitadas para comenzar con VetSystem
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden border-2 hover:border-accent transition-all group">
              {promo.image_url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={promo.image_url || "/placeholder.svg"}
                    alt={promo.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground text-balance">{promo.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{promo.description}</p>
                {promo.link_text && (
                  <Button asChild className="w-full group/btn">
                    <Link href={promo.link_url || "/comprar"}>
                      {promo.link_text}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
