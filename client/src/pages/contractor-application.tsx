import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Send, CheckCircle, Users, Clock, Award, Phone, Mail, Building2, Calendar, Camera, X, Upload, Image } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { toast } from "sonner";

type Language = "en" | "es";

const translations = {
  en: {
    title: "Contractor Application",
    subtitle: "Join Our Team of Painting Professionals",
    description: "Interested in bringing your painting crew to work with us? Fill out this application and our team will review your qualifications.",
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone Number",
    companyInfo: "Company Information",
    companyName: "Company Name (if applicable)",
    yearsExperience: "Years of Painting Experience",
    crewSize: "Number of Crew Members",
    availability: "Availability & Schedule",
    availableStart: "Available Start Date",
    weeklyHours: "Weekly Hours Available",
    preferredSchedule: "Preferred Work Schedule",
    fullTime: "Full-time",
    partTime: "Part-time",
    weekends: "Weekends Only",
    flexible: "Flexible",
    experience: "Experience & Qualifications",
    workHistory: "Work History (Previous painting jobs, employers, projects)",
    certifications: "Certifications & Licenses",
    specialties: "Specialties (Interior, Exterior, Commercial, Residential, etc.)",
    equipment: "Do you have your own equipment and transportation?",
    yes: "Yes",
    no: "No",
    references: "References",
    referencesPlaceholder: "Please provide 2-3 professional references with contact information",
    additionalInfo: "Additional Information",
    whyJoin: "Why do you want to join our team?",
    submit: "Submit Application",
    submitting: "Submitting...",
    success: "Application Submitted!",
    successMessage: "Thank you for your application. Our team will review it and contact you within 3-5 business days.",
    required: "Required field",
    english: "English",
    spanish: "Spanish",
    portfolio: "Work Portfolio",
    portfolioDescription: "Upload 4-5 photos of your best work. Show us examples that match your specialty - trim carpenters should show trim work, painters should show completed paint jobs.",
    portfolioHint: "Photos help us understand your skill level and craftsmanship",
    uploadPhotos: "Upload Photos",
    dragDrop: "Drag & drop or click to upload",
    maxPhotos: "Upload up to 5 photos (JPG, PNG)",
    photoCount: "photos uploaded",
  },
  es: {
    title: "Solicitud de Contratista",
    subtitle: "Únete a Nuestro Equipo de Profesionales de Pintura",
    description: "¿Interesado en traer tu equipo de pintura para trabajar con nosotros? Completa esta solicitud y nuestro equipo revisará tus calificaciones.",
    personalInfo: "Información Personal",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    phone: "Número de Teléfono",
    companyInfo: "Información de la Empresa",
    companyName: "Nombre de la Empresa (si aplica)",
    yearsExperience: "Años de Experiencia en Pintura",
    crewSize: "Número de Miembros del Equipo",
    availability: "Disponibilidad y Horario",
    availableStart: "Fecha de Inicio Disponible",
    weeklyHours: "Horas Semanales Disponibles",
    preferredSchedule: "Horario de Trabajo Preferido",
    fullTime: "Tiempo completo",
    partTime: "Medio tiempo",
    weekends: "Solo fines de semana",
    flexible: "Flexible",
    experience: "Experiencia y Calificaciones",
    workHistory: "Historial de Trabajo (Trabajos anteriores de pintura, empleadores, proyectos)",
    certifications: "Certificaciones y Licencias",
    specialties: "Especialidades (Interior, Exterior, Comercial, Residencial, etc.)",
    equipment: "¿Tienes tu propio equipo y transporte?",
    yes: "Sí",
    no: "No",
    references: "Referencias",
    referencesPlaceholder: "Proporciona 2-3 referencias profesionales con información de contacto",
    additionalInfo: "Información Adicional",
    whyJoin: "¿Por qué quieres unirte a nuestro equipo?",
    submit: "Enviar Solicitud",
    submitting: "Enviando...",
    success: "¡Solicitud Enviada!",
    successMessage: "Gracias por tu solicitud. Nuestro equipo la revisará y te contactará dentro de 3-5 días hábiles.",
    required: "Campo requerido",
    english: "Inglés",
    spanish: "Español",
    portfolio: "Portafolio de Trabajo",
    portfolioDescription: "Sube 4-5 fotos de tu mejor trabajo. Muéstranos ejemplos que coincidan con tu especialidad - los carpinteros de molduras deben mostrar trabajo de molduras, los pintores deben mostrar trabajos de pintura completados.",
    portfolioHint: "Las fotos nos ayudan a entender tu nivel de habilidad y artesanía",
    uploadPhotos: "Subir Fotos",
    dragDrop: "Arrastra y suelta o haz clic para subir",
    maxPhotos: "Sube hasta 5 fotos (JPG, PNG)",
    photoCount: "fotos subidas",
  },
};

interface PortfolioImage {
  file: File;
  preview: string;
  name: string;
}

