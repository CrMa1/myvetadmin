"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, ShoppingCart, Receipt } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingPage } from "@/components/ui/loader"
import { useAlertToast } from "@/components/ui/alert-toast"

export default function VenderPage() {
  const { user, selectedClinic, getUserId, getClinicId } = useAuth()
  const { showSuccess, showError, showWarning, showInfo, AlertContainer } = useAlertToast()
  const [inventory, setInventory] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [customer, setCustomer] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Efectivo")
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastSale, setLastSale] = useState(null)

  useEffect(() => {
    const userId = getUserId()
    const clinicId = getClinicId()
    if (userId && clinicId) {
      fetchInventory()
    }
  }, [getUserId, getClinicId])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const userId = getUserId()
      const clinicId = getClinicId()
      const response = await fetch(`/api/inventory?userId=${userId}&clinicId=${clinicId}`)
      const result = await response.json()
      if (result.success) {
        setInventory(result.data.filter((item) => item.stock > 0))
      } else {
        showError(result.error || "Error al cargar inventario")
      }
    } catch (error) {
      console.error("Error al cargar inventario:", error)
      showError("Error al cargar el inventario")
    } finally {
      setLoading(false)
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      if (existingItem.quantity < item.stock) {
        setCart(
          cart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
          ),
        )
        showInfo(`${item.name} agregado al carrito`)
      } else {
        showWarning("No hay suficiente stock disponible")
      }
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
      showInfo(`${item.name} agregado al carrito`)
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
    showInfo("Producto eliminado del carrito")
  }

  const updateQuantity = (itemId, newQuantity) => {
    const item = inventory.find((i) => i.id === itemId)
    if (newQuantity > item.stock) {
      showWarning("No hay suficiente stock disponible")
      return
    }
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(cart.map((cartItem) => (cartItem.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem)))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.16 // 16% IVA
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount
  }

  const processSale = async () => {
    if (cart.length === 0) {
      showWarning("El carrito está vacío")
      return
    }

    setLoading(true)

    try {
      const userId = getUserId()
      const clinicId = getClinicId()

      const saleData = {
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        discount: discount,
        total: calculateTotal(),
        paymentMethod: paymentMethod,
        cashier: user ? `${user.name || ""} ${user.lastName || ""}`.trim() : "Cajero",
        customer: customer || "Cliente general",
        userId,
        clinicId,
      }

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      })

      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es JSON válido")
      }

      const result = await response.json()

      if (result.success) {
        setLastSale(result.data)
        setShowReceipt(true)
        setCart([])
        setCustomer("")
        setDiscount(0)
        fetchInventory()
        showSuccess("Venta procesada exitosamente")
      } else {
        showError(result.error || "Error al procesar la venta")
      }
    } catch (error) {
      console.error("[v0] Error al procesar venta:", error)
      showError(`Error al procesar la venta: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const printReceipt = () => {
    window.print()
  }

  const newSale = () => {
    setShowReceipt(false)
    setLastSale(null)
  }

  const userId = getUserId()
  const clinicId = getClinicId()

  if (loading) {
    return <LoadingPage message="Cargando punto de venta..." />
  }

  if (!userId || !clinicId) {
    return <div className="container-custom py-8">Por favor selecciona un consultorio</div>
  }

  if (showReceipt && lastSale) {
    return (
      <div className="container-custom py-8">
        <AlertContainer />
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-6">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold mb-2">Venta Completada</h1>
            <p className="text-muted-foreground">Ticket #{lastSale.id}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fecha:</span>
              <span>{new Date(lastSale.sale_date || lastSale.date).toLocaleString("es-MX")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cajero:</span>
              <span>{lastSale.cashier}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cliente:</span>
              <span>{lastSale.customer_name || lastSale.customer}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de pago:</span>
              <span>{lastSale.payment_method || lastSale.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6">
            <h3 className="font-semibold mb-3">Artículos</h3>
            {lastSale.items && Array.isArray(lastSale.items) && lastSale.items.length > 0 ? (
              lastSale.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-2">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay artículos para mostrar</p>
            )}
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${lastSale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IVA (16%):</span>
              <span>${lastSale.tax.toFixed(2)}</span>
            </div>
            {lastSale.discount > 0 && (
              <div className="flex justify-between text-sm text-accent">
                <span>Descuento:</span>
                <span>-${lastSale.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${lastSale.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={printReceipt} variant="outline" className="flex-1 bg-transparent">
              Imprimir Ticket
            </Button>
            <Button onClick={newSale} className="flex-1 btn-primary">
              Nueva Venta
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Punto de Venta</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-6">
              <Label htmlFor="search">Buscar productos</Label>
              <Input
                id="search"
                placeholder="Buscar por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
              {filteredInventory.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addToCart(item)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">${item.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`${item.stock < item.minStock ? "text-destructive" : "text-muted-foreground"}`}>
                      Stock: {item.stock}
                    </span>
                    <Button size="sm" className="btn-primary">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Cart Section */}
        <div>
          <Card className="p-6 sticky top-4">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Carrito</h2>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="customer">Cliente</Label>
                <Input
                  id="customer"
                  placeholder="Nombre del cliente (opcional)"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Método de pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t pt-4 mb-4 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">El carrito está vacío</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 mb-3 pb-3 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price} c/u</p>
                    </div>
                    <Input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                    />
                    <span className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="discount">Descuento:</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max={calculateSubtotal()}
                  value={discount}
                  onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                  className="w-24 text-right"
                />
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={processSale} disabled={cart.length === 0 || loading} className="w-full btn-primary">
              {loading ? "Procesando..." : "Procesar Venta"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
