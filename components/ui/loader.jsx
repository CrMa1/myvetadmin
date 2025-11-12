export function Loader({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin`}></div>
        <div className="absolute inset-0 flex items-center justify-center text-primary">🐾</div>
      </div>
      {text && <p className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>{text}</p>}
    </div>
  )
}

export function LoadingPage({ text = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader size="lg" text={text} />
    </div>
  )
}

export function LoadingOverlay({ text = "Procesando..." }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <Loader size="xl" text={text} />
      </div>
    </div>
  )
}
