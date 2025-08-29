import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  Timestamp,
  getDocs,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { Trade } from '../types';

// Sample data for seeding
const sampleWorkers = [
  {
    email: 'juan.martinez@example.com',
    password: 'Test123!',
    displayName: 'Juan Martínez',
    phone: '55-1234-5678',
    profile: {
      name: 'Juan Martínez',
      trade: Trade.COOK,
      secondaryTrades: [Trade.WAITER],
      experience: 5,
      location: 'Santa Fe, Álvaro Obregón',
      bio: 'Cocinero profesional con experiencia en cocina mexicana e internacional. Especialidad en parrilla y mariscos.',
      certifications: [
        {
          id: '1',
          name: 'Manejo Higiénico de Alimentos',
          type: 'food_handling',
          issuer: 'COFEPRIS',
          issueDate: new Date('2023-01-15'),
          verified: true
        }
      ],
      rating: 4.8,
      totalRatings: 12,
      available: true,
      skills: ['Cocina Mexicana', 'Parrilla', 'Mariscos', 'Repostería'],
      preferredAreas: ['Santa Fe', 'San Ángel', 'Coyoacán']
    }
  },
  {
    email: 'maria.gonzalez@example.com',
    password: 'Test123!',
    displayName: 'María González',
    phone: '55-2345-6789',
    profile: {
      name: 'María González',
      trade: Trade.BARTENDER,
      experience: 3,
      location: 'San Ángel, Álvaro Obregón',
      bio: 'Bartender creativa con certificación en mixología. Experta en coctelería clásica y molecular.',
      certifications: [
        {
          id: '2',
          name: 'Certificación en Mixología',
          type: 'bartending',
          issuer: 'Asociación Mexicana de Bartenders',
          issueDate: new Date('2022-06-20'),
          verified: true
        }
      ],
      rating: 4.9,
      totalRatings: 8,
      available: true,
      skills: ['Mixología', 'Coctelería Clásica', 'Flair Bartending', 'Servicio al Cliente'],
      preferredAreas: ['San Ángel', 'Coyoacán', 'Del Valle']
    }
  },
  {
    email: 'carlos.rodriguez@example.com',
    password: 'Test123!',
    displayName: 'Carlos Rodríguez',
    phone: '55-3456-7890',
    profile: {
      name: 'Carlos Rodríguez',
      trade: Trade.SECURITY,
      secondaryTrades: [Trade.DRIVER],
      experience: 8,
      location: 'Observatorio, Álvaro Obregón',
      bio: 'Guardia de seguridad certificado con experiencia en eventos masivos y seguridad corporativa.',
      certifications: [
        {
          id: '3',
          name: 'Certificación en Seguridad Privada',
          type: 'security',
          issuer: 'SSP CDMX',
          issueDate: new Date('2021-03-10'),
          expiryDate: new Date('2024-03-10'),
          verified: true
        }
      ],
      rating: 4.7,
      totalRatings: 15,
      available: true,
      skills: ['Seguridad Corporativa', 'Control de Accesos', 'Primeros Auxilios', 'Manejo Defensivo'],
      preferredAreas: ['Observatorio', 'Santa Fe', 'Las Águilas']
    }
  },
  {
    email: 'ana.lopez@example.com',
    password: 'Test123!',
    displayName: 'Ana López',
    phone: '55-4567-8901',
    profile: {
      name: 'Ana López',
      trade: Trade.CLEANER,
      experience: 6,
      location: 'Olivar del Conde, Álvaro Obregón',
      bio: 'Especialista en limpieza profunda y mantenimiento de espacios comerciales y residenciales.',
      certifications: [],
      rating: 4.6,
      totalRatings: 20,
      available: true,
      skills: ['Limpieza Profunda', 'Sanitización', 'Organización', 'Lavandería'],
      preferredAreas: ['Olivar del Conde', 'San Ángel', 'Guadalupe Inn']
    }
  },
  {
    email: 'pedro.sanchez@example.com',
    password: 'Test123!',
    displayName: 'Pedro Sánchez',
    phone: '55-5678-9012',
    profile: {
      name: 'Pedro Sánchez',
      trade: Trade.TRANSLATOR,
      secondaryTrades: [Trade.GUIDE],
      experience: 4,
      location: 'San Ángel Inn, Álvaro Obregón',
      bio: 'Traductor e intérprete inglés-español con experiencia en turismo y eventos corporativos.',
      certifications: [
        {
          id: '4',
          name: 'TOEFL iBT',
          type: 'language',
          issuer: 'ETS',
          issueDate: new Date('2022-09-15'),
          expiryDate: new Date('2024-09-15'),
          verified: true
        }
      ],
      rating: 4.9,
      totalRatings: 6,
      available: true,
      skills: ['Inglés Avanzado', 'Traducción Simultánea', 'Guía Turístico', 'Francés Básico'],
      preferredAreas: ['San Ángel', 'Coyoacán', 'Santa Fe']
    }
  }
];

