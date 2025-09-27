import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Translation files
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.bookings': 'Bookings',
    'nav.listings': 'Listings',
    'nav.analytics': 'Analytics',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    
    // Booking Management
    'booking.title': 'Booking Management',
    'booking.subtitle': 'Manage all your property bookings',
    'booking.loading': 'Loading bookings...',
    'booking.filterBy': 'Filter by status:',
    'booking.all': 'All Bookings',
    'booking.pending': 'Pending Approval',
    'booking.approved': 'Approved',
    'booking.confirmed': 'Confirmed',
    'booking.active': 'Active',
    'booking.completed': 'Completed',
    'booking.cancelled': 'Cancelled',
    'booking.rejected': 'Rejected',
    
    // Table Headers
    'table.guest': 'Guest',
    'table.property': 'Property',
    'table.dates': 'Dates',
    'table.guests': 'Guests',
    'table.amount': 'Amount',
    'table.status': 'Status',
    'table.actions': 'Actions',
    
    // Booking Details
    'booking.checkin': 'Check-in',
    'booking.checkout': 'Check-out',
    'booking.adults': 'adults',
    'booking.children': 'children',
    
    // Actions
    'action.approve': 'Approve booking',
    'action.reject': 'Reject booking',
    'action.complete': 'Mark as completed',
    'action.viewReviews': 'View reviews',
    'action.viewDetails': 'View details',
    
    // Modals
    'modal.approveTitle': 'Approve Booking Request',
    'modal.approveMessage': 'Are you sure you want to approve this booking from',
    'modal.messageToGuest': 'Message to Guest (Optional)',
    'modal.messagePlaceholder': 'Welcome! Looking forward to hosting you...',
    'modal.rejectTitle': 'Reject Booking Request',
    'modal.rejectMessage': 'Please provide a reason for rejecting this booking:',
    'modal.rejectPlaceholder': 'Reason for rejection...',
    'modal.reviewTitle': 'Reviews for Booking #',
    
    // Buttons
    'btn.approve': 'Approve Booking',
    'btn.reject': 'Reject Booking',
    'btn.cancel': 'Cancel',
    'btn.processing': 'Processing...',
    
    // Messages
    'msg.bookingApproved': 'Booking approved successfully!',
    'msg.bookingRejected': 'Booking rejected',
    'msg.bookingCompleted': 'Booking completed successfully',
    'msg.failedToLoad': 'Failed to load bookings',
    'msg.failedToApprove': 'Failed to approve booking',
    'msg.failedToReject': 'Failed to reject booking',
    'msg.failedToComplete': 'Failed to complete booking',
    'msg.provideReason': 'Please provide a reason for rejection',
    'msg.noBookings': 'No bookings found',
    'msg.noBookingsAll': "You don't have any bookings yet.",
    'msg.noBookingsFilter': 'bookings found.',
    
    // Host Management
    'host.reviewRequests': 'Review Requests',
    'host.reviewRequestsDesc': 'Manage pending booking requests from guests',
    'host.noPendingRequests': 'No Pending Requests',
    'host.noPendingRequestsDesc': 'All caught up! No pending booking requests at the moment.',
    'host.manageProperties': 'Manage Properties',
    'host.managePropertiesDesc': 'View and manage all your property listings',
    'host.addNewProperty': 'Add New Property',
    'host.noProperties': 'No Properties Listed',
    'host.noPropertiesDesc': 'You haven\'t listed any properties yet. Create your first listing to get started.',
    'host.createFirstProperty': 'Create Your First Property',
    'host.confirmDeleteProperty': 'Are you sure you want to delete this property? This action cannot be undone.',
    'host.propertyDeleted': 'Property deleted successfully',
    'host.deletePropertyError': 'Failed to delete property',
    
    // Property Management
    'property.status.active': 'Active',
    'property.status.inactive': 'Inactive',
    'property.status.draft': 'Draft',
    'property.propertyType': 'Property Type',
    'property.roomType': 'Room Type',
    'property.guests': 'Guests',
    'property.basePrice': 'Base Price',
    'property.editProperty': 'Edit Property',
    'property.editPropertyDesc': 'Update your property information and settings',
    'property.basicInfo': 'Basic Information',
    'property.title': 'Property Title',
    'property.description': 'Description',
    'property.selectPropertyType': 'Select property type...',
    'property.selectRoomType': 'Select room type...',
    'property.maxGuests': 'Maximum Guests',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.location': 'Location',
    'property.address': 'Address',
    'property.city': 'City',
    'property.state': 'State',
    'property.zipCode': 'ZIP Code',
    'property.pricing': 'Pricing',
    'property.cleaningFee': 'Cleaning Fee',
    'property.amenities': 'Amenities',
    'property.houseRules': 'House Rules',
    'property.houseRulesPlaceholder': 'Enter house rules for guests (e.g., No smoking, No pets, etc.)',
    'property.fetchError': 'Failed to fetch property details',
    'property.updateSuccess': 'Property updated successfully',
    'property.updateError': 'Failed to update property',
    
    // Common
    'common.error': 'Something went wrong. Please try again.',
    'common.processing': 'Processing...',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.guests': 'guests',
    'common.nights': 'nights',
    'common.night': 'night',
    'common.reviews': 'reviews',
    'common.saving': 'Saving...',
    'common.saveChanges': 'Save Changes',
    
    // Booking Related
    'booking.approve': 'Approve',
    'booking.reject': 'Reject',
    'booking.approveSuccess': 'Booking approved successfully',
    'booking.rejectSuccess': 'Booking rejected successfully',
    'booking.approveError': 'Failed to approve booking',
    'booking.rejectError': 'Failed to reject booking',
    'booking.specialRequests': 'Special Requests',
    'booking.totalAmount': 'Total Amount',
    'booking.requestedOn': 'Requested on'
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.bookings': 'बुकिंग',
    'nav.listings': 'लिस्टिंग',
    'nav.analytics': 'विश्लेषण',
    'nav.messages': 'संदेश',
    'nav.profile': 'प्रोफ़ाइल',
    
    // Booking Management
    'booking.title': 'बुकिंग प्रबंधन',
    'booking.subtitle': 'अपनी सभी संपत्ति बुकिंग प्रबंधित करें',
    'booking.loading': 'बुकिंग लोड हो रही हैं...',
    'booking.filterBy': 'स्थिति के अनुसार फ़िल्टर करें:',
    'booking.all': 'सभी बुकिंग',
    'booking.pending': 'अनुमोदन लंबित',
    'booking.approved': 'स्वीकृत',
    'booking.confirmed': 'पुष्टि की गई',
    'booking.active': 'सक्रिय',
    'booking.completed': 'पूर्ण',
    'booking.cancelled': 'रद्द',
    'booking.rejected': 'अस्वीकृत',
    
    // Table Headers
    'table.guest': 'अतिथि',
    'table.property': 'संपत्ति',
    'table.dates': 'तारीखें',
    'table.guests': 'अतिथि',
    'table.amount': 'राशि',
    'table.status': 'स्थिति',
    'table.actions': 'क्रियाएं',
    
    // Booking Details
    'booking.checkin': 'चेक-इन',
    'booking.checkout': 'चेक-आउट',
    'booking.adults': 'वयस्क',
    'booking.children': 'बच्चे',
    
    // Actions
    'action.approve': 'बुकिंग स्वीकार करें',
    'action.reject': 'बुकिंग अस्वीकार करें',
    'action.complete': 'पूर्ण के रूप में चिह्नित करें',
    'action.viewReviews': 'समीक्षा देखें',
    'action.viewDetails': 'विवरण देखें',
    
    // Modals
    'modal.approveTitle': 'बुकिंग अनुरोध स्वीकार करें',
    'modal.approveMessage': 'क्या आप वाकई इस बुकिंग को स्वीकार करना चाहते हैं',
    'modal.messageToGuest': 'अतिथि को संदेश (वैकल्पिक)',
    'modal.messagePlaceholder': 'स्वागत है! आपकी मेजबानी के लिए उत्सुक हैं...',
    'modal.rejectTitle': 'बुकिंग अनुरोध अस्वीकार करें',
    'modal.rejectMessage': 'कृपया इस बुकिंग को अस्वीकार करने का कारण बताएं:',
    'modal.rejectPlaceholder': 'अस्वीकार करने का कारण...',
    'modal.reviewTitle': 'बुकिंग के लिए समीक्षा #',
    
    // Buttons
    'btn.approve': 'बुकिंग स्वीकार करें',
    'btn.reject': 'बुकिंग अस्वीकार करें',
    'btn.cancel': 'रद्द करें',
    'btn.processing': 'प्रसंस्करण...',
    
    // Messages
    'msg.bookingApproved': 'बुकिंग सफलतापूर्वक स्वीकार की गई!',
    'msg.bookingRejected': 'बुकिंग अस्वीकार की गई',
    'msg.bookingCompleted': 'बुकिंग सफलतापूर्वक पूर्ण हुई',
    'msg.failedToLoad': 'बुकिंग लोड करने में विफल',
    'msg.failedToApprove': 'बुकिंग स्वीकार करने में विफल',
    'msg.failedToReject': 'बुकिंग अस्वीकार करने में विफल',
    'msg.failedToComplete': 'बुकिंग पूर्ण करने में विफल',
    'msg.provideReason': 'कृपया अस्वीकार करने का कारण प्रदान करें',
    'msg.noBookings': 'कोई बुकिंग नहीं मिली',
    'msg.noBookingsAll': 'आपके पास अभी तक कोई बुकिंग नहीं है।',
    'msg.noBookingsFilter': 'बुकिंग मिली।'
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.bookings': 'Reservas',
    'nav.listings': 'Listados',
    'nav.analytics': 'Analíticas',
    'nav.messages': 'Mensajes',
    'nav.profile': 'Perfil',
    
    // Booking Management
    'booking.title': 'Gestión de Reservas',
    'booking.subtitle': 'Gestiona todas las reservas de tus propiedades',
    'booking.loading': 'Cargando reservas...',
    'booking.filterBy': 'Filtrar por estado:',
    'booking.all': 'Todas las Reservas',
    'booking.pending': 'Pendiente de Aprobación',
    'booking.approved': 'Aprobada',
    'booking.confirmed': 'Confirmada',
    'booking.active': 'Activa',
    'booking.completed': 'Completada',
    'booking.cancelled': 'Cancelada',
    'booking.rejected': 'Rechazada',
    
    // Table Headers
    'table.guest': 'Huésped',
    'table.property': 'Propiedad',
    'table.dates': 'Fechas',
    'table.guests': 'Huéspedes',
    'table.amount': 'Cantidad',
    'table.status': 'Estado',
    'table.actions': 'Acciones',
    
    // Booking Details
    'booking.checkin': 'Llegada',
    'booking.checkout': 'Salida',
    'booking.adults': 'adultos',
    'booking.children': 'niños',
    
    // Actions
    'action.approve': 'Aprobar reserva',
    'action.reject': 'Rechazar reserva',
    'action.complete': 'Marcar como completada',
    'action.viewReviews': 'Ver reseñas',
    'action.viewDetails': 'Ver detalles',
    
    // Modals
    'modal.approveTitle': 'Aprobar Solicitud de Reserva',
    'modal.approveMessage': '¿Estás seguro de que quieres aprobar esta reserva de',
    'modal.messageToGuest': 'Mensaje al Huésped (Opcional)',
    'modal.messagePlaceholder': '¡Bienvenido! Esperamos ser tus anfitriones...',
    'modal.rejectTitle': 'Rechazar Solicitud de Reserva',
    'modal.rejectMessage': 'Por favor, proporciona una razón para rechazar esta reserva:',
    'modal.rejectPlaceholder': 'Razón del rechazo...',
    'modal.reviewTitle': 'Reseñas para Reserva #',
    
    // Buttons
    'btn.approve': 'Aprobar Reserva',
    'btn.reject': 'Rechazar Reserva',
    'btn.cancel': 'Cancelar',
    'btn.processing': 'Procesando...',
    
    // Messages
    'msg.bookingApproved': '¡Reserva aprobada exitosamente!',
    'msg.bookingRejected': 'Reserva rechazada',
    'msg.bookingCompleted': 'Reserva completada exitosamente',
    'msg.failedToLoad': 'Error al cargar las reservas',
    'msg.failedToApprove': 'Error al aprobar la reserva',
    'msg.failedToReject': 'Error al rechazar la reserva',
    'msg.failedToComplete': 'Error al completar la reserva',
    'msg.provideReason': 'Por favor, proporciona una razón para el rechazo',
    'msg.noBookings': 'No se encontraron reservas',
    'msg.noBookingsAll': 'Aún no tienes ninguna reserva.',
    'msg.noBookingsFilter': 'reservas encontradas.'
  },
  ta: {
    // Navigation
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.bookings': 'முன்பதிவுகள்',
    'nav.listings': 'பட்டியல்கள்',
    'nav.analytics': 'பகுப்பாய்வு',
    'nav.messages': 'செய்திகள்',
    'nav.profile': 'சுயவிவரம்',
    
    // Booking Management
    'booking.title': 'முன்பதிவு மேலாண்மை',
    'booking.subtitle': 'உங்கள் அனைத்து சொத்து முன்பதிவுகளையும் நிர்வகிக்கவும்',
    'booking.loading': 'முன்பதிவுகள் ஏற்றப்படுகின்றன...',
    'booking.filterBy': 'நிலை அடிப்படையில் வடிகட்டவும்:',
    'booking.all': 'அனைத்து முன்பதிவுகள்',
    'booking.pending': 'ஒப்புதல் நிலுவையில்',
    'booking.approved': 'ஒப்புதல்',
    'booking.confirmed': 'உறுதிப்படுத்தப்பட்டது',
    'booking.active': 'செயலில்',
    'booking.completed': 'நிறைவு',
    'booking.cancelled': 'ரத்து',
    'booking.rejected': 'நிராகரிக்கப்பட்டது',
    
    // Messages
    'msg.bookingApproved': 'முன்பதிவு வெற்றிகரமாக ஒப்புதல் அளிக்கப்பட்டது!',
    'msg.bookingRejected': 'முன்பதிவு நிராகரிக்கப்பட்டது',
    'msg.bookingCompleted': 'முன்பதிவு வெற்றிகரமாக நிறைவு செய்யப்பட்டது',
    'msg.failedToLoad': 'முன்பதிவுகளை ஏற்றுவதில் தோல்வி',
    'msg.noBookings': 'முன்பதிவுகள் எதுவும் கிடைக்கவில்லை'
  },
  te: {
    // Navigation
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.bookings': 'బుకింగ్‌లు',
    'nav.listings': 'లిస్టింగ్‌లు',
    'nav.analytics': 'విశ్లేషణలు',
    'nav.messages': 'సందేశాలు',
    'nav.profile': 'ప్రొఫైల్',
    
    // Booking Management
    'booking.title': 'బుకింగ్ నిర్వహణ',
    'booking.subtitle': 'మీ అన్ని ప్రాపర్టీ బుకింగ్‌లను నిర్వహించండి',
    'booking.loading': 'బుకింగ్‌లు లోడవుతున్నాయి...',
    'booking.filterBy': 'స్థితి ఆధారంగా ఫిల్టర్ చేయండి:',
    'booking.all': 'అన్ని బుకింగ్‌లు',
    'booking.pending': 'అనుమతి పెండింగ్‌లో',
    'booking.approved': 'అనుమతించబడింది',
    'booking.confirmed': 'ధృవీకరించబడింది',
    'booking.active': 'చురుకుగా',
    'booking.completed': 'పూర్తయింది',
    'booking.cancelled': 'రద్దు చేయబడింది',
    'booking.rejected': 'తిరస్కరించబడింది',
    
    // Messages
    'msg.bookingApproved': 'బుకింగ్ విజయవంతంగా అనుమతించబడింది!',
    'msg.bookingRejected': 'బుకింగ్ తిరస్కరించబడింది',
    'msg.bookingCompleted': 'బుకింగ్ విజయవంతంగా పూర్తయింది',
    'msg.failedToLoad': 'బుకింగ్‌లను లోడ్ చేయడంలో విఫలం',
    'msg.noBookings': 'బుకింగ్‌లు ఏవీ కనుగొనబడలేదు'
  },
  mr: {
    // Navigation
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.bookings': 'बुकिंग',
    'nav.listings': 'यादी',
    'nav.analytics': 'विश्लेषण',
    'nav.messages': 'संदेश',
    'nav.profile': 'प्रोफाइल',
    
    // Booking Management
    'booking.title': 'बुकिंग व्यवस्थापन',
    'booking.subtitle': 'आपली सर्व मालमत्ता बुकिंग व्यवस्थापित करा',
    'booking.loading': 'बुकिंग लोड होत आहेत...',
    'booking.filterBy': 'स्थितीनुसार फिल्टर करा:',
    'booking.all': 'सर्व बुकिंग',
    'booking.pending': 'मंजुरी प्रलंबित',
    'booking.approved': 'मंजूर',
    'booking.confirmed': 'पुष्टी केली',
    'booking.active': 'सक्रिय',
    'booking.completed': 'पूर्ण',
    'booking.cancelled': 'रद्द',
    'booking.rejected': 'नाकारले',
    
    // Messages
    'msg.bookingApproved': 'बुकिंग यशस्वीरित्या मंजूर झाली!',
    'msg.bookingRejected': 'बुकिंग नाकारली',
    'msg.bookingCompleted': 'बुकिंग यशस्वीरित्या पूर्ण झाली',
    'msg.failedToLoad': 'बुकिंग लोड करण्यात अयशस्वी',
    'msg.noBookings': 'कोणतेही बुकिंग आढळले नाहीत'
  },
  bn: {
    // Navigation
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.bookings': 'বুকিং',
    'nav.listings': 'তালিকা',
    'nav.analytics': 'বিশ্লেষণ',
    'nav.messages': 'বার্তা',
    'nav.profile': 'প্রোফাইল',
    
    // Booking Management
    'booking.title': 'বুকিং ব্যবস্থাপনা',
    'booking.subtitle': 'আপনার সমস্ত সম্পত্তি বুকিং পরিচালনা করুন',
    'booking.loading': 'বুকিং লোড হচ্ছে...',
    'booking.filterBy': 'অবস্থা অনুযায়ী ফিল্টার করুন:',
    'booking.all': 'সমস্ত বুকিং',
    'booking.pending': 'অনুমোদনের জন্য অপেক্ষমাণ',
    'booking.approved': 'অনুমোদিত',
    'booking.confirmed': 'নিশ্চিত',
    'booking.active': 'সক্রিয়',
    'booking.completed': 'সম্পূর্ণ',
    'booking.cancelled': 'বাতিল',
    'booking.rejected': 'প্রত্যাখ্যাত',
    
    // Messages
    'msg.bookingApproved': 'বুকিং সফলভাবে অনুমোদিত হয়েছে!',
    'msg.bookingRejected': 'বুকিং প্রত্যাখ্যাত',
    'msg.bookingCompleted': 'বুকিং সফলভাবে সম্পন্ন হয়েছে',
    'msg.failedToLoad': 'বুকিং লোড করতে ব্যর্থ',
    'msg.noBookings': 'কোন বুকিং পাওয়া যায়নি'
  },
  gu: {
    // Navigation
    'nav.dashboard': 'ડૅશબોર્ડ',
    'nav.bookings': 'બુકિંગ',
    'nav.listings': 'યાદી',
    'nav.analytics': 'વિશ્લેષણ',
    'nav.messages': 'સંદેશાઓ',
    'nav.profile': 'પ્રોફાઇલ',
    
    // Booking Management
    'booking.title': 'બુકિંગ મેનેજમેન્ટ',
    'booking.subtitle': 'તમારી તમામ પ્રોપર્ટી બુકિંગ મેનેજ કરો',
    'booking.loading': 'બુકિંગ લોડ થઈ રહી છે...',
    'booking.filterBy': 'સ્થિતિ અનુસાર ફિલ્ટર કરો:',
    'booking.all': 'બધી બુકિંગ',
    'booking.pending': 'મંજૂરી બાકી',
    'booking.approved': 'મંજૂર',
    'booking.confirmed': 'પુષ્ટિ થયેલ',
    'booking.active': 'સક્રિય',
    'booking.completed': 'પૂર્ણ',
    'booking.cancelled': 'રદ',
    'booking.rejected': 'નકારેલ',
    
    // Messages
    'msg.bookingApproved': 'બુકિંગ સફળતાપૂર્વક મંજૂર થઈ!',
    'msg.bookingRejected': 'બુકિંગ નકારવામાં આવી',
    'msg.bookingCompleted': 'બુકિંગ સફળતાપૂર્વક પૂર્ણ થઈ',
    'msg.failedToLoad': 'બુકિંગ લોડ કરવામાં નિષ્ફળ',
    'msg.noBookings': 'કોઈ બુકિંગ મળી નથી'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key, params = {}) => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    t,
    changeLanguage,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;