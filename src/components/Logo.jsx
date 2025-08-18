import React from 'react'

const Logo = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Portal de Holerites"
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback para favicon se logo não carregar
          e.target.src = '/favicon.ico'
        }}
      />
      {showText && (
        <span className="font-bold text-lg text-foreground">
          Portal de Holerites
        </span>
      )}
    </div>
  )
}

export default Logo
