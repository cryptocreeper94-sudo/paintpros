import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

// Use the same localStorage key as the global i18n system
const LANGUAGE_STORAGE_KEY = "paintpros-language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Login
    "login.title": "Crew Lead Portal",
    "login.subtitle": "Enter your PIN to access your dashboard",
    "login.placeholder": "Enter 4-digit PIN",
    "login.button": "Access Dashboard",
    "login.error.invalid": "Invalid PIN",
    "login.error.failed": "Login failed. Please try again.",

    // Header
    "header.welcome": "Welcome",
    "header.subtitle": "Manage your crew, track time, and report job progress",
    
    // Tabs
    "tab.overview": "Overview",
    "tab.time": "Time",
    "tab.notes": "Notes",
    "tab.incidents": "Incidents",

    // Overview Cards
    "overview.myCrew": "My Crew",
    "overview.teamMembers": "Team members",
    "overview.active": "Active",
    "overview.hoursToday": "Hours Today",
    "overview.loggedHours": "Logged hours",
    "overview.today": "Today",
    "overview.timeEntries": "Time Entries",
    "overview.awaitingApproval": "Awaiting approval",
    "overview.pending": "Pending",
    "overview.incidents": "Incidents",
    "overview.openReports": "Open reports",
    "overview.actionNeeded": "Action Needed",

    // Crew Members
    "crew.title": "Crew Members",
    "crew.addMember": "Add Member",
    "crew.loading": "Loading...",
    "crew.noMembers": "No crew members yet",
    "crew.crewMember": "Crew Member",
    "crew.perHour": "/hr",

    // Quick Actions
    "quickActions.title": "Quick Actions",
    "quickActions.logTime": "Log Time",
    "quickActions.addNote": "Add Note",
    "quickActions.reportIncident": "Report Incident",
    "quickActions.takePhoto": "Take Photo",

    // Time Entries
    "time.logEntry": "Log Time Entry",
    "time.teamMember": "Team Member",
    "time.selectMember": "Select team member",
    "time.date": "Date",
    "time.hours": "Hours",
    "time.description": "Description",
    "time.workDescription": "Work description...",
    "time.saving": "Saving...",
    "time.submitButton": "Log Time Entry",
    "time.recentEntries": "Recent Entries",
    "time.noEntries": "No time entries yet",
    "time.unknown": "Unknown",
    "time.approved": "Approved",
    "time.submitted": "Submitted",
    "time.hoursLabel": "hours",

    // Job Notes
    "notes.addNote": "Add Job Note",
    "notes.jobAddress": "Job Address",
    "notes.enterAddress": "Enter job address...",
    "notes.noteType": "Note Type",
    "notes.selectType": "Select type",
    "notes.type.progress": "Progress",
    "notes.type.issue": "Issue",
    "notes.type.material": "Material",
    "notes.type.photo": "Photo",
    "notes.note": "Note",
    "notes.enterDetails": "Enter details about the job...",
    "notes.saving": "Saving...",
    "notes.submitButton": "Add Note",
    "notes.recentNotes": "Recent Notes",
    "notes.noNotes": "No job notes yet",

    // Incidents
    "incidents.title": "Report Incident",
    "incidents.type": "Incident Type",
    "incidents.selectType": "Select incident type",
    "incidents.type.injury": "Injury",
    "incidents.type.propertyDamage": "Property Damage",
    "incidents.type.equipmentFailure": "Equipment Failure",
    "incidents.type.weatherDelay": "Weather Delay",
    "incidents.type.other": "Other",
    "incidents.severity": "Severity",
    "incidents.selectSeverity": "Select severity",
    "incidents.severity.low": "Low",
    "incidents.severity.medium": "Medium",
    "incidents.severity.high": "High",
    "incidents.severity.critical": "Critical",
    "incidents.location": "Location",
    "incidents.enterLocation": "Enter incident location...",
    "incidents.description": "Description",
    "incidents.enterDescription": "Describe what happened...",
    "incidents.saving": "Saving...",
    "incidents.submitButton": "Submit Report",
    "incidents.recentReports": "Recent Reports",
    "incidents.noReports": "No incident reports",
    "incidents.open": "Open",
    "incidents.investigating": "Investigating",
    "incidents.resolved": "Resolved",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.submit": "Submit",
    "common.sent": "Sent",
    "common.crewLead": "Crew Lead",

    // Language Toggle
    "language.english": "English",
    "language.spanish": "Spanish",
    "language.toggle": "Language",
    "language.switchTo": "ES",
  },
  es: {
    // Login
    "login.title": "Portal de Jefe de Cuadrilla",
    "login.subtitle": "Ingrese su PIN para acceder a su panel",
    "login.placeholder": "Ingrese PIN de 4 digitos",
    "login.button": "Acceder al Panel",
    "login.error.invalid": "PIN invalido",
    "login.error.failed": "Error al iniciar sesion. Intente de nuevo.",

    // Header
    "header.welcome": "Bienvenido",
    "header.subtitle": "Administre su equipo, registre horas y reporte el progreso del trabajo",
    
    // Tabs
    "tab.overview": "Resumen",
    "tab.time": "Tiempo",
    "tab.notes": "Notas",
    "tab.incidents": "Incidentes",

    // Overview Cards
    "overview.myCrew": "Mi Equipo",
    "overview.teamMembers": "Miembros del equipo",
    "overview.active": "Activos",
    "overview.hoursToday": "Horas Hoy",
    "overview.loggedHours": "Horas registradas",
    "overview.today": "Hoy",
    "overview.timeEntries": "Registros de Tiempo",
    "overview.awaitingApproval": "Esperando aprobacion",
    "overview.pending": "Pendiente",
    "overview.incidents": "Incidentes",
    "overview.openReports": "Reportes abiertos",
    "overview.actionNeeded": "Accion Requerida",

    // Crew Members
    "crew.title": "Miembros del Equipo",
    "crew.addMember": "Agregar Miembro",
    "crew.loading": "Cargando...",
    "crew.noMembers": "No hay miembros del equipo todavia",
    "crew.crewMember": "Miembro del Equipo",
    "crew.perHour": "/hora",

    // Quick Actions
    "quickActions.title": "Acciones Rapidas",
    "quickActions.logTime": "Registrar Tiempo",
    "quickActions.addNote": "Agregar Nota",
    "quickActions.reportIncident": "Reportar Incidente",
    "quickActions.takePhoto": "Tomar Foto",

    // Time Entries
    "time.logEntry": "Registrar Entrada de Tiempo",
    "time.teamMember": "Miembro del Equipo",
    "time.selectMember": "Seleccionar miembro del equipo",
    "time.date": "Fecha",
    "time.hours": "Horas",
    "time.description": "Descripcion",
    "time.workDescription": "Descripcion del trabajo...",
    "time.saving": "Guardando...",
    "time.submitButton": "Registrar Tiempo",
    "time.recentEntries": "Entradas Recientes",
    "time.noEntries": "No hay registros de tiempo todavia",
    "time.unknown": "Desconocido",
    "time.approved": "Aprobado",
    "time.submitted": "Enviado",
    "time.hoursLabel": "horas",

    // Job Notes
    "notes.addNote": "Agregar Nota de Trabajo",
    "notes.jobAddress": "Direccion del Trabajo",
    "notes.enterAddress": "Ingrese la direccion del trabajo...",
    "notes.noteType": "Tipo de Nota",
    "notes.selectType": "Seleccionar tipo",
    "notes.type.progress": "Progreso",
    "notes.type.issue": "Problema",
    "notes.type.material": "Material",
    "notes.type.photo": "Foto",
    "notes.note": "Nota",
    "notes.enterDetails": "Ingrese detalles sobre el trabajo...",
    "notes.saving": "Guardando...",
    "notes.submitButton": "Agregar Nota",
    "notes.recentNotes": "Notas Recientes",
    "notes.noNotes": "No hay notas de trabajo todavia",

    // Incidents
    "incidents.title": "Reportar Incidente",
    "incidents.type": "Tipo de Incidente",
    "incidents.selectType": "Seleccionar tipo de incidente",
    "incidents.type.injury": "Lesion",
    "incidents.type.propertyDamage": "Dano a la Propiedad",
    "incidents.type.equipmentFailure": "Falla de Equipo",
    "incidents.type.weatherDelay": "Retraso por Clima",
    "incidents.type.other": "Otro",
    "incidents.severity": "Severidad",
    "incidents.selectSeverity": "Seleccionar severidad",
    "incidents.severity.low": "Baja",
    "incidents.severity.medium": "Media",
    "incidents.severity.high": "Alta",
    "incidents.severity.critical": "Critica",
    "incidents.location": "Ubicacion",
    "incidents.enterLocation": "Ingrese ubicacion del incidente...",
    "incidents.description": "Descripcion",
    "incidents.enterDescription": "Describa lo que sucedio...",
    "incidents.saving": "Guardando...",
    "incidents.submitButton": "Enviar Reporte",
    "incidents.recentReports": "Reportes Recientes",
    "incidents.noReports": "No hay reportes de incidentes",
    "incidents.open": "Abierto",
    "incidents.investigating": "Investigando",
    "incidents.resolved": "Resuelto",

    // Common
    "common.loading": "Cargando...",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.submit": "Enviar",
    "common.sent": "Enviado",
    "common.crewLead": "Jefe de Cuadrilla",

    // Language Toggle
    "language.english": "Ingles",
    "language.spanish": "Espanol",
    "language.toggle": "Idioma",
    "language.switchTo": "EN",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "en" || saved === "es") return saved;
    }
    return "en";
  });

  // Sync with global language system (poll for changes from navbar toggle)
  useEffect(() => {
    const checkLanguage = () => {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && (saved === "en" || saved === "es") && saved !== language) {
        setLanguageState(saved);
      }
    };
    
    const interval = setInterval(checkLanguage, 500);
    return () => clearInterval(interval);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  return useLanguage();
}
