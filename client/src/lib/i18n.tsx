import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.estimate': 'Get Estimate',
    'nav.book': 'Book Now',
    'nav.blog': 'Blog',
    'nav.toolkit': 'Trade Toolkit',
    'nav.login': 'Login',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.results': 'Results',
    'common.noResults': 'No results found',
    'common.language': 'Language',
    'common.english': 'English',
    'common.spanish': 'Español',
    
    // Calculator Common
    'calc.calculate': 'Calculate',
    'calc.reset': 'Reset',
    'calc.result': 'Result',
    'calc.total': 'Total',
    'calc.estimated': 'Estimated',
    'calc.materials': 'Materials',
    'calc.labor': 'Labor',
    'calc.cost': 'Cost',
    'calc.quantity': 'Quantity',
    'calc.unit': 'Unit',
    'calc.sqft': 'Square Feet',
    'calc.linearft': 'Linear Feet',
    'calc.gallons': 'Gallons',
    'calc.hours': 'Hours',
    'calc.days': 'Days',
    
    // Room Calculator
    'room.title': 'Room Calculator',
    'room.length': 'Length (ft)',
    'room.width': 'Width (ft)',
    'room.height': 'Ceiling Height (ft)',
    'room.floorSqft': 'Floor SF',
    'room.wallSqft': 'Wall SF',
    'room.totalSqft': 'Total SF',
    
    // Paint Calculator
    'paint.title': 'Paint Calculator',
    'paint.sqftToPaint': 'Square Feet to Paint',
    'paint.coats': 'Number of Coats',
    'paint.gallonsNeeded': 'Gallons Needed',
    'paint.coverage': 'Coverage Rate',
    'paint.dryTime': 'Dry Time',
    'paint.primer': 'Primer',
    'paint.finish': 'Finish Type',
    
    // Color Scanner
    'color.title': 'Color Match Scanner',
    'color.scan': 'Scan Color',
    'color.upload': 'Upload Photo',
    'color.matches': 'Paint Matches',
    'color.brand': 'Brand',
    'color.code': 'Color Code',
    'color.buyNow': 'Buy Now',
    
    // Electrical
    'electrical.title': 'Electrical Calculators',
    'electrical.wireSize': 'Wire Size Calculator',
    'electrical.amperage': 'Amperage',
    'electrical.voltage': 'Voltage',
    'electrical.distance': 'Distance (ft)',
    'electrical.circuitLoad': 'Circuit Load',
    'electrical.voltageDrop': 'Voltage Drop',
    'electrical.conduitFill': 'Conduit Fill',
    
    // Plumbing
    'plumbing.title': 'Plumbing Calculators',
    'plumbing.pipeSize': 'Pipe Sizing',
    'plumbing.waterPressure': 'Water Pressure',
    'plumbing.drainSlope': 'Drain Slope',
    'plumbing.fixtureUnits': 'Fixture Units',
    'plumbing.gpm': 'GPM (Gallons Per Minute)',
    'plumbing.psi': 'PSI',
    
    // HVAC
    'hvac.title': 'HVAC Calculators',
    'hvac.btuSizing': 'BTU Sizing',
    'hvac.ductSize': 'Duct Sizing',
    'hvac.airflow': 'Airflow (CFM)',
    'hvac.refrigerant': 'Refrigerant Charge',
    'hvac.loadCalc': 'Load Calculation',
    'hvac.tons': 'Tons',
    
    // Roofing
    'roofing.title': 'Roofing Calculators',
    'roofing.shingles': 'Shingle Count',
    'roofing.underlayment': 'Underlayment',
    'roofing.pitch': 'Roof Pitch',
    'roofing.squares': 'Squares',
    'roofing.flashing': 'Flashing',
    'roofing.ventilation': 'Ventilation',
    
    // Carpentry
    'carpentry.title': 'Carpentry Calculators',
    'carpentry.boardFeet': 'Board Feet',
    'carpentry.stairLayout': 'Stair Layout',
    'carpentry.joistSpacing': 'Joist Spacing',
    'carpentry.lumberWeight': 'Lumber Weight',
    'carpentry.riseRun': 'Rise & Run',
    
    // Concrete
    'concrete.title': 'Concrete Calculators',
    'concrete.volume': 'Volume Calculator',
    'concrete.rebar': 'Rebar Spacing',
    'concrete.mixRatio': 'Mix Ratios',
    'concrete.cureTime': 'Cure Time',
    'concrete.yards': 'Cubic Yards',
    'concrete.bags': 'Bags Needed',
    
    // Landscaping
    'landscape.title': 'Landscaping Calculators',
    'landscape.mulch': 'Mulch Volume',
    'landscape.soil': 'Soil Volume',
    'landscape.irrigation': 'Irrigation Zones',
    'landscape.plantSpacing': 'Plant Spacing',
    'landscape.sod': 'Sod Calculator',
    
    // Weather
    'weather.title': 'Weather Conditions',
    'weather.temperature': 'Temperature',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind Speed',
    'weather.conditions': 'Conditions',
    'weather.canPaint': 'OK to paint exterior',
    'weather.cantPaint': 'Not ideal for exterior painting',
    
    // AI Assistant
    'ai.title': 'AI Assistant',
    'ai.placeholder': 'Ask me anything about your project...',
    'ai.voiceInput': 'Voice Input',
    'ai.listening': 'Listening...',
    'ai.processing': 'Processing...',
    'ai.speakNow': 'Speak now',
    'ai.languageSelect': 'Assistant Language',
    
    // Estimate
    'estimate.title': 'Get Your Estimate',
    'estimate.projectType': 'Project Type',
    'estimate.interior': 'Interior',
    'estimate.exterior': 'Exterior',
    'estimate.rooms': 'Number of Rooms',
    'estimate.yourEstimate': 'Your Estimate',
    'estimate.requestQuote': 'Request Full Quote',
    
    // Booking
    'booking.title': 'Book Your Service',
    'booking.selectDate': 'Select Date',
    'booking.selectTime': 'Select Time',
    'booking.yourInfo': 'Your Information',
    'booking.name': 'Full Name',
    'booking.phone': 'Phone Number',
    'booking.email': 'Email Address',
    'booking.address': 'Service Address',
    'booking.confirm': 'Confirm Booking',
    
    // Trade Toolkit
    'toolkit.title': 'Trade Toolkit',
    'toolkit.subtitle': 'Professional calculators for every trade',
    'toolkit.allTrades': 'All Trades',
    'toolkit.favorites': 'Favorites',
    'toolkit.recent': 'Recently Used',
    'toolkit.pro': 'PRO',
    
    // Trades
    'trade.painting': 'Painting',
    'trade.electrical': 'Electrical',
    'trade.plumbing': 'Plumbing',
    'trade.hvac': 'HVAC',
    'trade.roofing': 'Roofing',
    'trade.carpentry': 'Carpentry',
    'trade.concrete': 'Concrete',
    'trade.landscaping': 'Landscaping',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.estimate': 'Cotización',
    'nav.book': 'Reservar',
    'nav.blog': 'Blog',
    'nav.toolkit': 'Herramientas',
    'nav.login': 'Iniciar Sesión',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.submit': 'Enviar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.results': 'Resultados',
    'common.noResults': 'No se encontraron resultados',
    'common.language': 'Idioma',
    'common.english': 'English',
    'common.spanish': 'Español',
    
    // Calculator Common
    'calc.calculate': 'Calcular',
    'calc.reset': 'Reiniciar',
    'calc.result': 'Resultado',
    'calc.total': 'Total',
    'calc.estimated': 'Estimado',
    'calc.materials': 'Materiales',
    'calc.labor': 'Mano de Obra',
    'calc.cost': 'Costo',
    'calc.quantity': 'Cantidad',
    'calc.unit': 'Unidad',
    'calc.sqft': 'Pies Cuadrados',
    'calc.linearft': 'Pies Lineales',
    'calc.gallons': 'Galones',
    'calc.hours': 'Horas',
    'calc.days': 'Días',
    
    // Room Calculator
    'room.title': 'Calculadora de Habitación',
    'room.length': 'Largo (pies)',
    'room.width': 'Ancho (pies)',
    'room.height': 'Altura del Techo (pies)',
    'room.floorSqft': 'Piso PC',
    'room.wallSqft': 'Pared PC',
    'room.totalSqft': 'Total PC',
    
    // Paint Calculator
    'paint.title': 'Calculadora de Pintura',
    'paint.sqftToPaint': 'Pies Cuadrados a Pintar',
    'paint.coats': 'Número de Capas',
    'paint.gallonsNeeded': 'Galones Necesarios',
    'paint.coverage': 'Tasa de Cobertura',
    'paint.dryTime': 'Tiempo de Secado',
    'paint.primer': 'Primer',
    'paint.finish': 'Tipo de Acabado',
    
    // Color Scanner
    'color.title': 'Escáner de Colores',
    'color.scan': 'Escanear Color',
    'color.upload': 'Subir Foto',
    'color.matches': 'Colores Similares',
    'color.brand': 'Marca',
    'color.code': 'Código de Color',
    'color.buyNow': 'Comprar Ahora',
    
    // Electrical
    'electrical.title': 'Calculadoras Eléctricas',
    'electrical.wireSize': 'Calibre de Cable',
    'electrical.amperage': 'Amperaje',
    'electrical.voltage': 'Voltaje',
    'electrical.distance': 'Distancia (pies)',
    'electrical.circuitLoad': 'Carga del Circuito',
    'electrical.voltageDrop': 'Caída de Voltaje',
    'electrical.conduitFill': 'Llenado de Conducto',
    
    // Plumbing
    'plumbing.title': 'Calculadoras de Plomería',
    'plumbing.pipeSize': 'Tamaño de Tubería',
    'plumbing.waterPressure': 'Presión de Agua',
    'plumbing.drainSlope': 'Pendiente de Drenaje',
    'plumbing.fixtureUnits': 'Unidades de Accesorio',
    'plumbing.gpm': 'GPM (Galones Por Minuto)',
    'plumbing.psi': 'PSI',
    
    // HVAC
    'hvac.title': 'Calculadoras de HVAC',
    'hvac.btuSizing': 'Dimensionamiento BTU',
    'hvac.ductSize': 'Tamaño de Ducto',
    'hvac.airflow': 'Flujo de Aire (CFM)',
    'hvac.refrigerant': 'Carga de Refrigerante',
    'hvac.loadCalc': 'Cálculo de Carga',
    'hvac.tons': 'Toneladas',
    
    // Roofing
    'roofing.title': 'Calculadoras de Techos',
    'roofing.shingles': 'Cantidad de Tejas',
    'roofing.underlayment': 'Membrana',
    'roofing.pitch': 'Pendiente del Techo',
    'roofing.squares': 'Cuadrados',
    'roofing.flashing': 'Tapajuntas',
    'roofing.ventilation': 'Ventilación',
    
    // Carpentry
    'carpentry.title': 'Calculadoras de Carpintería',
    'carpentry.boardFeet': 'Pies Tabla',
    'carpentry.stairLayout': 'Diseño de Escalera',
    'carpentry.joistSpacing': 'Espaciado de Vigas',
    'carpentry.lumberWeight': 'Peso de Madera',
    'carpentry.riseRun': 'Subida y Corrida',
    
    // Concrete
    'concrete.title': 'Calculadoras de Concreto',
    'concrete.volume': 'Calculadora de Volumen',
    'concrete.rebar': 'Espaciado de Varilla',
    'concrete.mixRatio': 'Proporciones de Mezcla',
    'concrete.cureTime': 'Tiempo de Curado',
    'concrete.yards': 'Yardas Cúbicas',
    'concrete.bags': 'Bolsas Necesarias',
    
    // Landscaping
    'landscape.title': 'Calculadoras de Jardinería',
    'landscape.mulch': 'Volumen de Mantillo',
    'landscape.soil': 'Volumen de Tierra',
    'landscape.irrigation': 'Zonas de Riego',
    'landscape.plantSpacing': 'Espaciado de Plantas',
    'landscape.sod': 'Calculadora de Césped',
    
    // Weather
    'weather.title': 'Condiciones del Clima',
    'weather.temperature': 'Temperatura',
    'weather.humidity': 'Humedad',
    'weather.wind': 'Velocidad del Viento',
    'weather.conditions': 'Condiciones',
    'weather.canPaint': 'OK para pintar exterior',
    'weather.cantPaint': 'No ideal para pintar exterior',
    
    // AI Assistant
    'ai.title': 'Asistente de IA',
    'ai.placeholder': 'Pregúntame sobre tu proyecto...',
    'ai.voiceInput': 'Entrada de Voz',
    'ai.listening': 'Escuchando...',
    'ai.processing': 'Procesando...',
    'ai.speakNow': 'Habla ahora',
    'ai.languageSelect': 'Idioma del Asistente',
    
    // Estimate
    'estimate.title': 'Obtén Tu Cotización',
    'estimate.projectType': 'Tipo de Proyecto',
    'estimate.interior': 'Interior',
    'estimate.exterior': 'Exterior',
    'estimate.rooms': 'Número de Habitaciones',
    'estimate.yourEstimate': 'Tu Cotización',
    'estimate.requestQuote': 'Solicitar Cotización Completa',
    
    // Booking
    'booking.title': 'Reserva Tu Servicio',
    'booking.selectDate': 'Selecciona Fecha',
    'booking.selectTime': 'Selecciona Hora',
    'booking.yourInfo': 'Tu Información',
    'booking.name': 'Nombre Completo',
    'booking.phone': 'Número de Teléfono',
    'booking.email': 'Correo Electrónico',
    'booking.address': 'Dirección del Servicio',
    'booking.confirm': 'Confirmar Reserva',
    
    // Trade Toolkit
    'toolkit.title': 'Caja de Herramientas',
    'toolkit.subtitle': 'Calculadoras profesionales para cada oficio',
    'toolkit.allTrades': 'Todos los Oficios',
    'toolkit.favorites': 'Favoritos',
    'toolkit.recent': 'Usados Recientemente',
    'toolkit.pro': 'PRO',
    
    // Trades
    'trade.painting': 'Pintura',
    'trade.electrical': 'Eléctrico',
    'trade.plumbing': 'Plomería',
    'trade.hvac': 'HVAC',
    'trade.roofing': 'Techos',
    'trade.carpentry': 'Carpintería',
    'trade.concrete': 'Concreto',
    'trade.landscaping': 'Jardinería',
  }
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('paintpros-language');
      if (saved === 'en' || saved === 'es') return saved;
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('es')) return 'es';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('paintpros-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}
