// Language routes configuration
export const languageRoutes = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', locale: 'nl_NL' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', locale: 'ar_SA' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', locale: 'ru_RU' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳', locale: 'zh_CN' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', locale: 'ja_JP' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', locale: 'de_DE' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', locale: 'it_IT' },
  { code: 'es', name: 'Español', flag: '🇪🇸', locale: 'es_ES' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', locale: 'pl_PL' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', locale: 'fr_FR' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', locale: 'pt_PT' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', locale: 'ko_KR' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', locale: 'tr_TR' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', locale: 'vi_VN' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭', locale: 'th_TH' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', locale: 'id_ID' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', locale: 'hi_IN' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', locale: 'sv_SE' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴', locale: 'no_NO' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', locale: 'da_DK' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', locale: 'fi_FI' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿', locale: 'cs_CZ' },
  { code: 'ro', name: 'Română', flag: '🇷🇴', locale: 'ro_RO' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺', locale: 'hu_HU' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷', locale: 'el_GR' },
] as const;

export const getLanguageMetadata = (lang: string) => {
  const metadataMap: Record<string, { title: string; description: string; locale: string }> = {
    'nl': {
      title: 'Uprent Plus - Vind je Nederlandse huurwoning in 15 seconden',
      description: 'AI-aangedreven huurwaarschuwingen voor 1.500+ bronnen. Mis geen aanbod meer. Vertrouwd door 10.000+ huurders in Nederland.',
      locale: 'nl_NL',
    },
    'ar': {
      title: 'Uprent Plus - ابحث عن إيجارك الهولندي في 15 ثانية',
      description: 'تنبيهات إيجار مدعومة بالذكاء الاصطناعي لأكثر من 1500 مصدر. لا تفوت قائمة واحدة. موثوق به من قبل أكثر من 10000 مستأجر في هولندا.',
      locale: 'ar_SA',
    },
    'ru': {
      title: 'Uprent Plus - Найдите голландскую аренду за 15 секунд',
      description: 'Уведомления об аренде на базе ИИ для более чем 1500 источников. Никогда не пропускайте объявление. Доверие более 10000 арендаторов в Нидерландах.',
      locale: 'ru_RU',
    },
    'zh-CN': {
      title: 'Uprent Plus - 15秒找到您的荷兰租房',
      description: 'AI驱动的租赁提醒，覆盖1500+房源。再也不会错过房源。荷兰超过10000名租房者信赖。',
      locale: 'zh_CN',
    },
    'ja': {
      title: 'Uprent Plus - 15秒でオランダの賃貸物件を見つける',
      description: '1,500以上のソースに対応したAI駆動の賃貸アラート。物件を見逃すことはありません。オランダで10,000人以上の入居者に信頼されています。',
      locale: 'ja_JP',
    },
    'de': {
      title: 'Uprent Plus - Finden Sie Ihre niederländische Miete in 15 Sekunden',
      description: 'KI-gestützte Mietbenachrichtigungen für über 1.500 Quellen. Verpassen Sie keine Anzeige mehr. Vertrauenswürdig für über 10.000 Mieter in den Niederlanden.',
      locale: 'de_DE',
    },
    'it': {
      title: 'Uprent Plus - Trova il tuo affitto olandese in 15 secondi',
      description: 'Avvisi di affitto alimentati dall\'IA per oltre 1.500 fonti. Non perdere mai un annuncio. Fidato da oltre 10.000 inquilini nei Paesi Bassi.',
      locale: 'it_IT',
    },
    'es': {
      title: 'Uprent Plus - Encuentra tu alquiler holandés en 15 segundos',
      description: 'Alertas de alquiler impulsadas por IA para más de 1.500 fuentes. Nunca te pierdas un anuncio. Confiado por más de 10.000 inquilinos en los Países Bajos.',
      locale: 'es_ES',
    },
    'pl': {
      title: 'Uprent Plus - Znajdź swoją holenderską wynajmowaną nieruchomość w 15 sekund',
      description: 'Alerty o wynajmie napędzane przez AI dla ponad 1500 źródeł. Nigdy nie przegapisz oferty. Zaufane przez ponad 10 000 najemców w Holandii.',
      locale: 'pl_PL',
    },
    'fr': {
      title: 'Uprent Plus - Trouvez votre location néerlandaise en 15 secondes',
      description: 'Alertes de location alimentées par l\'IA pour plus de 1 500 sources. Ne manquez jamais une annonce. Fiable pour plus de 10 000 locataires aux Pays-Bas.',
      locale: 'fr_FR',
    },
    'pt': {
      title: 'Uprent Plus - Encontre seu aluguel holandês em 15 segundos',
      description: 'Alertas de aluguel alimentados por IA para mais de 1.500 fontes. Nunca perca um anúncio. Confiável para mais de 10.000 inquilinos na Holanda.',
      locale: 'pt_PT',
    },
    'ko': {
      title: 'Uprent Plus - 15초 안에 네덜란드 임대주택 찾기',
      description: '1,500개 이상의 소스에 대한 AI 기반 임대 알림. 더 이상 공지를 놓치지 마세요. 네덜란드에서 10,000명 이상의 임차인에게 신뢰받고 있습니다.',
      locale: 'ko_KR',
    },
    'tr': {
      title: 'Uprent Plus - 15 saniyede Hollanda kiralık evinizi bulun',
      description: '1.500\'den fazla kaynak için AI destekli kiralama uyarıları. Hiçbir ilanı kaçırmayın. Hollanda\'da 10.000\'den fazla kiracı tarafından güveniliyor.',
      locale: 'tr_TR',
    },
    'vi': {
      title: 'Uprent Plus - Tìm nhà cho thuê Hà Lan của bạn trong 15 giây',
      description: 'Cảnh báo cho thuê được hỗ trợ bởi AI cho hơn 1.500 nguồn. Không bao giờ bỏ lỡ một danh sách. Được tin cậy bởi hơn 10.000 người thuê ở Hà Lan.',
      locale: 'vi_VN',
    },
    'th': {
      title: 'Uprent Plus - หาบ้านเช่าในเนเธอร์แลนด์ของคุณใน 15 วินาที',
      description: 'การแจ้งเตือนการเช่าที่ขับเคลื่อนด้วย AI สำหรับแหล่งข้อมูลมากกว่า 1,500 แหล่ง ไม่พลาดรายชื่อใดๆ ไว้วางใจจากผู้เช่ามากกว่า 10,000 คนในเนเธอร์แลนด์',
      locale: 'th_TH',
    },
    'id': {
      title: 'Uprent Plus - Temukan sewa Belanda Anda dalam 15 detik',
      description: 'Peringatan sewa yang didukung AI untuk lebih dari 1.500 sumber. Jangan pernah melewatkan daftar. Dipercaya oleh lebih dari 10.000 penyewa di Belanda.',
      locale: 'id_ID',
    },
    'hi': {
      title: 'Uprent Plus - 15 सेकंड में अपना डच किराया खोजें',
      description: '1,500+ स्रोतों के लिए AI-संचालित किराया सूचनाएं। कभी भी सूची से चूकें नहीं। नीदरलैंड में 10,000+ किरायेदारों द्वारा भरोसेमंद।',
      locale: 'hi_IN',
    },
    'sv': {
      title: 'Uprent Plus - Hitta din nederländska hyresrätt på 15 sekunder',
      description: 'AI-drivna hyresvarningar för över 1.500 källor. Missa aldrig en annons. Förtroende av över 10.000 hyresgäster i Nederländerna.',
      locale: 'sv_SE',
    },
    'no': {
      title: 'Uprent Plus - Finn din nederlandske leie på 15 sekunder',
      description: 'AI-drevne leievarsler for over 1.500 kilder. Gå aldri glipp av en annonse. Stolt på av over 10.000 leietakere i Nederland.',
      locale: 'no_NO',
    },
    'da': {
      title: 'Uprent Plus - Find din hollandske lejebolig på 15 sekunder',
      description: 'AI-drevne lejevarsler for over 1.500 kilder. Gå aldrig glip af en annonce. Betroet af over 10.000 lejere i Holland.',
      locale: 'da_DK',
    },
    'fi': {
      title: 'Uprent Plus - Löydä hollantilainen vuokrasi 15 sekunnissa',
      description: 'AI-pohjaiset vuokravaroitukset yli 1 500 lähteestä. Älä koskaan missaa listaa. Luotettu yli 10 000 vuokralaiselle Alankomaissa.',
      locale: 'fi_FI',
    },
    'cs': {
      title: 'Uprent Plus - Najděte svůj nizozemský pronájem za 15 sekund',
      description: 'AI poháněná upozornění na pronájmy pro více než 1 500 zdrojů. Nikdy nezmeškejte nabídku. Důvěryhodné pro více než 10 000 nájemníků v Nizozemsku.',
      locale: 'cs_CZ',
    },
    'ro': {
      title: 'Uprent Plus - Găsește-ți chiria olandeză în 15 secunde',
      description: 'Alerte de închiriere alimentate de AI pentru peste 1.500 de surse. Nu rata niciodată o listare. De încredere pentru peste 10.000 de chiriași din Olanda.',
      locale: 'ro_RO',
    },
    'hu': {
      title: 'Uprent Plus - Találd meg holland bérlésed 15 másodperc alatt',
      description: 'AI által működtetett bérlési figyelmeztetések több mint 1500 forrásra. Soha ne hagyj ki egy hirdetést sem. Több mint 10 000 bérlő bízik benne Hollandiában.',
      locale: 'hu_HU',
    },
    'el': {
      title: 'Uprent Plus - Βρείτε το ολλανδικό σας ενοίκιο σε 15 δευτερόλεπτα',
      description: 'Ειδοποιήσεις ενοικίασης με τεχνητή νοημοσύνη για περισσότερες από 1.500 πηγές. Ποτέ μην χάσετε μια αγγελία. Αξιόπιστο για περισσότερους από 10.000 ενοικιαστές στην Ολλανδία.',
      locale: 'el_GR',
    },
  };

  return metadataMap[lang] || {
    title: 'Uprent Plus - Find Your Dutch Rental in 15 Seconds',
    description: 'AI-powered rental alerts for 1,500+ sources. Never miss a listing again. Trusted by 10,000+ renters in the Netherlands.',
    locale: 'en_US',
  };
};

