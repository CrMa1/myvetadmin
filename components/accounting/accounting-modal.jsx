"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency, parseCurrency } from "@/lib/currency"

export function AccountingModal({ isOpen, onClose, record, categories, onSave }) {
  const [formData, setFormData] = useState({
    type: "",
    category: "",
    amount: "",
    description: "",
    date: "",
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState("")

  const isEditing = !!record

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type || "",
        category: record.categoryId?.toString() || "",
        amount: record.amount || "",
        description: record.description || "",
        date: record.date || "",
      })
    } else {
      setFormData({
        type: "",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
    setErrors({})
    setApiError("")
  }, [record, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) {
      setApiError("")
    }
  }

  const handleCurrencyChange = (value) => {
    const cleanValue = parseCurrency(value)
    if (cleanValue === "" || /^\d*\.?\d{0,2}$/.test(cleanValue)) {
      handleInputChange("amount", cleanValue)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.type) {
      newErrors.type = "Campo requerido"
    }
    if (!formData.category) {
      newErrors.category = "Campo requerido"
    }
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Campo requerido"
    }
    if (!formData.date) {
      newErrors.date = "Campo requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const result = await onSave(formData, record)

      if (result && !result.success) {
        setApiError(result.error || "Error al guardar el registro")
        return
      }

      onClose()
    } catch (error) {
      setApiError("Error al guardar el registro")
    }
  }

  const filteredCategories = categories.filter((cat) => {
    if (!formData.type) return true
    return formData.type === "Ingreso" ? cat.type === "income" : cat.type === "expense"
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Registro" : "Agregar Nuevo Registro"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEditing ? "Modifica los datos del registro" : "Ingresa los datos del nuevo registro"}
          </p>
        </DialogHeader>

        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ingreso">Ingreso</SelectItem>
                  <SelectItem value="Egreso">Egreso</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="category">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">
                Monto <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  placeholder="0.00"
                  className={`pl-7 ${errors.amount ? "border-red-500" : ""}`}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
              {formData.amount && !errors.amount && (
                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(formData.amount)}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              placeholder="Descripción opcional del registro..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-primary">
              {isEditing ? "Actualizar" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
