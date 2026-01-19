export type Language = 'en' | 'es';

export const translations = {
  // Common UI elements
  common: {
    next: { en: 'Next', es: 'Siguiente' },
    back: { en: 'Back', es: 'Atrás' },
    submit: { en: 'Submit', es: 'Enviar' },
    cancel: { en: 'Cancel', es: 'Cancelar' },
    save: { en: 'Save', es: 'Guardar' },
    delete: { en: 'Delete', es: 'Eliminar' },
    edit: { en: 'Edit', es: 'Editar' },
    loading: { en: 'Loading...', es: 'Cargando...' },
    error: { en: 'Error', es: 'Error' },
    success: { en: 'Success', es: 'Éxito' },
    required: { en: 'Required', es: 'Requerido' },
    optional: { en: 'Optional', es: 'Opcional' },
    yes: { en: 'Yes', es: 'Sí' },
    no: { en: 'No', es: 'No' },
    free: { en: 'Free', es: 'Gratis' },
    popular: { en: 'Popular', es: 'Popular' },
    recommended: { en: 'Recommended', es: 'Recomendado' },
    perMonth: { en: '/mo', es: '/mes' },
    perYear: { en: '/yr', es: '/año' },
    monthly: { en: 'Monthly', es: 'Mensual' },
    annual: { en: 'Annual', es: 'Anual' },
    savings: { en: 'Save', es: 'Ahorra' },
    twoMonthsFree: { en: '2 months free', es: '2 meses gratis' },
  },

  // Trade verticals
  trades: {
    painting: {
      name: { en: 'Painting', es: 'Pintura' },
      description: { en: 'Interior & exterior painting services', es: 'Servicios de pintura interior y exterior' },
      icon: 'Paintbrush',
    },
    roofing: {
      name: { en: 'Roofing', es: 'Techos' },
      description: { en: 'Roof installation, repair & maintenance', es: 'Instalación, reparación y mantenimiento de techos' },
      icon: 'Home',
    },
    hvac: {
      name: { en: 'HVAC', es: 'Climatización' },
      description: { en: 'Heating, cooling & ventilation systems', es: 'Sistemas de calefacción, refrigeración y ventilación' },
      icon: 'Thermometer',
    },
    electrical: {
      name: { en: 'Electrical', es: 'Electricidad' },
      description: { en: 'Electrical wiring, panels & repairs', es: 'Cableado eléctrico, paneles y reparaciones' },
      icon: 'Zap',
    },
    plumbing: {
      name: { en: 'Plumbing', es: 'Plomería' },
      description: { en: 'Pipes, fixtures & water systems', es: 'Tuberías, accesorios y sistemas de agua' },
      icon: 'Droplet',
    },
    landscaping: {
      name: { en: 'Landscaping', es: 'Jardinería' },
      description: { en: 'Lawn care, gardens & outdoor spaces', es: 'Cuidado del césped, jardines y espacios exteriores' },
      icon: 'Trees',
    },
    construction: {
      name: { en: 'Construction', es: 'Construcción' },
      description: { en: 'General contracting & building', es: 'Contratación general y construcción' },
      icon: 'Hammer',
    },
  },

  // Onboarding wizard
  onboarding: {
    title: { en: 'Start Your Business', es: 'Inicia Tu Negocio' },
    subtitle: { en: 'Get your professional website and tools in minutes', es: 'Obtén tu sitio web profesional y herramientas en minutos' },
    
    steps: {
      business: { en: 'Business Info', es: 'Info del Negocio' },
      branding: { en: 'Branding', es: 'Marca' },
      services: { en: 'Services', es: 'Servicios' },
      tools: { en: 'Estimator Tools', es: 'Herramientas' },
      subscription: { en: 'Plan', es: 'Plan' },
    },

    step1: {
      title: { en: 'Tell us about your business', es: 'Cuéntanos sobre tu negocio' },
      companyName: { en: 'Company Name', es: 'Nombre de la Empresa' },
      companyNamePlaceholder: { en: 'Your Company Name', es: 'Nombre de Tu Empresa' },
      ownerName: { en: 'Owner Name', es: 'Nombre del Propietario' },
      ownerNamePlaceholder: { en: 'Full Name', es: 'Nombre Completo' },
      email: { en: 'Email Address', es: 'Correo Electrónico' },
      emailPlaceholder: { en: 'you@company.com', es: 'tu@empresa.com' },
      phone: { en: 'Phone Number', es: 'Número de Teléfono' },
      phonePlaceholder: { en: '(555) 123-4567', es: '(555) 123-4567' },
      city: { en: 'City', es: 'Ciudad' },
      cityPlaceholder: { en: 'Nashville', es: 'Miami' },
      state: { en: 'State', es: 'Estado' },
      statePlaceholder: { en: 'TN', es: 'FL' },
      tradeVertical: { en: 'Primary Trade', es: 'Oficio Principal' },
      selectTrade: { en: 'Select your primary trade', es: 'Selecciona tu oficio principal' },
    },

    step2: {
      title: { en: 'Customize your brand', es: 'Personaliza tu marca' },
      logoUpload: { en: 'Upload Logo', es: 'Subir Logo' },
      logoDescription: { en: 'PNG or JPG, max 2MB', es: 'PNG o JPG, máximo 2MB' },
      primaryColor: { en: 'Primary Color', es: 'Color Principal' },
      accentColor: { en: 'Accent Color', es: 'Color de Acento' },
      preview: { en: 'Preview', es: 'Vista Previa' },
    },

    step3: {
      title: { en: 'Select your services', es: 'Selecciona tus servicios' },
      description: { en: 'Choose the services you offer to customers', es: 'Elige los servicios que ofreces a los clientes' },
    },

    step4: {
      title: { en: 'Choose Your Estimator Tools', es: 'Elige Tus Herramientas de Cotización' },
      description: { en: 'Select which trade estimators you need. Bundle and save!', es: 'Selecciona qué estimadores necesitas. ¡Agrupa y ahorra!' },
      perTrade: { en: '/trade/mo', es: '/oficio/mes' },
      bundle3Title: { en: 'Any 3 Trades', es: 'Cualquier 3 Oficios' },
      bundle3Subtitle: { en: 'Save $28/month', es: 'Ahorra $28/mes' },
      bundleAllTitle: { en: 'All 7 Trades', es: 'Los 7 Oficios' },
      bundleAllSubtitle: { en: 'Save $104/month', es: 'Ahorra $104/mes' },
      selectedCount: { en: 'trades selected', es: 'oficios seleccionados' },
      toolsTotal: { en: 'Estimator Tools Total', es: 'Total Herramientas' },
      continueToPlans: { en: 'Continue to Plans', es: 'Continuar a Planes' },
    },

    step5: {
      title: { en: 'Choose Your Platform', es: 'Elige Tu Plataforma' },
      description: { en: 'Add a professional website and CRM tools', es: 'Añade un sitio web profesional y herramientas CRM' },
      orderSummary: { en: 'Order Summary', es: 'Resumen del Pedido' },
      platform: { en: 'Platform', es: 'Plataforma' },
      estimatorTools: { en: 'Estimator Tools', es: 'Herramientas' },
      total: { en: 'Total', es: 'Total' },
      proceedToCheckout: { en: 'Proceed to Checkout', es: 'Proceder al Pago' },
      trialNote: { en: '14-day free trial, cancel anytime', es: 'Prueba gratis de 14 días, cancela cuando quieras' },
    },
  },

  // Platform tiers
  platformTiers: {
    free: {
      name: { en: 'Estimator Only', es: 'Solo Estimador' },
      subtitle: { en: 'Tools without website', es: 'Herramientas sin sitio web' },
      features: {
        en: ['Estimator tools only', 'Email support', 'Basic analytics'],
        es: ['Solo herramientas de cotización', 'Soporte por email', 'Analíticas básicas'],
      },
    },
    professional: {
      name: { en: 'Professional', es: 'Profesional' },
      subtitle: { en: 'Complete business solution', es: 'Solución empresarial completa' },
      features: {
        en: [
          'Custom branded website',
          'Online booking system',
          'Customer CRM',
          'Invoice & payments',
          'Priority support',
        ],
        es: [
          'Sitio web con tu marca',
          'Sistema de reservas en línea',
          'CRM de clientes',
          'Facturas y pagos',
          'Soporte prioritario',
        ],
      },
    },
    enterprise: {
      name: { en: 'Enterprise', es: 'Empresarial' },
      subtitle: { en: 'Multi-location powerhouse', es: 'Potencia para múltiples ubicaciones' },
      features: {
        en: [
          'Everything in Professional',
          'Multi-location support',
          'Crew management',
          'Advanced analytics',
          'API access',
          'Dedicated account manager',
        ],
        es: [
          'Todo lo de Profesional',
          'Soporte multi-ubicación',
          'Gestión de equipos',
          'Analíticas avanzadas',
          'Acceso a API',
          'Gerente de cuenta dedicado',
        ],
      },
    },
  },

  // Pricing
  pricing: {
    save: { en: 'Save', es: 'Ahorra' },
    mostPopular: { en: 'Most Popular', es: 'Más Popular' },
    bestValue: { en: 'Best Value', es: 'Mejor Valor' },
    startingAt: { en: 'Starting at', es: 'Desde' },
    customPricing: { en: 'Custom pricing', es: 'Precio personalizado' },
    contactSales: { en: 'Contact Sales', es: 'Contactar Ventas' },
    getStarted: { en: 'Get Started', es: 'Comenzar' },
    currentPlan: { en: 'Current Plan', es: 'Plan Actual' },
  },

  // Forms and validation
  validation: {
    required: { en: 'This field is required', es: 'Este campo es requerido' },
    invalidEmail: { en: 'Please enter a valid email', es: 'Por favor ingresa un email válido' },
    invalidPhone: { en: 'Please enter a valid phone number', es: 'Por favor ingresa un número de teléfono válido' },
    minLength: { en: 'Must be at least {min} characters', es: 'Debe tener al menos {min} caracteres' },
    maxLength: { en: 'Must be at most {max} characters', es: 'Debe tener como máximo {max} caracteres' },
  },

  // Dashboard
  dashboard: {
    welcome: { en: 'Welcome', es: 'Bienvenido' },
    overview: { en: 'Overview', es: 'Resumen' },
    leads: { en: 'Leads', es: 'Prospectos' },
    estimates: { en: 'Estimates', es: 'Cotizaciones' },
    jobs: { en: 'Jobs', es: 'Trabajos' },
    customers: { en: 'Customers', es: 'Clientes' },
    calendar: { en: 'Calendar', es: 'Calendario' },
    messages: { en: 'Messages', es: 'Mensajes' },
    settings: { en: 'Settings', es: 'Configuración' },
    crew: { en: 'Crew', es: 'Equipo' },
    reports: { en: 'Reports', es: 'Reportes' },
  },

  // Estimator
  estimator: {
    title: { en: 'Get Your Free Estimate', es: 'Obtén Tu Cotización Gratis' },
    subtitle: { en: 'Answer a few questions and get an instant quote', es: 'Responde unas preguntas y obtén una cotización instantánea' },
    squareFootage: { en: 'Square Footage', es: 'Pies Cuadrados' },
    roomCount: { en: 'Number of Rooms', es: 'Número de Habitaciones' },
    projectType: { en: 'Project Type', es: 'Tipo de Proyecto' },
    interior: { en: 'Interior', es: 'Interior' },
    exterior: { en: 'Exterior', es: 'Exterior' },
    both: { en: 'Both', es: 'Ambos' },
    residential: { en: 'Residential', es: 'Residencial' },
    commercial: { en: 'Commercial', es: 'Comercial' },
    estimatedCost: { en: 'Estimated Cost', es: 'Costo Estimado' },
    scheduleConsultation: { en: 'Schedule Consultation', es: 'Programar Consulta' },
    requestCallback: { en: 'Request Callback', es: 'Solicitar Llamada' },
  },

  // Booking
  booking: {
    title: { en: 'Book Your Appointment', es: 'Reserva Tu Cita' },
    selectDate: { en: 'Select Date', es: 'Seleccionar Fecha' },
    selectTime: { en: 'Select Time', es: 'Seleccionar Hora' },
    yourInfo: { en: 'Your Information', es: 'Tu Información' },
    confirmBooking: { en: 'Confirm Booking', es: 'Confirmar Reserva' },
    bookingConfirmed: { en: 'Booking Confirmed!', es: '¡Reserva Confirmada!' },
    confirmationSent: { en: 'Confirmation sent to your email', es: 'Confirmación enviada a tu correo' },
  },

  // Footer
  footer: {
    aboutUs: { en: 'About Us', es: 'Sobre Nosotros' },
    services: { en: 'Services', es: 'Servicios' },
    contact: { en: 'Contact', es: 'Contacto' },
    privacy: { en: 'Privacy Policy', es: 'Política de Privacidad' },
    terms: { en: 'Terms of Service', es: 'Términos de Servicio' },
    allRightsReserved: { en: 'All rights reserved', es: 'Todos los derechos reservados' },
  },

  // Notifications
  notifications: {
    newLead: { en: 'New lead received', es: 'Nuevo prospecto recibido' },
    bookingConfirmed: { en: 'Booking confirmed', es: 'Reserva confirmada' },
    paymentReceived: { en: 'Payment received', es: 'Pago recibido' },
    messageReceived: { en: 'New message', es: 'Nuevo mensaje' },
  },
} as const;

// Helper function to get translated text
export function t(
  key: string,
  language: Language,
  params?: Record<string, string | number>
): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }
  
  const text = value[language] || value.en || key;
  
  if (params && typeof text === 'string') {
    return Object.entries(params).reduce(
      (str, [param, val]) => str.replace(`{${param}}`, String(val)),
      text
    );
  }
  
  return text;
}

// Get array of translated features
export function getFeatures(
  tierKey: 'free' | 'professional' | 'enterprise',
  language: Language
): readonly string[] {
  return translations.platformTiers[tierKey].features[language];
}

// Get trade info
export function getTradeInfo(
  tradeKey: string,
  language: Language
): { name: string; description: string } {
  const trade = translations.trades[tradeKey as keyof typeof translations.trades];
  if (!trade) return { name: tradeKey, description: '' };
  return {
    name: trade.name[language],
    description: trade.description[language],
  };
}
