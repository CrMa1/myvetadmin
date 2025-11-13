import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialCard({ testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="h-full border-2 transition-all hover:border-primary hover:shadow-lg">
      <CardContent className="p-6 space-y-4">
        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? "fill-accent text-accent" : "text-muted"}`} />
          ))}
        </div>

        {/* Comment */}
        <p className="text-muted-foreground leading-relaxed italic">"{testimonial.comment}"</p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Avatar>
            <AvatarImage src={testimonial.image_url || "/placeholder.svg"} alt={testimonial.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.role}
              {testimonial.clinic_name && ` • ${testimonial.clinic_name}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
