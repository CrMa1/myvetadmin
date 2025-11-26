"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function InventoryForm({ isOpen, onClose, onSave, item = null, categories = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    stock: "",
    minStock: "",
    price: "",
    supplier: "",
    expiryDate: "",
    description: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        categoryId: item.categoryId?.toString() || "",
        stock: item.stock?.toString() || "",
        minStock: item.minStock?.toString() || "",
        price: item.price?.toString() || "",
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : "",
        supplier: item.supplier || "",
        description: item.description || "",
      })
    } else {
      resetForm()
    }
    setErrors({})
  }, [item, isOpen])

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      stock: "",
      minStock: "",
      price: "",
      supplier: "",
      expiryDate: "",
      description: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = true
    if (!formData.categoryId) newErrors.categoryId = true
    if (!formData.stock) newErrors.stock = true
    if (!formData.minStock) newErrors.minStock = true
    if (!formData.price) newErrors.price = true

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const itemData = {
      ...(item || {}),
      name: formData.name,
      categoryId: Number.parseInt(formData.categoryId),
      stock: Number.parseInt(formData.stock),
      minStock: Number.parseInt(formData.minStock),
      price: Number.parseFloat(formData.price),
      expiryDate: formData.expiryDate || null,
      supplier: formData.supplier || null,
      description: formData.description || null,
    }

    onSave(itemData)
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
          <DialogDescription>
            {item ? "Modifique los datos del producto" : "Complete los datos del nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className={cn(errors.name && "text-destructive")}>
                Nombre del Producto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setErrors({ ...errors, name: false })
                }}
                placeholder="Ej: Vacuna Antirrábica"
                className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.name && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className={cn(errors.categoryId && "text-destructive")}>
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => {
                  setFormData({ ...formData, categoryId: value })
                  setErrors({ ...errors, categoryId: false })
                }}
              >
                <SelectTrigger className={cn(errors.categoryId && "border-destructive")}>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="1">Medicamento</SelectItem>
                      <SelectItem value="2">Alimento</SelectItem>
                      <SelectItem value="3">Producto</SelectItem>
                      <SelectItem value="4">Servicio</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className={cn(errors.stock && "text-destructive")}>
                Stock Actual <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => {
                  setFormData({ ...formData, stock: e.target.value })
                  setErrors({ ...errors, stock: false })
                }}
                placeholder="Ej: 50"
                className={cn(errors.stock && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.stock && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock" className={cn(errors.minStock && "text-destructive")}>
                Stock Mínimo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => {
                  setFormData({ ...formData, minStock: e.target.value })
                  setErrors({ ...errors, minStock: false })
                }}
                placeholder="Ej: 10"
                className={cn(errors.minStock && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.minStock && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className={cn(errors.price && "text-destructive")}>
                Precio <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value })
                  setErrors({ ...errors, price: false })
                }}
                placeholder="Ej: 250.00"
                className={cn(errors.price && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.price && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier" className={cn(errors.supplier && "text-destructive")}>
                Proveedor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => {
                  setFormData({ ...formData, supplier: e.target.value })
                  setErrors({ ...errors, supplier: false })
                }}
                placeholder="Ej: Farmacia Veterinaria SA"
                className={cn(errors.supplier && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.supplier && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className={cn(errors.expiryDate && "text-destructive")}>
                Fecha de Vencimiento <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => {
                  setFormData({ ...formData, expiryDate: e.target.value })
                  setErrors({ ...errors, expiryDate: false })
                }}
                className={cn(errors.expiryDate && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.expiryDate && <p className="text-xs text-destructive">Este campo es requerido</p>}
            </div>
          </div>



          <div className="space-y-2">
            <Label htmlFor="description">
              Comentarios <span className="text-muted-foreground">(Opcional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: Vacuna importada, mantener refrigerada entre 2-8°C"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Agregue notas adicionales sobre el producto, instrucciones de almacenamiento, etc.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{item ? "Guardar Cambios" : "Agregar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
