export const clinicConfig = {
  name: "MyVetAdmin",
  tagline: "Sistema de Gestión Veterinaria Profesional",
  phone: "+52 (55) 1234-5678",
  email: "contacto@myvetadmin.com",
  address: "Av. Principal 123, Ciudad de México",
  logo: "🐾",
  domain: "https://www.myvetadmin.com",

  hours: {
    weekdays: "9:00 AM - 7:00 PM",
    saturday: "9:00 AM - 3:00 PM",
    sunday: "Cerrado",
  },

  colors: {
    primary: "oklch(0.55 0.08 145)",
    secondary: "oklch(0.88 0.03 85)",
    accent: "oklch(0.60 0.15 50)",
  },
}

export const db = {
  users: [],
  patients: [],
  staff: [],
  accounting: [],
  inventory: [],
  appointments: [],
  consultations: [],
  sales: [],
  userProfile: null,
}

// Initialize with mock data
export const initializeDatabase = () => {
  if (db.patients.length === 0) {
    db.users = [
      {
        id: "USR-1001",
        email: "admin@vetcarepro.com",
        password: "admin123", // In production, this should be hashed
        firstName: "Juan",
        lastName: "Pérez",
        phone: "55-1234-5678",
        position: "Veterinario Principal",
        license: "LIC-123456",
        specialization: "Medicina General",
        avatar: "👨‍⚕️",
        createdAt: new Date().toISOString(),
      },
    ]
    db.patients = generateMockData.patients(20)
    db.staff = generateMockData.staff(10)
    db.accounting = generateMockData.accounting(30)
    db.inventory = generateMockData.inventory(30)
    db.appointments = generateMockData.appointments(10)
    db.consultations = generateMockData.consultations(15)
    db.sales = generateMockData.sales(30)
    db.userProfile = db.users[0]
  }
}

