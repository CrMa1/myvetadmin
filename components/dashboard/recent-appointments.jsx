"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, CalendarX } from "lucide-react"

export function RecentAppointments({ data }) {
  const hasAppointments = data && data.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Citas</CardTitle>
        <CardDescription>
          {hasAppointments ? "Citas programadas para los próximos días" : "No hay citas programadas"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAppointments ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <CalendarX className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">No hay citas programadas</p>
            <p className="text-sm text-muted-foreground">Las próximas citas aparecerán aquí cuando se agenden</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((appointment) => {
              const appointmentDate = new Date(appointment.date)
              const isConfirmed = appointment.status === "Confirmada"

              return (
                <div
                  key={appointment.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{appointment.patientName}</p>
                      <Badge variant={isConfirmed ? "default" : "secondary"} className="text-xs">
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appointment.species} - {appointment.ownerName}
                    </p>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(appointmentDate, "dd MMM yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(appointmentDate, "HH:mm", { locale: es })}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
