export const pricingPlans = [
    {
      id: 'starter',
      title: "Nexus Starter",
      price: "150",
      description: "Ideal para negocios locales que inician su transformación digital.",
      features: [
        "1 Sede / Local único",
        "Gestión de Reservas y Ventas",
        "Registro de Clientes (CRM básico)",
        "Reporte mensual de Ingresos/Egresos",
        "Soporte por WhatsApp (Horario de oficina)",
        "Acceso desde Celular y PC"
      ],
      featured: false,
      buttonText: "Empezar con Starter"
    },
    {
      id: 'pro',
      title: "Nexus Pro",
      price: "250",
      description: "Potencia total para empresas en crecimiento con múltiples sedes.",
      features: [
            "Hasta 3 Sedes / Sucursales",
            "Multiusuario (Admin, Recepcionista, Operador)",
            "Alertas de recordatorio (vía sistema)",
            "Dashboard en tiempo real con estadísticas",
            "Gestión de Inventario y Stock",
            "Soporte técnico prioritario",
            "Exportación de datos a Excel/PDF"
      ],
      featured: true, // Este resaltará en la interfaz
      buttonText: "Obtener Nexus Pro"
    },
    {
      id: 'custom',
      title: "Nexus Enterprise",
      price: "Custom",
      description: "Soluciones a medida para corporaciones y grandes infraestructuras.",
      features: [
        "Módulo personalizado según necesidad",
        "Capacitación presencial al personal",
        "Consultoría de procesos"
      ],
      featured: false,
      buttonText: "Contactar Ventas"
    }
  ];