const sampleEmployers = [
  {
    email: 'restaurante.azteca@example.com',
    password: 'Test123!',
    displayName: 'Restaurante Azteca',
    phone: '55-1111-2222',
    profile: {
      companyName: 'Restaurante Azteca',
      contactName: 'Roberto Hernández',
      businessType: 'Restaurante',
      location: 'Santa Fe, Álvaro Obregón',
      description: 'Restaurante de alta cocina mexicana con 15 años de experiencia. Buscamos talento comprometido.',
      rating: 4.5,
      totalRatings: 30,
      verified: true
    }
  },
  {
    email: 'hotel.ejecutivo@example.com',
    password: 'Test123!',
    displayName: 'Hotel Ejecutivo Santa Fe',
    phone: '55-3333-4444',
    profile: {
      companyName: 'Hotel Ejecutivo Santa Fe',
      contactName: 'Laura Méndez',
      businessType: 'Hotel',
      location: 'Santa Fe, Álvaro Obregón',
      description: 'Hotel de negocios 5 estrellas en el corazón de Santa Fe. Siempre en búsqueda de personal calificado.',
      rating: 4.7,
      totalRatings: 25,
      verified: true
    }
  },
  {
    email: 'eventos.premier@example.com',
    password: 'Test123!',
    displayName: 'Eventos Premier',
    phone: '55-5555-6666',
    profile: {
      companyName: 'Eventos Premier',
      contactName: 'Diego Morales',
      businessType: 'Organizador de Eventos',
      location: 'San Ángel, Álvaro Obregón',
      description: 'Empresa líder en organización de eventos corporativos y sociales. Necesitamos personal eventual.',
      rating: 4.8,
      totalRatings: 18,
      verified: false
    }
  }
];

const sampleJobs = [
  {
    title: 'Chef de Cocina para Evento Mundial',
    description: 'Buscamos chef experimentado para eventos durante el Mundial 2026. Menús internacionales y mexicanos.',
    trade: Trade.COOK,
    salary: { amount: 800, period: 'day' as const },
    duration: '3 meses',
    location: 'Santa Fe, Álvaro Obregón',
    requirements: [
      'Experiencia mínima de 5 años',
      'Certificación en manejo de alimentos',
      'Disponibilidad inmediata',
      'Inglés básico'
    ],
    status: 'open' as const
  },
  {
    title: 'Bartenders para Hotel 5 Estrellas',
    description: 'Hotel de lujo busca bartenders con experiencia para atender a huéspedes internacionales.',
    trade: Trade.BARTENDER,
    salary: { amount: 600, period: 'day' as const },
    duration: 'Permanente',
    location: 'Santa Fe, Álvaro Obregón',
    requirements: [
      'Certificación en mixología',
      'Inglés conversacional',
      'Experiencia en hoteles',
      'Excelente presentación'
    ],
    status: 'open' as const
  },
  {
    title: 'Personal de Seguridad para Estadio',
    description: 'Se requiere personal de seguridad certificado para eventos del Mundial 2026.',
    trade: Trade.SECURITY,
    salary: { amount: 500, period: 'day' as const },
    duration: '6 meses',
    location: 'Observatorio, Álvaro Obregón',
    requirements: [
      'Certificación SSP vigente',
      'Experiencia en eventos masivos',
      'Condición física óptima',
      'Disponibilidad de horario'
    ],
    status: 'open' as const
  },
  {
    title: 'Meseros Bilingües para Restaurante',
    description: 'Restaurante de alta cocina busca meseros con excelente servicio al cliente.',
    trade: Trade.WAITER,
    salary: { amount: 400, period: 'day' as const },
    duration: 'Permanente',
    location: 'San Ángel, Álvaro Obregón',
    requirements: [
      'Inglés fluido',
      'Experiencia en fine dining',
      'Conocimiento de vinos',
      'Actitud de servicio'
    ],
    status: 'open' as const
  },
  {
    title: 'Traductores para Eventos FIFA',
    description: 'Necesitamos traductores inglés-español para eventos oficiales del Mundial.',
    trade: Trade.TRANSLATOR,
    salary: { amount: 1200, period: 'day' as const },
    duration: '2 meses',
    location: 'Santa Fe, Álvaro Obregón',
    requirements: [
      'Certificación en traducción',
      'Experiencia en eventos deportivos',
      'Disponibilidad total',
      'Profesionalismo'
    ],
    status: 'open' as const
  }
];

