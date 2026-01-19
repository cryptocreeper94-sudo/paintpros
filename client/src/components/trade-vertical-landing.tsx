import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { 
  Eye, EyeOff, Settings, Phone, Mail, MapPin, Clock, Shield, Award,
  Calculator, Mic, Camera, Wrench, Star, CheckCircle2, ArrowRight,
  Zap, Users, Calendar, FileText, MessageSquare, BarChart3, Brain,
  Palette, Home, Building2, Sparkles, X, ChevronDown, ChevronUp
} from "lucide-react";
import type { TradeVertical } from "@/config/tenant";

interface TradeService {
  id: string;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
  icon: React.ReactNode;
  popular?: boolean;
}

interface TradeFeature {
  id: string;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
  icon: React.ReactNode;
  category: "frontend" | "backend" | "ai" | "integration";
}

interface TradeToolkitFeature {
  id: string;
  nameEn: string;
  nameEs: string;
  descEn: string;
  descEs: string;
}

interface TradeConfig {
  vertical: TradeVertical;
  nameEn: string;
  nameEs: string;
  taglineEn: string;
  taglineEs: string;
  primaryColor: string;
  accentColor: string;
  heroGradient: string;
  services: TradeService[];
  features: TradeFeature[];
  toolkitFeatures: TradeToolkitFeature[];
  demoStats: { label: string; value: string }[];
}