export default function ContractorApplication() {
  const tenant = useTenant();
  const [language, setLanguage] = useState<Language>("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasEquipment, setHasEquipment] = useState<boolean | null>(null);
  const [schedule, setSchedule] = useState("");
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);

  const t = translations[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const remainingSlots = 5 - portfolioImages.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    
    const imageErrorMsg = language === "es" ? "Por favor sube solo archivos de imagen" : "Please upload only image files";
    filesToAdd.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(imageErrorMsg);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortfolioImages((prev) => {
          if (prev.length >= 5) return prev;
          return [...prev, {
            file,
            preview: reader.result as string,
            name: file.name,
          }];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      companyName: formData.get("companyName"),
      yearsExperience: formData.get("yearsExperience"),
      crewSize: formData.get("crewSize"),
      availableStart: formData.get("availableStart"),
      weeklyHours: formData.get("weeklyHours"),
      preferredSchedule: schedule,
      workHistory: formData.get("workHistory"),
      certifications: formData.get("certifications"),
      specialties: formData.get("specialties"),
      hasEquipment,
      references: formData.get("references"),
      whyJoin: formData.get("whyJoin"),
      language,
      submittedAt: new Date().toISOString(),
      portfolioImages: portfolioImages.map((img) => ({
        name: img.name,
        data: img.preview,
      })),
    };

    try {
      const response = await fetch("/api/contractor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success(t.success);
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <PageLayout>
        <main className="min-h-screen bg-background pt-20 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <GlassCard className="p-8" glow="green">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">{t.success}</h2>
                <p className="text-muted-foreground">{t.successMessage}</p>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="min-h-screen bg-background pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold">{t.title}</h1>
                  <p className="text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex bg-muted rounded-full p-0.5">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    language === "en"
                      ? "bg-accent text-white"
                      : "text-muted-foreground"
                  }`}
                  data-testid="button-lang-en"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                    language === "es"
                      ? "bg-accent text-white"
                      : "text-muted-foreground"
                  }`}
                  data-testid="button-lang-es"
                >
                  ES
                </button>
              </div>
            </div>
            <p className="text-muted-foreground">{t.description}</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassCard className="p-6" glow="accent">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">{t.personalInfo}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.firstName} *</label>
                  <Input name="firstName" required data-testid="input-first-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.lastName} *</label>
                  <Input name="lastName" required data-testid="input-last-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {t.email} *
                  </label>
                  <Input name="email" type="email" required data-testid="input-email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {t.phone} *
                  </label>
                  <Input name="phone" type="tel" required data-testid="input-phone" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="blue">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold">{t.companyInfo}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">{t.companyName}</label>
                  <Input name="companyName" data-testid="input-company-name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.yearsExperience} *</label>
                  <Input name="yearsExperience" type="number" min="0" required data-testid="input-years-experience" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.crewSize} *</label>
                  <Input name="crewSize" type="number" min="1" required data-testid="input-crew-size" />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="green">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-bold">{t.availability}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.availableStart} *</label>
                  <Input name="availableStart" type="date" required data-testid="input-available-start" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.weeklyHours} *</label>
                  <Input name="weeklyHours" type="number" min="1" max="60" required data-testid="input-weekly-hours" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">{t.preferredSchedule} *</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "full-time", label: t.fullTime },
                      { value: "part-time", label: t.partTime },
                      { value: "weekends", label: t.weekends },
                      { value: "flexible", label: t.flexible },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSchedule(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          schedule === option.value
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        data-testid={`button-schedule-${option.value}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="purple">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold">{t.experience}</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t.workHistory} *</label>
                  <Textarea 
                    name="workHistory" 
                    rows={4} 
                    required 
                    className="resize-none"
                    data-testid="textarea-work-history"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.certifications}</label>
                  <Textarea 
                    name="certifications" 
                    rows={2} 
                    className="resize-none"
                    data-testid="textarea-certifications"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t.specialties} *</label>
                  <Input name="specialties" required data-testid="input-specialties" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.equipment} *</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setHasEquipment(true)}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        hasEquipment === true
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid="button-equipment-yes"
                    >
                      {t.yes}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasEquipment(false)}
                      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                        hasEquipment === false
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid="button-equipment-no"
                    >
                      {t.no}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Portfolio Upload Section */}
            <GlassCard className="p-6" glow="accent">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">{t.portfolio}</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {t.portfolioDescription}
              </p>
              <p className="text-xs text-muted-foreground/70 mb-4 italic">
                {t.portfolioHint}
              </p>
              
              {/* Upload Area */}
              <div className="mb-4">
                <label 
                  htmlFor="portfolio-upload"
                  className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    portfolioImages.length >= 5 
                      ? "border-muted bg-muted/20 cursor-not-allowed" 
                      : "border-accent/50 hover:border-accent hover:bg-accent/5"
                  }`}
                  data-testid="label-portfolio-upload"
                >
                  <Upload className={`w-8 h-8 mb-2 ${portfolioImages.length >= 5 ? "text-muted-foreground" : "text-accent"}`} />
                  <span className={`text-sm font-medium ${portfolioImages.length >= 5 ? "text-muted-foreground" : ""}`}>
                    {t.dragDrop}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {t.maxPhotos}
                  </span>
                  <input
                    id="portfolio-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={portfolioImages.length >= 5}
                    data-testid="input-portfolio-upload"
                  />
                </label>
              </div>

              {/* Image Previews */}
              {portfolioImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Image className="w-4 h-4 text-accent" />
                      {portfolioImages.length} {t.photoCount}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {portfolioImages.map((img, index) => (
                      <div key={index} className="relative group" data-testid={`portfolio-image-${index}`}>
                        <img
                          src={img.preview}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-image-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{img.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            <GlassCard className="p-6" glow="gold">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gold-400" />
                <h2 className="text-lg font-bold">{t.references}</h2>
              </div>
              <Textarea 
                name="references" 
                rows={4} 
                placeholder={t.referencesPlaceholder}
                required
                className="resize-none"
                data-testid="textarea-references"
              />
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">{t.additionalInfo}</h2>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.whyJoin}</label>
                <Textarea 
                  name="whyJoin" 
                  rows={3} 
                  className="resize-none"
                  data-testid="textarea-why-join"
                />
              </div>
            </GlassCard>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting || !schedule || hasEquipment === null}
              data-testid="button-submit-application"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">...</span>
                  {t.submitting}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t.submit}
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
    </PageLayout>
  );
}