const sampleCertifications = [
  {
    name: 'Manejo Higiénico de Alimentos',
    description: 'Certificación oficial COFEPRIS para el manejo seguro de alimentos en establecimientos.',
    provider: 'COFEPRIS',
    category: 'Alimentos y Bebidas',
    duration: '40 horas',
    price: 0,
    isFree: true,
    requirements: ['Mayor de 18 años', 'Identificación oficial'],
    benefits: ['Certificado oficial', 'Validez nacional', 'Material incluido'],
    level: 'basic' as const,
    maxStudents: 50,
    currentStudents: 23,
    status: 'active' as const,
    online: false,
    certificateType: 'Certificado Oficial',
    location: 'Casa de Cultura Álvaro Obregón'
  },
  {
    name: 'Inglés para Turismo',
    description: 'Curso intensivo de inglés enfocado en atención a turistas para el Mundial 2026.',
    provider: 'Alcaldía Álvaro Obregón',
    category: 'Idiomas',
    duration: '80 horas',
    price: 0,
    isFree: true,
    requirements: ['Mayor de 16 años', 'Conocimientos básicos de inglés'],
    benefits: ['Certificado de participación', 'Material digital', 'Práctica con nativos'],
    level: 'intermediate' as const,
    maxStudents: 30,
    currentStudents: 18,
    status: 'active' as const,
    online: true,
    certificateType: 'Certificado de Competencia'
  },
  {
    name: 'Seguridad Privada Básica',
    description: 'Formación básica en seguridad privada con certificación SSP.',
    provider: 'SSP CDMX',
    category: 'Seguridad',
    duration: '120 horas',
    price: 1500,
    isFree: false,
    requirements: ['Mayor de 21 años', 'Secundaria terminada', 'Carta de no antecedentes'],
    benefits: ['Certificación SSP', 'Licencia de portación', 'Bolsa de trabajo'],
    level: 'basic' as const,
    maxStudents: 40,
    currentStudents: 35,
    status: 'active' as const,
    online: false,
    certificateType: 'Licencia Oficial',
    location: 'Centro de Capacitación SSP'
  },
  {
    name: 'Mixología y Coctelería',
    description: 'Curso completo de preparación de bebidas y cocteles para bartenders.',
    provider: 'Asociación de Bartenders CDMX',
    category: 'Alimentos y Bebidas',
    duration: '60 horas',
    price: 0,
    isFree: true,
    requirements: ['Mayor de 18 años', 'Interés en bartending'],
    benefits: ['Certificado profesional', 'Kit de bartender', 'Recetario digital'],
    level: 'intermediate' as const,
    maxStudents: 25,
    currentStudents: 20,
    status: 'active' as const,
    online: false,
    certificateType: 'Diploma Profesional',
    location: 'Escuela de Hospitalidad AO'
  },
  {
    name: 'Primeros Auxilios',
    description: 'Capacitación en primeros auxilios y RCP certificada por Cruz Roja.',
    provider: 'Cruz Roja Mexicana',
    category: 'Salud',
    duration: '20 horas',
    price: 0,
    isFree: true,
    requirements: ['Mayor de 15 años'],
    benefits: ['Certificación Cruz Roja', 'Manual de primeros auxilios', 'Práctica con maniquíes'],
    level: 'basic' as const,
    maxStudents: 35,
    currentStudents: 28,
    status: 'active' as const,
    online: false,
    certificateType: 'Certificado Cruz Roja',
    location: 'Delegación Cruz Roja AO'
  }
];