const TRADE_CONFIGS: Record<string, TradeConfig> = {
  roofing: {
    vertical: "roofing",
    nameEn: "RoofPros.io",
    nameEs: "RoofPros.io",
    taglineEn: "Professional Roofing Solutions",
    taglineEs: "Soluciones Profesionales de Techos",
    primaryColor: "#dc2626",
    accentColor: "#f59e0b",
    heroGradient: "from-red-900 via-red-800 to-orange-900",
    services: [
      { id: "roof-install", nameEn: "Roof Installation", nameEs: "Instalación de Techos", descEn: "Complete new roof installations", descEs: "Instalaciones completas de techos nuevos", icon: <Home className="w-6 h-6" />, popular: true },
      { id: "roof-repair", nameEn: "Roof Repair", nameEs: "Reparación de Techos", descEn: "Fix leaks and damage", descEs: "Reparar filtraciones y daños", icon: <Wrench className="w-6 h-6" /> },
      { id: "roof-inspect", nameEn: "Roof Inspection", nameEs: "Inspección de Techos", descEn: "Professional assessments", descEs: "Evaluaciones profesionales", icon: <Eye className="w-6 h-6" /> },
      { id: "shingle", nameEn: "Shingle Roofing", nameEs: "Techos de Tejas", descEn: "Asphalt & architectural shingles", descEs: "Tejas asfálticas y arquitectónicas", icon: <Building2 className="w-6 h-6" /> },
      { id: "metal", nameEn: "Metal Roofing", nameEs: "Techos de Metal", descEn: "Durable metal roof systems", descEs: "Sistemas de techos metálicos duraderos", icon: <Shield className="w-6 h-6" />, popular: true },
      { id: "flat", nameEn: "Flat Roofing", nameEs: "Techos Planos", descEn: "Commercial flat roof solutions", descEs: "Soluciones de techos planos comerciales", icon: <Building2 className="w-6 h-6" /> },
      { id: "gutter", nameEn: "Gutters & Drainage", nameEs: "Canaletas y Drenaje", descEn: "Complete gutter systems", descEs: "Sistemas completos de canaletas", icon: <Zap className="w-6 h-6" /> },
      { id: "storm", nameEn: "Storm Damage", nameEs: "Daños por Tormentas", descEn: "Emergency storm repairs", descEs: "Reparaciones de emergencia por tormentas", icon: <Zap className="w-6 h-6" /> },
    ],
    features: [
      { id: "online-booking", nameEn: "Online Booking", nameEs: "Reservas en Línea", descEn: "24/7 appointment scheduling", descEs: "Programación de citas 24/7", icon: <Calendar className="w-5 h-5" />, category: "frontend" },
      { id: "instant-quote", nameEn: "Instant Quotes", nameEs: "Cotizaciones Instantáneas", descEn: "AI-powered roof estimates", descEs: "Estimaciones de techo con IA", icon: <Calculator className="w-5 h-5" />, category: "ai" },
      { id: "drone-assess", nameEn: "Drone Assessment", nameEs: "Evaluación con Drones", descEn: "Aerial roof inspection photos", descEs: "Fotos de inspección aérea", icon: <Camera className="w-5 h-5" />, category: "integration" },
      { id: "crm", nameEn: "Customer CRM", nameEs: "CRM de Clientes", descEn: "Track leads & projects", descEs: "Seguimiento de prospectos y proyectos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "invoicing", nameEn: "Smart Invoicing", nameEs: "Facturación Inteligente", descEn: "Automated billing system", descEs: "Sistema de facturación automatizado", icon: <FileText className="w-5 h-5" />, category: "backend" },
      { id: "messaging", nameEn: "Team Messaging", nameEs: "Mensajería del Equipo", descEn: "Crew communication hub", descEs: "Centro de comunicación del equipo", icon: <MessageSquare className="w-5 h-5" />, category: "backend" },
    ],
    toolkitFeatures: [
      { id: "roof-calc", nameEn: "Roof Area Calculator", nameEs: "Calculadora de Área de Techo", descEn: "Calculate square footage from measurements", descEs: "Calcular pies cuadrados desde medidas" },
      { id: "pitch-calc", nameEn: "Pitch Calculator", nameEs: "Calculadora de Pendiente", descEn: "Determine roof pitch and slope", descEs: "Determinar pendiente e inclinación" },
      { id: "material-calc", nameEn: "Material Estimator", nameEs: "Estimador de Materiales", descEn: "Shingles, underlayment, flashing", descEs: "Tejas, membrana, tapajuntas" },
      { id: "labor-calc", nameEn: "Labor Calculator", nameEs: "Calculadora de Mano de Obra", descEn: "Crew hours and costs", descEs: "Horas y costos del equipo" },
      { id: "voice", nameEn: "Voice Assistant", nameEs: "Asistente de Voz", descEn: "Hands-free field calculations", descEs: "Cálculos de campo manos libres" },
    ],
    demoStats: [
      { label: "Projects Completed", value: "2,500+" },
      { label: "5-Star Reviews", value: "850+" },
      { label: "Years Experience", value: "15+" },
    ],
  },
  hvac: {
    vertical: "hvac",
    nameEn: "HVACPros.io",
    nameEs: "HVACPros.io",
    taglineEn: "Climate Control Experts",
    taglineEs: "Expertos en Control de Clima",
    primaryColor: "#0ea5e9",
    accentColor: "#f97316",
    heroGradient: "from-sky-900 via-blue-800 to-cyan-900",
    services: [
      { id: "ac-install", nameEn: "AC Installation", nameEs: "Instalación de AC", descEn: "Central & ductless systems", descEs: "Sistemas centrales y sin ductos", icon: <Zap className="w-6 h-6" />, popular: true },
      { id: "ac-repair", nameEn: "AC Repair", nameEs: "Reparación de AC", descEn: "Same-day cooling fixes", descEs: "Reparaciones de enfriamiento el mismo día", icon: <Wrench className="w-6 h-6" /> },
      { id: "heating", nameEn: "Heating Systems", nameEs: "Sistemas de Calefacción", descEn: "Furnace & heat pump install", descEs: "Instalación de hornos y bombas de calor", icon: <Zap className="w-6 h-6" />, popular: true },
      { id: "maintenance", nameEn: "Preventive Maintenance", nameEs: "Mantenimiento Preventivo", descEn: "Seasonal tune-ups", descEs: "Ajustes estacionales", icon: <Settings className="w-6 h-6" /> },
      { id: "ductwork", nameEn: "Ductwork", nameEs: "Conductos", descEn: "Design, install & repair", descEs: "Diseño, instalación y reparación", icon: <Building2 className="w-6 h-6" /> },
      { id: "indoor-air", nameEn: "Indoor Air Quality", nameEs: "Calidad del Aire Interior", descEn: "Purifiers & filtration", descEs: "Purificadores y filtración", icon: <Sparkles className="w-6 h-6" /> },
      { id: "thermostat", nameEn: "Smart Thermostats", nameEs: "Termostatos Inteligentes", descEn: "WiFi thermostat installation", descEs: "Instalación de termostatos WiFi", icon: <Brain className="w-6 h-6" /> },
      { id: "emergency", nameEn: "24/7 Emergency", nameEs: "Emergencias 24/7", descEn: "Round-the-clock service", descEs: "Servicio las 24 horas", icon: <Clock className="w-6 h-6" /> },
    ],
    features: [
      { id: "online-booking", nameEn: "Online Booking", nameEs: "Reservas en Línea", descEn: "Schedule service anytime", descEs: "Programar servicio en cualquier momento", icon: <Calendar className="w-5 h-5" />, category: "frontend" },
      { id: "load-calc", nameEn: "Load Calculator", nameEs: "Calculadora de Carga", descEn: "Proper system sizing", descEs: "Dimensionamiento correcto del sistema", icon: <Calculator className="w-5 h-5" />, category: "ai" },
      { id: "diagnostics", nameEn: "Remote Diagnostics", nameEs: "Diagnósticos Remotos", descEn: "Smart system monitoring", descEs: "Monitoreo inteligente del sistema", icon: <BarChart3 className="w-5 h-5" />, category: "integration" },
      { id: "crm", nameEn: "Service CRM", nameEs: "CRM de Servicios", descEn: "Customer & equipment tracking", descEs: "Seguimiento de clientes y equipos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "invoicing", nameEn: "Service Invoicing", nameEs: "Facturación de Servicios", descEn: "Parts & labor billing", descEs: "Facturación de piezas y mano de obra", icon: <FileText className="w-5 h-5" />, category: "backend" },
      { id: "dispatch", nameEn: "Tech Dispatch", nameEs: "Despacho de Técnicos", descEn: "Route optimization", descEs: "Optimización de rutas", icon: <MapPin className="w-5 h-5" />, category: "backend" },
    ],
    toolkitFeatures: [
      { id: "btu-calc", nameEn: "BTU Calculator", nameEs: "Calculadora de BTU", descEn: "Room cooling/heating needs", descEs: "Necesidades de enfriamiento/calefacción" },
      { id: "load-calc", nameEn: "Load Calculator", nameEs: "Calculadora de Carga", descEn: "Manual J calculations", descEs: "Cálculos Manual J" },
      { id: "duct-calc", nameEn: "Duct Sizing", nameEs: "Dimensionamiento de Ductos", descEn: "CFM and duct dimensions", descEs: "CFM y dimensiones de ductos" },
      { id: "refrigerant", nameEn: "Refrigerant Calculator", nameEs: "Calculadora de Refrigerante", descEn: "Charge calculations", descEs: "Cálculos de carga" },
      { id: "voice", nameEn: "Voice Assistant", nameEs: "Asistente de Voz", descEn: "Field calculations by voice", descEs: "Cálculos de campo por voz" },
    ],
    demoStats: [
      { label: "Systems Installed", value: "5,000+" },
      { label: "Happy Customers", value: "3,200+" },
      { label: "Service Calls/Year", value: "8,000+" },
    ],
  },
  electrical: {
    vertical: "electrical",
    nameEn: "ElectricPros.io",
    nameEs: "ElectricPros.io",
    taglineEn: "Power Your World Safely",
    taglineEs: "Energiza Tu Mundo con Seguridad",
    primaryColor: "#eab308",
    accentColor: "#3b82f6",
    heroGradient: "from-yellow-900 via-amber-800 to-orange-900",
    services: [
      { id: "panel", nameEn: "Panel Upgrades", nameEs: "Actualización de Paneles", descEn: "100A to 200A+ upgrades", descEs: "Actualizaciones de 100A a 200A+", icon: <Zap className="w-6 h-6" />, popular: true },
      { id: "rewiring", nameEn: "Whole Home Rewiring", nameEs: "Recableado Completo", descEn: "Complete electrical overhaul", descEs: "Revisión eléctrica completa", icon: <Home className="w-6 h-6" /> },
      { id: "ev-charger", nameEn: "EV Charger Install", nameEs: "Instalación de Cargador EV", descEn: "Level 2 home charging", descEs: "Carga doméstica Nivel 2", icon: <Zap className="w-6 h-6" />, popular: true },
      { id: "lighting", nameEn: "Lighting Design", nameEs: "Diseño de Iluminación", descEn: "Indoor & outdoor lighting", descEs: "Iluminación interior y exterior", icon: <Sparkles className="w-6 h-6" /> },
      { id: "outlets", nameEn: "Outlets & Switches", nameEs: "Tomacorrientes e Interruptores", descEn: "Installation & repair", descEs: "Instalación y reparación", icon: <Settings className="w-6 h-6" /> },
      { id: "generator", nameEn: "Generator Install", nameEs: "Instalación de Generadores", descEn: "Whole home backup power", descEs: "Energía de respaldo para toda la casa", icon: <Zap className="w-6 h-6" /> },
      { id: "commercial", nameEn: "Commercial Electric", nameEs: "Electricidad Comercial", descEn: "Business electrical services", descEs: "Servicios eléctricos comerciales", icon: <Building2 className="w-6 h-6" /> },
      { id: "safety", nameEn: "Safety Inspections", nameEs: "Inspecciones de Seguridad", descEn: "Code compliance checks", descEs: "Verificaciones de cumplimiento", icon: <Shield className="w-6 h-6" /> },
    ],
    features: [
      { id: "online-booking", nameEn: "Online Booking", nameEs: "Reservas en Línea", descEn: "Schedule electrical work", descEs: "Programar trabajo eléctrico", icon: <Calendar className="w-5 h-5" />, category: "frontend" },
      { id: "load-analysis", nameEn: "Load Analysis", nameEs: "Análisis de Carga", descEn: "Panel capacity planning", descEs: "Planificación de capacidad del panel", icon: <Calculator className="w-5 h-5" />, category: "ai" },
      { id: "permit-mgmt", nameEn: "Permit Management", nameEs: "Gestión de Permisos", descEn: "Track permits & inspections", descEs: "Seguimiento de permisos e inspecciones", icon: <FileText className="w-5 h-5" />, category: "backend" },
      { id: "crm", nameEn: "Customer Portal", nameEs: "Portal del Cliente", descEn: "Job history & documents", descEs: "Historial de trabajos y documentos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "invoicing", nameEn: "Project Billing", nameEs: "Facturación de Proyectos", descEn: "Material & labor invoicing", descEs: "Facturación de materiales y mano de obra", icon: <FileText className="w-5 h-5" />, category: "backend" },
      { id: "safety-docs", nameEn: "Safety Documentation", nameEs: "Documentación de Seguridad", descEn: "Digital compliance records", descEs: "Registros digitales de cumplimiento", icon: <Shield className="w-5 h-5" />, category: "integration" },
    ],
    toolkitFeatures: [
      { id: "wire-calc", nameEn: "Wire Size Calculator", nameEs: "Calculadora de Calibre de Cable", descEn: "AWG sizing for loads", descEs: "Dimensionamiento AWG para cargas" },
      { id: "voltage-drop", nameEn: "Voltage Drop Calculator", nameEs: "Calculadora de Caída de Voltaje", descEn: "Long run calculations", descEs: "Cálculos de tramos largos" },
      { id: "conduit", nameEn: "Conduit Fill Calculator", nameEs: "Calculadora de Llenado de Conductos", descEn: "NEC compliant sizing", descEs: "Dimensionamiento conforme a NEC" },
      { id: "breaker", nameEn: "Breaker Sizing", nameEs: "Dimensionamiento de Breakers", descEn: "Circuit protection sizing", descEs: "Dimensionamiento de protección de circuitos" },
      { id: "voice", nameEn: "Voice Assistant", nameEs: "Asistente de Voz", descEn: "NEC lookups by voice", descEs: "Consultas NEC por voz" },
    ],
    demoStats: [
      { label: "Panels Upgraded", value: "3,500+" },
      { label: "EV Chargers Installed", value: "1,200+" },
      { label: "Licensed Electricians", value: "25+" },
    ],
  },
  plumbing: {
    vertical: "plumbing",
    nameEn: "PlumbPros.io",
    nameEs: "PlumbPros.io",
    taglineEn: "Flow With Confidence",
    taglineEs: "Fluye con Confianza",
    primaryColor: "#2563eb",
    accentColor: "#10b981",
    heroGradient: "from-blue-900 via-blue-800 to-cyan-900",
    services: [
      { id: "drain", nameEn: "Drain Cleaning", nameEs: "Limpieza de Drenajes", descEn: "Clog removal & jetting", descEs: "Eliminación de obstrucciones y chorro", icon: <Zap className="w-6 h-6" />, popular: true },
      { id: "water-heater", nameEn: "Water Heaters", nameEs: "Calentadores de Agua", descEn: "Tank & tankless systems", descEs: "Sistemas de tanque y sin tanque", icon: <Zap className="w-6 h-6" />, popular: true },
      { id: "leak", nameEn: "Leak Detection", nameEs: "Detección de Fugas", descEn: "Find & fix hidden leaks", descEs: "Encontrar y reparar fugas ocultas", icon: <Eye className="w-6 h-6" /> },
      { id: "repipe", nameEn: "Whole Home Repipe", nameEs: "Retuberías Completas", descEn: "Copper & PEX repiping", descEs: "Retuberías de cobre y PEX", icon: <Home className="w-6 h-6" /> },
      { id: "fixture", nameEn: "Fixture Installation", nameEs: "Instalación de Accesorios", descEn: "Faucets, toilets, sinks", descEs: "Grifos, inodoros, lavabos", icon: <Settings className="w-6 h-6" /> },
      { id: "sewer", nameEn: "Sewer Line Service", nameEs: "Servicio de Alcantarillado", descEn: "Repair & replacement", descEs: "Reparación y reemplazo", icon: <Wrench className="w-6 h-6" /> },
      { id: "gas", nameEn: "Gas Line Services", nameEs: "Servicios de Gas", descEn: "Installation & repair", descEs: "Instalación y reparación", icon: <Zap className="w-6 h-6" /> },
      { id: "emergency", nameEn: "24/7 Emergency", nameEs: "Emergencias 24/7", descEn: "Round-the-clock plumbing", descEs: "Plomería las 24 horas", icon: <Clock className="w-6 h-6" /> },
    ],
    features: [
      { id: "online-booking", nameEn: "Online Booking", nameEs: "Reservas en Línea", descEn: "Book plumbing service", descEs: "Reservar servicio de plomería", icon: <Calendar className="w-5 h-5" />, category: "frontend" },
      { id: "camera-inspect", nameEn: "Camera Inspection", nameEs: "Inspección con Cámara", descEn: "Sewer line video", descEs: "Video de línea de alcantarillado", icon: <Camera className="w-5 h-5" />, category: "integration" },
      { id: "flat-rate", nameEn: "Flat Rate Pricing", nameEs: "Precios Fijos", descEn: "Upfront cost estimates", descEs: "Estimaciones de costo por adelantado", icon: <Calculator className="w-5 h-5" />, category: "ai" },
      { id: "crm", nameEn: "Service History", nameEs: "Historial de Servicios", descEn: "Complete job records", descEs: "Registros completos de trabajos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "inventory", nameEn: "Parts Inventory", nameEs: "Inventario de Piezas", descEn: "Truck stock management", descEs: "Gestión de inventario del camión", icon: <Wrench className="w-5 h-5" />, category: "backend" },
      { id: "dispatch", nameEn: "Smart Dispatch", nameEs: "Despacho Inteligente", descEn: "Optimize technician routes", descEs: "Optimizar rutas de técnicos", icon: <MapPin className="w-5 h-5" />, category: "backend" },
    ],
    toolkitFeatures: [
      { id: "pipe-calc", nameEn: "Pipe Sizing Calculator", nameEs: "Calculadora de Tuberías", descEn: "Flow rate & pressure", descEs: "Caudal y presión" },
      { id: "water-heater", nameEn: "Water Heater Sizing", nameEs: "Dimensionamiento de Calentadores", descEn: "GPM & BTU calculations", descEs: "Cálculos de GPM y BTU" },
      { id: "drain-slope", nameEn: "Drain Slope Calculator", nameEs: "Calculadora de Pendiente", descEn: "Proper drainage pitch", descEs: "Pendiente correcta de drenaje" },
      { id: "fixture-units", nameEn: "Fixture Unit Calculator", nameEs: "Calculadora de Unidades", descEn: "DFU calculations", descEs: "Cálculos de DFU" },
      { id: "voice", nameEn: "Voice Assistant", nameEs: "Asistente de Voz", descEn: "Code lookups by voice", descEs: "Consultas de código por voz" },
    ],
    demoStats: [
      { label: "Drains Cleared", value: "10,000+" },
      { label: "Water Heaters", value: "2,500+" },
      { label: "Emergency Calls", value: "5,000+/yr" },
    ],
  },
  landscaping: {
    vertical: "landscaping",
    nameEn: "LandscapePros.io",
    nameEs: "LandscapePros.io",
    taglineEn: "Transform Your Outdoor Space",
    taglineEs: "Transforma Tu Espacio Exterior",
    primaryColor: "#22c55e",
    accentColor: "#84cc16",
    heroGradient: "from-green-900 via-emerald-800 to-lime-900",
    services: [
      { id: "design", nameEn: "Landscape Design", nameEs: "Diseño de Jardines", descEn: "Custom outdoor plans", descEs: "Planes personalizados de exteriores", icon: <Palette className="w-6 h-6" />, popular: true },
      { id: "install", nameEn: "Landscape Installation", nameEs: "Instalación de Jardines", descEn: "Plants, trees & shrubs", descEs: "Plantas, árboles y arbustos", icon: <Sparkles className="w-6 h-6" /> },
      { id: "hardscape", nameEn: "Hardscaping", nameEs: "Hardscaping", descEn: "Patios, walkways, walls", descEs: "Patios, caminos, muros", icon: <Building2 className="w-6 h-6" />, popular: true },
      { id: "irrigation", nameEn: "Irrigation Systems", nameEs: "Sistemas de Riego", descEn: "Sprinkler install & repair", descEs: "Instalación y reparación de aspersores", icon: <Zap className="w-6 h-6" /> },
      { id: "lawn", nameEn: "Lawn Care", nameEs: "Cuidado del Césped", descEn: "Mowing, fertilizing, aeration", descEs: "Corte, fertilización, aireación", icon: <Sparkles className="w-6 h-6" /> },
      { id: "lighting", nameEn: "Outdoor Lighting", nameEs: "Iluminación Exterior", descEn: "Landscape & security lights", descEs: "Iluminación de jardines y seguridad", icon: <Sparkles className="w-6 h-6" /> },
      { id: "drainage", nameEn: "Drainage Solutions", nameEs: "Soluciones de Drenaje", descEn: "French drains & grading", descEs: "Drenajes franceses y nivelación", icon: <Zap className="w-6 h-6" /> },
      { id: "seasonal", nameEn: "Seasonal Cleanup", nameEs: "Limpieza Estacional", descEn: "Spring & fall services", descEs: "Servicios de primavera y otoño", icon: <Sparkles className="w-6 h-6" /> },
    ],
    features: [
      { id: "design-tool", nameEn: "3D Design Tool", nameEs: "Herramienta de Diseño 3D", descEn: "Visualize your landscape", descEs: "Visualiza tu jardín", icon: <Palette className="w-5 h-5" />, category: "frontend" },
      { id: "plant-db", nameEn: "Plant Database", nameEs: "Base de Datos de Plantas", descEn: "Species info & care", descEs: "Información y cuidado de especies", icon: <Sparkles className="w-5 h-5" />, category: "ai" },
      { id: "scheduling", nameEn: "Service Scheduling", nameEs: "Programación de Servicios", descEn: "Recurring maintenance", descEs: "Mantenimiento recurrente", icon: <Calendar className="w-5 h-5" />, category: "backend" },
      { id: "crm", nameEn: "Property Profiles", nameEs: "Perfiles de Propiedades", descEn: "Site history & photos", descEs: "Historial del sitio y fotos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "crew-mgmt", nameEn: "Crew Management", nameEs: "Gestión de Equipos", descEn: "Route & job assignment", descEs: "Asignación de rutas y trabajos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "weather", nameEn: "Weather Integration", nameEs: "Integración del Clima", descEn: "Smart scheduling", descEs: "Programación inteligente", icon: <Sparkles className="w-5 h-5" />, category: "integration" },
    ],
    toolkitFeatures: [
      { id: "mulch-calc", nameEn: "Mulch Calculator", nameEs: "Calculadora de Mantillo", descEn: "Cubic yards needed", descEs: "Yardas cúbicas necesarias" },
      { id: "sod-calc", nameEn: "Sod Calculator", nameEs: "Calculadora de Césped", descEn: "Square footage & rolls", descEs: "Pies cuadrados y rollos" },
      { id: "paver-calc", nameEn: "Paver Calculator", nameEs: "Calculadora de Adoquines", descEn: "Materials & patterns", descEs: "Materiales y patrones" },
      { id: "irrigation-calc", nameEn: "Irrigation Calculator", nameEs: "Calculadora de Riego", descEn: "Zone coverage & heads", descEs: "Cobertura de zonas y cabezales" },
      { id: "voice", nameEn: "Voice Assistant", nameEs: "Asistente de Voz", descEn: "Field estimates by voice", descEs: "Estimaciones de campo por voz" },
    ],
    demoStats: [
      { label: "Lawns Maintained", value: "1,500+" },
      { label: "Patios Installed", value: "800+" },
      { label: "Trees Planted", value: "5,000+" },
    ],
  },
  construction: {
    vertical: "construction",
    nameEn: "BuildPros.io",
    nameEs: "BuildPros.io",
    taglineEn: "Building Excellence",
    taglineEs: "Excelencia en Construcción",
    primaryColor: "#78716c",
    accentColor: "#f59e0b",
    heroGradient: "from-stone-900 via-zinc-800 to-neutral-900",
    services: [
      { id: "remodel", nameEn: "Home Remodeling", nameEs: "Remodelación del Hogar", descEn: "Kitchen, bath, whole home", descEs: "Cocina, baño, casa completa", icon: <Home className="w-6 h-6" />, popular: true },
      { id: "addition", nameEn: "Room Additions", nameEs: "Ampliaciones", descEn: "Expand your living space", descEs: "Amplía tu espacio", icon: <Building2 className="w-6 h-6" /> },
      { id: "new-build", nameEn: "New Construction", nameEs: "Construcción Nueva", descEn: "Custom home building", descEs: "Construcción de casas personalizadas", icon: <Building2 className="w-6 h-6" />, popular: true },
      { id: "commercial", nameEn: "Commercial Buildout", nameEs: "Construcción Comercial", descEn: "Office & retail spaces", descEs: "Espacios de oficina y comercio", icon: <Building2 className="w-6 h-6" /> },
      { id: "framing", nameEn: "Framing & Structure", nameEs: "Estructura y Armazón", descEn: "Structural carpentry", descEs: "Carpintería estructural", icon: <Wrench className="w-6 h-6" /> },
      { id: "finish", nameEn: "Finish Carpentry", nameEs: "Carpintería de Acabados", descEn: "Trim, molding, cabinets", descEs: "Molduras, gabinetes", icon: <Sparkles className="w-6 h-6" /> },
      { id: "concrete", nameEn: "Concrete Work", nameEs: "Trabajo de Concreto", descEn: "Foundations & flatwork", descEs: "Cimentaciones y losas", icon: <Building2 className="w-6 h-6" /> },
      { id: "permits", nameEn: "Permit Services", nameEs: "Servicios de Permisos", descEn: "We handle all permits", descEs: "Manejamos todos los permisos", icon: <FileText className="w-6 h-6" /> },
    ],
    features: [
      { id: "project-mgmt", nameEn: "Project Management", nameEs: "Gestión de Proyectos", descEn: "Timeline & milestone tracking", descEs: "Seguimiento de cronograma e hitos", icon: <BarChart3 className="w-5 h-5" />, category: "backend" },
      { id: "3d-render", nameEn: "3D Renderings", nameEs: "Renderizados 3D", descEn: "Visualize your project", descEs: "Visualiza tu proyecto", icon: <Palette className="w-5 h-5" />, category: "frontend" },
      { id: "bid-mgmt", nameEn: "Bid Management", nameEs: "Gestión de Ofertas", descEn: "Sub-contractor bidding", descEs: "Ofertas de subcontratistas", icon: <FileText className="w-5 h-5" />, category: "backend" },
      { id: "crm", nameEn: "Client Portal", nameEs: "Portal del Cliente", descEn: "Progress updates & docs", descEs: "Actualizaciones de progreso y documentos", icon: <Users className="w-5 h-5" />, category: "backend" },
      { id: "scheduling", nameEn: "Construction Schedule", nameEs: "Cronograma de Construcción", descEn: "Gantt charts & dependencies", descEs: "Gráficos Gantt y dependencias", icon: <Calendar className="w-5 h-5" />, category: "backend" },
      { id: "cost-tracking", nameEn: "Cost Tracking", nameEs: "Seguimiento de Costos", descEn: "Budget vs actual", descEs: "Presupuesto vs real", icon: <BarChart3 className="w-5 h-5" />, category: "backend" },
    ],
    toolkitFeatures: [
      { id: "concrete-calc", nameEn: "Concrete Calculator", nameEs: "Calculadora de Concreto", descEn: "Cubic yards for slabs & footings", descEs: "Yardas cúbicas para losas y zapatas" },
      { id: "lumber-calc", nameEn: "Lumber Calculator", nameEs: "Calculadora de Madera", descEn: "Board feet & framing", descEs: "Pies tabla y estructura" },
      { id: "stair-calc", nameEn: "Stair Calculator", nameEs: "Calculadora de Escaleras", descEn: "Rise, run & stringers", descEs: "Huella, contrahuella y largueros" },
      { id: "drywall-calc", nameEn: "Drywall Calculator", nameEs: "Calculadora de Drywall", descEn: "Sheets & mud needed", descEs: "Hojas y pasta necesarias" },
      { id: "voice", nameEn: "Voice Assistant", nameEs: "Asistente de Voz", descEn: "On-site calculations", descEs: "Cálculos en sitio" },
    ],
    demoStats: [
      { label: "Projects Completed", value: "500+" },
      { label: "Sq Ft Built", value: "2M+" },
      { label: "Satisfied Clients", value: "450+" },
    ],
  },
};

interface ConfigurableCardProps {
  id: string;
  visible: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  configMode: boolean;
}

function ConfigurableCard({ id, visible, onToggle, children, configMode }: ConfigurableCardProps) {
  if (!visible && !configMode) return null;
  
  return (
    <div className="relative">
      {configMode && (
        <div className="absolute -top-2 -right-2 z-20">
          <Button
            size="icon"
            variant={visible ? "default" : "outline"}
            className="h-8 w-8 rounded-full shadow-lg"
            onClick={() => onToggle(id)}
            data-testid={`toggle-card-${id}`}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>
      )}
      <div className={!visible && configMode ? "opacity-40 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}

interface TradeVerticalLandingProps {
  tradeId: string;
}

export function TradeVerticalLanding({ tradeId }: TradeVerticalLandingProps) {
  const { language, t } = useI18n();
  const [configMode, setConfigMode] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    services: true,
    features: true,
    toolkit: true,
    demo: true,
  });
  
  const config = TRADE_CONFIGS[tradeId];
  
  useEffect(() => {
    const saved = localStorage.getItem(`trade-config-${tradeId}`);
    if (saved) {
      setVisibleCards(JSON.parse(saved));
    } else {
      const defaults: Record<string, boolean> = {};
      config?.services.forEach(s => defaults[`service-${s.id}`] = true);
      config?.features.forEach(f => defaults[`feature-${f.id}`] = true);
      config?.toolkitFeatures.forEach(tf => defaults[`toolkit-${tf.id}`] = true);
      defaults['hero'] = true;
      defaults['stats'] = true;
      defaults['toolkit-promo'] = true;
      defaults['contact'] = true;
      defaults['cta'] = true;
      setVisibleCards(defaults);
    }
  }, [tradeId, config]);
  
  const toggleCard = (id: string) => {
    const updated = { ...visibleCards, [id]: !visibleCards[id] };
    setVisibleCards(updated);
    localStorage.setItem(`trade-config-${tradeId}`, JSON.stringify(updated));
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  if (!config) {
    return <div className="p-8 text-center">Trade configuration not found</div>;
  }
  
  const name = language === 'es' ? config.nameEs : config.nameEn;
  const tagline = language === 'es' ? config.taglineEs : config.taglineEs;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Config Mode Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setConfigMode(!configMode)}
          variant={configMode ? "default" : "outline"}
          className="shadow-lg gap-2"
          data-testid="toggle-config-mode"
        >
          <Settings className="w-4 h-4" />
          {configMode ? (language === 'es' ? 'Guardar' : 'Save') : (language === 'es' ? 'Configurar' : 'Configure')}
        </Button>
      </div>
      
      {/* Config Panel */}
      <AnimatePresence>
        {configMode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-80 bg-card border-l shadow-xl z-40 overflow-y-auto"
          >
            <div className="p-4 border-b sticky top-0 bg-card z-10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{language === 'es' ? 'Configuración del Sitio' : 'Site Configuration'}</h3>
                <Button size="icon" variant="ghost" onClick={() => setConfigMode(false)} data-testid="close-config">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'es' ? 'Muestra u oculta secciones' : 'Show or hide sections'}
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Services Section */}
              <div>
                <button 
                  onClick={() => toggleSection('services')} 
                  className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md"
                  data-testid="toggle-services-section"
                >
                  <span className="font-medium">{language === 'es' ? 'Servicios' : 'Services'}</span>
                  {expandedSections.services ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.services && (
                  <div className="space-y-2 mt-2 pl-2">
                    {config.services.map(service => (
                      <label key={service.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Switch
                          checked={visibleCards[`service-${service.id}`] ?? true}
                          onCheckedChange={() => toggleCard(`service-${service.id}`)}
                          data-testid={`switch-service-${service.id}`}
                        />
                        <span>{language === 'es' ? service.nameEs : service.nameEn}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Features Section */}
              <div>
                <button 
                  onClick={() => toggleSection('features')} 
                  className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md"
                  data-testid="toggle-features-section"
                >
                  <span className="font-medium">{language === 'es' ? 'Funcionalidades' : 'Features'}</span>
                  {expandedSections.features ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.features && (
                  <div className="space-y-2 mt-2 pl-2">
                    {config.features.map(feature => (
                      <label key={feature.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Switch
                          checked={visibleCards[`feature-${feature.id}`] ?? true}
                          onCheckedChange={() => toggleCard(`feature-${feature.id}`)}
                          data-testid={`switch-feature-${feature.id}`}
                        />
                        <span>{language === 'es' ? feature.nameEs : feature.nameEn}</span>
                        <Badge variant="outline" className="text-[10px] ml-auto">
                          {feature.category}
                        </Badge>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* TradeWorks Toolkit Section */}
              <div>
                <button 
                  onClick={() => toggleSection('toolkit')} 
                  className="flex items-center justify-between w-full p-2 hover:bg-muted rounded-md"
                  data-testid="toggle-toolkit-section"
                >
                  <span className="font-medium">TradeWorks AI</span>
                  {expandedSections.toolkit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections.toolkit && (
                  <div className="space-y-2 mt-2 pl-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Switch
                        checked={visibleCards['toolkit-promo'] ?? true}
                        onCheckedChange={() => toggleCard('toolkit-promo')}
                        data-testid="switch-toolkit-promo"
                      />
                      <span>{language === 'es' ? 'Mostrar Promoción' : 'Show Promotion'}</span>
                    </label>
                    {config.toolkitFeatures.map(tf => (
                      <label key={tf.id} className="flex items-center gap-2 text-sm cursor-pointer pl-4">
                        <Switch
                          checked={visibleCards[`toolkit-${tf.id}`] ?? true}
                          onCheckedChange={() => toggleCard(`toolkit-${tf.id}`)}
                          data-testid={`switch-toolkit-${tf.id}`}
                        />
                        <span>{language === 'es' ? tf.nameEs : tf.nameEn}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Other Elements */}
              <div className="border-t pt-4 space-y-2">
                <span className="text-sm font-medium">{language === 'es' ? 'Otros Elementos' : 'Other Elements'}</span>
                {['hero', 'stats', 'contact', 'cta'].map(item => (
                  <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Switch
                      checked={visibleCards[item] ?? true}
                      onCheckedChange={() => toggleCard(item)}
                      data-testid={`switch-${item}`}
                    />
                    <span className="capitalize">{item === 'cta' ? 'Call to Action' : item}</span>
                  </label>
                ))}
              </div>
              
              {/* Custom Config Notice */}
              <div className="border-t pt-4">
                <GlassCard className="p-4 bg-primary/5">
                  <h4 className="font-medium text-sm mb-2">
                    {language === 'es' ? 'Configuración Personalizada?' : 'Need Custom Configuration?'}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {language === 'es' 
                      ? 'Contacte a nuestro equipo de diseño web para personalizaciones avanzadas.'
                      : 'Contact our web design team for advanced customizations.'}
                  </p>
                  <Button variant="outline" size="sm" className="w-full gap-2" data-testid="contact-design-team">
                    <Mail className="w-4 h-4" />
                    {language === 'es' ? 'Contactar Equipo' : 'Contact Team'}
                  </Button>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <BentoGrid>
          {/* Hero Section */}
          <ConfigurableCard id="hero" visible={visibleCards['hero'] ?? true} onToggle={toggleCard} configMode={configMode}>
            <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
              <GlassCard className={`p-0 overflow-hidden bg-gradient-to-br ${config.heroGradient} min-h-[300px]`}>
                <div className="relative h-full p-6 md:p-10 flex flex-col justify-center">
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="relative z-10">
                    <Badge className="mb-4 bg-white/20 text-white border-0">
                      {language === 'es' ? 'Profesionales Certificados' : 'Certified Professionals'}
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{name}</h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-6">{tagline}</p>
                    <div className="flex flex-wrap gap-3">
                      <Button size="lg" className="bg-white text-black hover:bg-white/90 gap-2" data-testid="hero-get-estimate">
                        <Calculator className="w-5 h-5" />
                        {language === 'es' ? 'Cotización Gratis' : 'Free Estimate'}
                      </Button>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 gap-2" data-testid="hero-call-now">
                        <Phone className="w-5 h-5" />
                        {language === 'es' ? 'Llamar Ahora' : 'Call Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>
          </ConfigurableCard>
          
          {/* Stats Cards */}
          <ConfigurableCard id="stats" visible={visibleCards['stats'] ?? true} onToggle={toggleCard} configMode={configMode}>
            <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <div className="grid grid-cols-3 gap-2 md:gap-4 h-full">
                {config.demoStats.map((stat, i) => (
                  <GlassCard key={i} className="p-3 md:p-4 text-center" hoverEffect="subtle">
                    <div className="text-xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </GlassCard>
                ))}
              </div>
            </BentoItem>
          </ConfigurableCard>
          
          {/* Services Section */}
          {config.services.filter(s => visibleCards[`service-${s.id}`] ?? true).length > 0 && (
            <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <div className="mb-2">
                <h2 className="text-2xl font-bold">{language === 'es' ? 'Nuestros Servicios' : 'Our Services'}</h2>
              </div>
            </BentoItem>
          )}
          
          {config.services.map(service => (
            <ConfigurableCard 
              key={service.id} 
              id={`service-${service.id}`} 
              visible={visibleCards[`service-${service.id}`] ?? true} 
              onToggle={toggleCard} 
              configMode={configMode}
            >
              <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
                <GlassCard className="p-4 h-full" hoverEffect="lift" glow={service.popular ? "accent" : false}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {language === 'es' ? service.nameEs : service.nameEn}
                        </h3>
                        {service.popular && (
                          <Badge variant="secondary" className="text-[10px]">
                            <Star className="w-3 h-3 mr-1" />
                            {language === 'es' ? 'Popular' : 'Popular'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {language === 'es' ? service.descEs : service.descEn}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </BentoItem>
            </ConfigurableCard>
          ))}
          
          {/* TradeWorks AI Toolkit Promo */}
          <ConfigurableCard id="toolkit-promo" visible={visibleCards['toolkit-promo'] ?? true} onToggle={toggleCard} configMode={configMode}>
            <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
              <GlassCard className="p-0 overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900" glow="gold">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-8 h-8 text-yellow-400" />
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                      {language === 'es' ? 'Complemento Opcional' : 'Optional Add-On'}
                    </Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    TradeWorks AI
                  </h2>
                  <p className="text-white/80 mb-6 max-w-2xl">
                    {language === 'es'
                      ? `Añade herramientas de cálculo profesionales específicas para ${config.nameEs.replace('.io', '')} a tu sitio web. Calculadoras con IA, asistente de voz, y más.`
                      : `Add professional ${config.nameEn.replace('.io', '')} calculation tools to your website. AI-powered calculators, voice assistant, and more.`}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {config.toolkitFeatures.filter(tf => visibleCards[`toolkit-${tf.id}`] ?? true).map(tf => (
                      <div key={tf.id} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Calculator className="w-4 h-4 text-yellow-400" />
                          <span className="font-medium text-white text-sm">
                            {language === 'es' ? tf.nameEs : tf.nameEn}
                          </span>
                        </div>
                        <p className="text-xs text-white/70">
                          {language === 'es' ? tf.descEs : tf.descEn}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-black gap-2" data-testid="add-tradeworks">
                      <Zap className="w-4 h-4" />
                      {language === 'es' ? 'Añadir a Mi Sitio' : 'Add to My Site'}
                    </Button>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <Mic className="w-4 h-4" />
                        {language === 'es' ? 'Asistente de Voz' : 'Voice Assistant'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        {language === 'es' ? 'Análisis de Fotos' : 'Photo Analysis'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>
          </ConfigurableCard>
          
          {/* Platform Features Section */}
          {config.features.filter(f => visibleCards[`feature-${f.id}`] ?? true).length > 0 && (
            <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <div className="mb-2">
                <h2 className="text-2xl font-bold">{language === 'es' ? 'Funcionalidades de la Plataforma' : 'Platform Features'}</h2>
                <p className="text-muted-foreground">{language === 'es' ? 'Todo lo que necesitas para administrar tu negocio' : 'Everything you need to run your business'}</p>
              </div>
            </BentoItem>
          )}
          
          {['frontend', 'backend', 'ai', 'integration'].map(category => {
            const categoryFeatures = config.features.filter(f => f.category === category && (visibleCards[`feature-${f.id}`] ?? true));
            if (categoryFeatures.length === 0) return null;
            
            const categoryLabels: Record<string, { en: string; es: string }> = {
              frontend: { en: 'Customer-Facing', es: 'Para Clientes' },
              backend: { en: 'Business Operations', es: 'Operaciones' },
              ai: { en: 'AI-Powered', es: 'Con IA' },
              integration: { en: 'Integrations', es: 'Integraciones' },
            };
            
            return (
              <BentoItem key={category} colSpan={6} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
                <GlassCard className="p-4 h-full">
                  <Badge variant="outline" className="mb-3">
                    {language === 'es' ? categoryLabels[category].es : categoryLabels[category].en}
                  </Badge>
                  <div className="space-y-3">
                    {categoryFeatures.map(feature => (
                      <div key={feature.id} className="flex items-start gap-3">
                        <div className="p-1.5 rounded bg-primary/10 text-primary">
                          {feature.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {language === 'es' ? feature.nameEs : feature.nameEn}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {language === 'es' ? feature.descEs : feature.descEn}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </BentoItem>
            );
          })}
          
          {/* Contact Section */}
          <ConfigurableCard id="contact" visible={visibleCards['contact'] ?? true} onToggle={toggleCard} configMode={configMode}>
            <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <GlassCard className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4">{language === 'es' ? 'Información de Contacto' : 'Contact Information'}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>info@{tradeId}.io</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{language === 'es' ? 'Servicio Nacional' : 'Nationwide Service'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{language === 'es' ? 'Lun-Vie: 7am-6pm' : 'Mon-Fri: 7am-6pm'}</span>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>
          </ConfigurableCard>
          
          {/* CTA Section */}
          <ConfigurableCard id="cta" visible={visibleCards['cta'] ?? true} onToggle={toggleCard} configMode={configMode}>
            <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <GlassCard className="p-6 h-full bg-primary/5">
                <h3 className="text-xl font-bold mb-2">{language === 'es' ? 'Listo para Empezar?' : 'Ready to Get Started?'}</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {language === 'es' 
                    ? 'Obtenga una cotización gratuita hoy. Sin compromiso, sin presión.'
                    : 'Get a free estimate today. No obligation, no pressure.'}
                </p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full gap-2" data-testid="cta-schedule">
                    <Calendar className="w-4 h-4" />
                    {language === 'es' ? 'Programar Consulta' : 'Schedule Consultation'}
                  </Button>
                  <Button variant="outline" className="w-full gap-2" data-testid="cta-call">
                    <Phone className="w-4 h-4" />
                    {language === 'es' ? 'Llamar Ahora' : 'Call Now'}
                  </Button>
                </div>
              </GlassCard>
            </BentoItem>
          </ConfigurableCard>
          
          {/* Credentials */}
          <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Shield className="w-4 h-4" />
                {language === 'es' ? 'Licenciado' : 'Licensed'}
              </Badge>
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Shield className="w-4 h-4" />
                {language === 'es' ? 'Asegurado' : 'Insured'}
              </Badge>
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Award className="w-4 h-4" />
                {language === 'es' ? 'Garantizado' : 'Bonded'}
              </Badge>
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Star className="w-4 h-4" />
                {language === 'es' ? '5 Estrellas' : '5-Star Rated'}
              </Badge>
            </div>
          </BentoItem>
        </BentoGrid>
      </div>
    </div>
  );
}