export const generateMockData = {
  sales: (days = 30) => {
    const data = []
    const today = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split("T")[0],
        amount: Math.floor(Math.random() * 15000) + 5000,
        transactions: Math.floor(Math.random() * 20) + 5,
      })
    }
    return data
  },

  appointments: (count = 10) => {
    const animals = ["Perro", "Gato", "Conejo", "Hámster", "Ave"]
    const reasons = ["Consulta general", "Vacunación", "Cirugía", "Emergencia", "Control"]
    const data = []

    for (let i = 0; i < count; i++) {
      const date = new Date()
      date.setHours(date.getHours() + Math.floor(Math.random() * 72))
      data.push({
        id: `APT-${1000 + i}`,
        patientName: `Mascota ${i + 1}`,
        animalType: animals[Math.floor(Math.random() * animals.length)],
        ownerName: `Dueño ${i + 1}`,
        date: date.toISOString(),
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: Math.random() > 0.3 ? "Confirmada" : "Pendiente",
      })
    }
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  patients: (count = 20) => {
    const animals = ["Perro", "Gato", "Conejo", "Hámster", "Ave", "Reptil"]
    const breeds = {
      Perro: ["Labrador", "Chihuahua", "Pastor Alemán", "Bulldog", "Mestizo"],
      Gato: ["Persa", "Siamés", "Angora", "Mestizo", "Maine Coon"],
      Conejo: ["Holandés", "Angora", "Rex", "Mestizo"],
      Hámster: ["Sirio", "Ruso", "Roborovski"],
      Ave: ["Canario", "Periquito", "Loro", "Cacatúa"],
      Reptil: ["Iguana", "Tortuga", "Gecko"],
    }
    const data = []

    for (let i = 0; i < count; i++) {
      const animalType = animals[Math.floor(Math.random() * animals.length)]
      const breedList = breeds[animalType]
      data.push({
        id: `PAT-${2000 + i}`,
        name: `Mascota ${i + 1}`,
        animalType,
        breed: breedList[Math.floor(Math.random() * breedList.length)],
        age: Math.floor(Math.random() * 15) + 1,
        weight: (Math.random() * 30 + 2).toFixed(1),
        sex: Math.random() > 0.5 ? "Macho" : "Hembra",
        ownerName: `Dueño ${i + 1}`,
        ownerPhone: `55-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        medicalHistory: "Sin antecedentes relevantes",
        diseases: Math.random() > 0.7 ? "Ninguna" : "Alergias estacionales",
        lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    return data
  },

  staff: (count = 10) => {
    const positions = ["Veterinario", "Asistente Médico", "Recepcionista", "Técnico"]
    const data = []

    for (let i = 0; i < count; i++) {
      const position = positions[Math.floor(Math.random() * positions.length)]
      data.push({
        id: `STF-${3000 + i}`,
        firstName: `Nombre${i + 1}`,
        lastName: `Apellido${i + 1}`,
        position,
        email: `empleado${i + 1}@vetcarepro.com`,
        phone: `55-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        salary: position === "Veterinario" ? 25000 : position === "Asistente Médico" ? 15000 : 12000,
        license: position === "Veterinario" ? `LIC-${Math.floor(Math.random() * 900000) + 100000}` : "N/A",
        hireDate: new Date(Date.now() - Math.random() * 365 * 3 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    return data
  },

  accounting: (count = 30) => {
    const incomeTypes = ["Consulta", "Cirugía", "Vacunación", "Medicamentos", "Productos"]
    const expenseTypes = ["Nómina", "Suministros", "Servicios", "Mantenimiento", "Renta"]
    const data = []

    for (let i = 0; i < count; i++) {
      const isIncome = Math.random() > 0.4
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 60))

      data.push({
        id: `ACC-${4000 + i}`,
        type: isIncome ? "Ingreso" : "Egreso",
        category: isIncome
          ? incomeTypes[Math.floor(Math.random() * incomeTypes.length)]
          : expenseTypes[Math.floor(Math.random() * expenseTypes.length)],
        amount: isIncome ? Math.floor(Math.random() * 5000) + 500 : Math.floor(Math.random() * 8000) + 1000,
        date: date.toISOString(),
        description: `Descripción de ${isIncome ? "ingreso" : "egreso"}`,
        status: Math.random() > 0.2 ? "Completado" : "Pendiente",
      })
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  inventory: (count = 30) => {
    const categories = ["Medicamento", "Alimento", "Producto", "Servicio"]
    const medicationTypes = ["Antibiótico", "Antiinflamatorio", "Analgésico", "Vitamina"]
    const foodTypes = ["Croquetas", "Alimento húmedo", "Snacks", "Suplemento"]
    const data = []

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      let specificData = {}

      if (category === "Medicamento") {
        specificData = {
          medicationType: medicationTypes[Math.floor(Math.random() * medicationTypes.length)],
          dosage: `${Math.floor(Math.random() * 500) + 50}mg`,
          presentation: Math.random() > 0.5 ? "Tabletas" : "Inyectable",
        }
      } else if (category === "Alimento") {
        specificData = {
          foodType: foodTypes[Math.floor(Math.random() * foodTypes.length)],
          weight: `${Math.floor(Math.random() * 10) + 1}kg`,
          brand: `Marca ${Math.floor(Math.random() * 5) + 1}`,
        }
      }

      data.push({
        id: `INV-${5000 + i}`,
        name: `${category} ${i + 1}`,
        category,
        stock: Math.floor(Math.random() * 100) + 10,
        minStock: 20,
        price: Math.floor(Math.random() * 1000) + 100,
        supplier: `Proveedor ${Math.floor(Math.random() * 5) + 1}`,
        ...specificData,
      })
    }
    return data
  },

  consultations: (count = 15) => {
    const reasons = [
      "Consulta general",
      "Vacunación",
      "Revisión post-operatoria",
      "Problemas digestivos",
      "Problemas de piel",
      "Control de peso",
      "Emergencia",
    ]
    const diagnoses = ["Saludable", "Infección leve", "Requiere seguimiento", "Tratamiento prescrito", "Observación"]
    const data = []

    for (let i = 0; i < count; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90))
      const patientId = `PAT-${2000 + Math.floor(Math.random() * 20)}`

      data.push({
        id: `CONS-${6000 + i}`,
        patientId,
        patientName: `Mascota ${Math.floor(Math.random() * 20) + 1}`,
        ownerName: `Dueño ${Math.floor(Math.random() * 20) + 1}`,
        accompaniedBy: `Persona ${Math.floor(Math.random() * 5) + 1}`,
        date: date.toISOString(),
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
        treatment: "Tratamiento recomendado según diagnóstico",
        notes: "Observaciones adicionales del veterinario",
        veterinarian: `Dr. Veterinario ${Math.floor(Math.random() * 5) + 1}`,
        cost: Math.floor(Math.random() * 2000) + 300,
      })
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  userProfile: () => {
    return {
      id: "USR-1001",
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@vetcarepro.com",
      phone: "55-1234-5678",
      position: "Veterinario Principal",
      license: "LIC-123456",
      specialization: "Medicina General",
      experience: "10 años",
      avatar: "👨‍⚕️",
      address: "Calle Principal 123, CDMX",
      emergencyContact: "55-9876-5432",
      hireDate: "2014-03-15",
    }
  },
}