// Admin user
const adminUser = {
  email: 'admin@alvaroobregon.gob.mx',
  password: 'Admin2026!',
  displayName: 'Administrador AO',
  role: 'admin'
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if data already exists
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (usersSnapshot.size > 5) {
      console.log('⚠️ Database already has data. Skipping seed.');
      return;
    }

    // Create admin user
    try {
      console.log('👤 Creating admin user...');
      const adminCredential = await createUserWithEmailAndPassword(
        auth, 
        adminUser.email, 
        adminUser.password
      );
      
      await setDoc(doc(db, 'users', adminCredential.user.uid), {
        email: adminUser.email,
        displayName: adminUser.displayName,
        role: adminUser.role,
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Admin user created');
    } catch (error: any) {
      if (error.code !== 'auth/email-already-in-use') {
        console.error('Error creating admin:', error);
      }
    }

    // Create workers
    console.log('👷 Creating workers...');
    for (const worker of sampleWorkers) {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          worker.email,
          worker.password
        );
        
        await setDoc(doc(db, 'users', credential.user.uid), {
          email: worker.email,
          displayName: worker.displayName,
          phone: worker.phone,
          role: 'worker',
          status: 'active',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        await addDoc(collection(db, 'workerProfiles'), {
          userId: credential.user.uid,
          ...worker.profile,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        console.log(`✅ Worker created: ${worker.displayName}`);
      } catch (error: any) {
        if (error.code !== 'auth/email-already-in-use') {
          console.error(`Error creating worker ${worker.email}:`, error);
        }
      }
    }

    // Create employers
    console.log('🏢 Creating employers...');
    for (const employer of sampleEmployers) {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          employer.email,
          employer.password
        );
        
        await setDoc(doc(db, 'users', credential.user.uid), {
          email: employer.email,
          displayName: employer.displayName,
          phone: employer.phone,
          role: 'employer',
          status: 'active',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        await addDoc(collection(db, 'employerProfiles'), {
          userId: credential.user.uid,
          ...employer.profile,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        console.log(`✅ Employer created: ${employer.displayName}`);
      } catch (error: any) {
        if (error.code !== 'auth/email-already-in-use') {
          console.error(`Error creating employer ${employer.email}:`, error);
        }
      }
    }

    // Create jobs
    console.log('💼 Creating job postings...');
    const employerDocs = await getDocs(
      query(collection(db, 'users'), where('role', '==', 'employer'))
    );
    
    if (employerDocs.size > 0) {
      const employerIds = employerDocs.docs.map(doc => doc.id);
      const employerNames = employerDocs.docs.map(doc => doc.data().displayName);
      
      for (let i = 0; i < sampleJobs.length; i++) {
        const job = sampleJobs[i];
        const employerIndex = i % employerIds.length;
        
        await addDoc(collection(db, 'jobs'), {
          ...job,
          employerId: employerIds[employerIndex],
          employerName: employerNames[employerIndex],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          applicants: []
        });
        
        console.log(`✅ Job created: ${job.title}`);
      }
    }

    // Create certifications
    console.log('📚 Creating certifications...');
    for (const cert of sampleCertifications) {
      await addDoc(collection(db, 'certifications'), {
        ...cert,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log(`✅ Certification created: ${cert.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('=====================================');
    console.log('ADMIN:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${adminUser.password}`);
    console.log('\nWORKERS:');
    sampleWorkers.forEach(w => {
      console.log(`  ${w.displayName}: ${w.email} / ${w.password}`);
    });
    console.log('\nEMPLOYERS:');
    sampleEmployers.forEach(e => {
      console.log(`  ${e.displayName}: ${e.email} / ${e.password}`);
    });
    console.log('=====================================\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Simplified seed function for demo data (without auth)
export const seedDemoData = async () => {
  const results = {
    workers: 0,
    jobs: 0,
    certifications: 0,
    errors: [] as string[]
  };

  try {
    console.log('🌱 Starting demo data seeding...');
    
    // Add worker profiles directly (without auth)
    console.log('👷 Creating demo workers...');
    for (let i = 0; i < sampleWorkers.length; i++) {
      try {
        const worker = sampleWorkers[i];
        // Generate a unique userId for demo purposes with index to ensure uniqueness
        const fakeUserId = `demo_worker_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Convert Trade enum values to strings and prepare data
        const workerData = {
          userId: fakeUserId,
          email: worker.email,
          name: worker.profile.name,
          trade: worker.profile.trade, // This is already a string value from the enum
          secondaryTrades: worker.profile.secondaryTrades || [],
          experience: worker.profile.experience,
          location: worker.profile.location,
          bio: worker.profile.bio,
          certifications: worker.profile.certifications.map(cert => ({
            ...cert,
            issueDate: Timestamp.fromDate(cert.issueDate),
            expiryDate: 'expiryDate' in cert && cert.expiryDate ? Timestamp.fromDate(cert.expiryDate) : null
          })),
          rating: worker.profile.rating,
          totalRatings: worker.profile.totalRatings,
          available: worker.profile.available,
          skills: (worker.profile as any).skills || [],
          preferredAreas: (worker.profile as any).preferredAreas || [],
          displayName: worker.displayName,
          phone: worker.phone,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await addDoc(collection(db, 'workerProfiles'), workerData);
        
        console.log(`✅ Demo worker created: ${worker.displayName}`);
        results.workers++;
        // Small delay to ensure unique timestamps
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`❌ Error creating worker ${i}:`, error);
        results.errors.push(`Worker ${i}: ${error}`);
      }
    }

    // Add jobs directly
    console.log('💼 Creating demo job postings...');
    for (let i = 0; i < sampleJobs.length; i++) {
      try {
        const job = sampleJobs[i];
        const jobData = {
          title: job.title,
          description: job.description,
          trade: job.trade, // This is already a string value from the enum
          salary: job.salary,
          duration: job.duration,
          location: job.location,
          requirements: job.requirements,
          status: job.status,
          employerId: `demo_employer_${Math.random().toString(36).substr(2, 9)}`,
          employerName: sampleEmployers[Math.floor(Math.random() * sampleEmployers.length)].displayName,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          applicants: [],
          views: Math.floor(Math.random() * 100) + 10,
          saves: Math.floor(Math.random() * 20)
        };
        
        await addDoc(collection(db, 'jobs'), jobData);
        
        console.log(`✅ Demo job created: ${job.title}`);
        results.jobs++;
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`❌ Error creating job ${i}:`, error);
        results.errors.push(`Job ${i}: ${error}`);
      }
    }

    // Add certifications
    console.log('📚 Creating demo certifications...');
    for (let i = 0; i < sampleCertifications.length; i++) {
      try {
        const cert = sampleCertifications[i];
        await addDoc(collection(db, 'certifications'), {
          ...cert,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        console.log(`✅ Demo certification created: ${cert.name}`);
        results.certifications++;
      } catch (error) {
        console.error(`❌ Error creating certification ${i}:`, error);
        results.errors.push(`Certification ${i}: ${error}`);
      }
    }

    console.log('🎉 Demo data seeding completed!');
    console.log(`✅ Workers created: ${results.workers}`);
    console.log(`✅ Jobs created: ${results.jobs}`);
    console.log(`✅ Certifications created: ${results.certifications}`);
    if (results.errors.length > 0) {
      console.log(`⚠️ Errors encountered: ${results.errors.length}`);
      results.errors.forEach(err => console.error(err));
    }
    
    return { 
      success: true, 
      message: `Datos agregados: ${results.workers} trabajadores, ${results.jobs} empleos, ${results.certifications} certificaciones`,
      results 
    };
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
};

// Function to clear all data (use with caution!)
export const clearDatabase = async () => {
  const collections = ['users', 'workerProfiles', 'employerProfiles', 'jobs', 'certifications', 'certificationEnrollments', 'applications'];
  
  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }
    console.log(`Cleared collection: ${collectionName}`);
  }
};