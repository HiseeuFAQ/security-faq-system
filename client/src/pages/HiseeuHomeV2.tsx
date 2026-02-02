import { useState, useMemo } from "react";
import { useHiseeuLanguage } from "@/contexts/HiseeuLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Hiseeu Logo SVG Component
const HiseeuLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="4" fill="#1e40af"/>
    <text x="16" y="22" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial">H</text>
  </svg>
);

interface FAQItem {
  id: string;
  product: "wireless" | "wired" | "eseries";
  scenario: "home" | "commercial" | "industrial";
  type: "b2c" | "b2b";
  question: Record<string, string>;
  answer: Record<string, string>;
  image?: string;
}

// Sample comprehensive FAQ data
const HISEEU_FAQ_DATA: FAQItem[] = [
  // Wireless - Home - B2C
  {
    id: "w-h-b2c-1",
    product: "wireless",
    scenario: "home",
    type: "b2c",
    question: {
      en: "How do I set up my wireless camera?",
      zh: "我如何设置无线摄像头？",
      es: "¿Cómo configuro mi cámara inalámbrica?",
      fr: "Comment configurer ma caméra sans fil?",
      de: "Wie richte ich meine kabellose Kamera ein?",
      ru: "Как настроить беспроводную камеру?"
    },
    answer: {
      en: "1. Download the Hiseeu app from App Store or Google Play\n2. Create an account and log in\n3. Click '+' to add device\n4. Scan the QR code on the camera\n5. Connect to your WiFi network\n6. Wait for connection to complete",
      zh: "1. 从应用商店或谷歌商店下载 Hiseeu 应用\n2. 创建账户并登录\n3. 点击 '+' 添加设备\n4. 扫描摄像头上的二维码\n5. 连接到您的 WiFi 网络\n6. 等待连接完成",
      es: "1. Descargue la aplicación Hiseeu desde App Store o Google Play\n2. Cree una cuenta e inicie sesión\n3. Haga clic en '+' para agregar dispositivo\n4. Escanee el código QR en la cámara\n5. Conéctese a su red WiFi\n6. Espere a que se complete la conexión",
      fr: "1. Téléchargez l'application Hiseeu depuis l'App Store ou Google Play\n2. Créez un compte et connectez-vous\n3. Cliquez sur '+' pour ajouter un appareil\n4. Scannez le code QR sur la caméra\n5. Connectez-vous à votre réseau WiFi\n6. Attendez la fin de la connexion",
      de: "1. Laden Sie die Hiseeu-App aus dem App Store oder Google Play herunter\n2. Erstellen Sie ein Konto und melden Sie sich an\n3. Klicken Sie auf '+', um ein Gerät hinzuzufügen\n4. Scannen Sie den QR-Code auf der Kamera\n5. Verbinden Sie sich mit Ihrem WiFi-Netzwerk\n6. Warten Sie auf den Abschluss der Verbindung",
      ru: "1. Загрузите приложение Hiseeu из App Store или Google Play\n2. Создайте учетную запись и войдите\n3. Нажмите '+' для добавления устройства\n4. Отсканируйте QR-код на камере\n5. Подключитесь к сети WiFi\n6. Дождитесь завершения подключения"
    }
  },
  {
    id: "w-h-b2c-2",
    product: "wireless",
    scenario: "home",
    type: "b2c",
    question: {
      en: "Why is my camera offline?",
      zh: "为什么我的摄像头离线？",
      es: "¿Por qué mi cámara está desconectada?",
      fr: "Pourquoi ma caméra est-elle hors ligne?",
      de: "Warum ist meine Kamera offline?",
      ru: "Почему моя камера отключена?"
    },
    answer: {
      en: "Common reasons:\n1. WiFi connection lost - Check your WiFi signal\n2. Camera power off - Ensure camera is powered on\n3. Router issue - Restart your router\n4. Too far from router - Move camera closer to WiFi\n5. Firewall blocking - Check firewall settings\n\nSolution: Restart the camera and reconnect to WiFi.",
      zh: "常见原因：\n1. WiFi 连接丢失 - 检查 WiFi 信号\n2. 摄像头关闭 - 确保摄像头已打开\n3. 路由器问题 - 重启路由器\n4. 距离路由器太远 - 将摄像头移近 WiFi\n5. 防火墙阻止 - 检查防火墙设置\n\n解决方案：重启摄像头并重新连接到 WiFi。",
      es: "Razones comunes:\n1. Conexión WiFi perdida - Verifique la señal WiFi\n2. Cámara apagada - Asegúrese de que la cámara esté encendida\n3. Problema del enrutador - Reinicie su enrutador\n4. Demasiado lejos del enrutador - Acerque la cámara al WiFi\n5. Firewall bloqueando - Verifique la configuración del firewall\n\nSolución: Reinicie la cámara y reconéctese a WiFi.",
      fr: "Raisons courantes:\n1. Connexion WiFi perdue - Vérifiez le signal WiFi\n2. Caméra éteinte - Assurez-vous que la caméra est allumée\n3. Problème de routeur - Redémarrez votre routeur\n4. Trop loin du routeur - Rapprochez la caméra du WiFi\n5. Pare-feu bloquant - Vérifiez les paramètres du pare-feu\n\nSolution: Redémarrez la caméra et reconnectez-vous au WiFi.",
      de: "Häufige Gründe:\n1. WiFi-Verbindung verloren - Überprüfen Sie das WiFi-Signal\n2. Kamera ausgeschaltet - Stellen Sie sicher, dass die Kamera eingeschaltet ist\n3. Routerproblem - Starten Sie Ihren Router neu\n4. Zu weit vom Router entfernt - Bringen Sie die Kamera näher an WiFi\n5. Firewall blockiert - Überprüfen Sie die Firewall-Einstellungen\n\nLösung: Starten Sie die Kamera neu und verbinden Sie sich erneut mit WiFi.",
      ru: "Распространенные причины:\n1. Потеря соединения WiFi - Проверьте сигнал WiFi\n2. Камера выключена - Убедитесь, что камера включена\n3. Проблема маршрутизатора - Перезагрузите маршрутизатор\n4. Слишком далеко от маршрутизатора - Переместите камеру ближе к WiFi\n5. Брандмауэр блокирует - Проверьте параметры брандмауэра\n\nРешение: перезагрузите камеру и переподключитесь к WiFi."
    }
  },
  // Wireless - Commercial - B2B
  {
    id: "w-c-b2b-1",
    product: "wireless",
    scenario: "commercial",
    type: "b2b",
    question: {
      en: "What is the bulk purchasing process?",
      zh: "批量采购流程是什么？",
      es: "¿Cuál es el proceso de compra a granel?",
      fr: "Quel est le processus d'achat en gros?",
      de: "Was ist der Großeinkaufsprozess?",
      ru: "Каков процесс массовой покупки?"
    },
    answer: {
      en: "1. Submit your requirements (quantity, models, specifications)\n2. Our sales team will provide a quotation within 24 hours\n3. Negotiate terms and pricing\n4. Sign purchase agreement\n5. Arrange payment and delivery\n6. Quality inspection and shipment\n\nMinimum order: 50 units. Volume discounts available.",
      zh: "1. 提交您的需求（数量、型号、规格）\n2. 我们的销售团队将在 24 小时内提供报价\n3. 协商条款和价格\n4. 签署采购协议\n5. 安排付款和交付\n6. 质量检查和发货\n\n最小订单：50 台。可提供批量折扣。",
      es: "1. Envíe sus requisitos (cantidad, modelos, especificaciones)\n2. Nuestro equipo de ventas proporcionará una cotización en 24 horas\n3. Negocie términos y precios\n4. Firme acuerdo de compra\n5. Organice el pago y la entrega\n6. Inspección de calidad y envío\n\nPedido mínimo: 50 unidades. Descuentos por volumen disponibles.",
      fr: "1. Soumettez vos exigences (quantité, modèles, spécifications)\n2. Notre équipe de vente fournira un devis dans les 24 heures\n3. Négociez les conditions et les prix\n4. Signez l'accord d'achat\n5. Organisez le paiement et la livraison\n6. Inspection de qualité et expédition\n\nCommande minimale: 50 unités. Remises sur volume disponibles.",
      de: "1. Reichen Sie Ihre Anforderungen ein (Menge, Modelle, Spezifikationen)\n2. Unser Verkaufsteam stellt innerhalb von 24 Stunden ein Angebot bereit\n3. Verhandeln Sie Bedingungen und Preise\n4. Unterzeichnen Sie Kaufvereinbarung\n5. Zahlung und Lieferung arrangieren\n6. Qualitätsprüfung und Versand\n\nMindestbestellung: 50 Einheiten. Mengenrabatte verfügbar.",
      ru: "1. Отправьте свои требования (количество, модели, спецификации)\n2. Наша команда продаж предоставит расценку в течение 24 часов\n3. Согласуйте условия и цены\n4. Подпишите соглашение о покупке\n5. Организуйте платеж и доставку\n6. Проверка качества и отправка\n\nМинимальный заказ: 50 единиц. Доступны скидки на объем."
    }
  },
  // Wired - Home - B2C
  {
    id: "wd-h-b2c-1",
    product: "wired",
    scenario: "home",
    type: "b2c",
    question: {
      en: "How do I install a wired camera?",
      zh: "我如何安装有线摄像头？",
      es: "¿Cómo instalo una cámara con cable?",
      fr: "Comment installer une caméra filaire?",
      de: "Wie installiere ich eine kabelgebundene Kamera?",
      ru: "Как установить проводную камеру?"
    },
    answer: {
      en: "1. Choose installation location (wall or ceiling)\n2. Run ethernet cable from camera to DVR/NVR\n3. Connect power adapter to camera\n4. Connect DVR/NVR to monitor and power\n5. Configure network settings\n6. Test video feed\n\nRecommended: Use CAT6 cable for better performance.",
      zh: "1. 选择安装位置（墙壁或天花板）\n2. 从摄像头运行以太网电缆到 DVR/NVR\n3. 将电源适配器连接到摄像头\n4. 将 DVR/NVR 连接到显示器和电源\n5. 配置网络设置\n6. 测试视频源\n\n建议：使用 CAT6 电缆以获得更好的性能。",
      es: "1. Elija la ubicación de instalación (pared o techo)\n2. Ejecute cable ethernet desde la cámara a DVR/NVR\n3. Conecte el adaptador de corriente a la cámara\n4. Conecte DVR/NVR al monitor y la corriente\n5. Configure los ajustes de red\n6. Pruebe la transmisión de video\n\nRecomendado: Use cable CAT6 para mejor rendimiento.",
      fr: "1. Choisissez l'emplacement d'installation (mur ou plafond)\n2. Exécutez le câble ethernet de la caméra au DVR/NVR\n3. Connectez l'adaptateur d'alimentation à la caméra\n4. Connectez DVR/NVR au moniteur et à l'alimentation\n5. Configurez les paramètres réseau\n6. Testez le flux vidéo\n\nRecommandé: Utilisez un câble CAT6 pour de meilleures performances.",
      de: "1. Wählen Sie den Installationsort (Wand oder Decke)\n2. Führen Sie Ethernet-Kabel von der Kamera zum DVR/NVR\n3. Verbinden Sie das Netzteil mit der Kamera\n4. Verbinden Sie DVR/NVR mit Monitor und Stromversorgung\n5. Konfigurieren Sie die Netzwerkeinstellungen\n6. Testen Sie den Videofeed\n\nEmpfohlen: Verwenden Sie CAT6-Kabel für bessere Leistung.",
      ru: "1. Выберите место установки (стена или потолок)\n2. Проложите кабель Ethernet от камеры к DVR/NVR\n3. Подключите адаптер питания к камере\n4. Подключите DVR/NVR к монитору и питанию\n5. Настройте параметры сети\n6. Протестируйте видеопоток\n\nРекомендуется: используйте кабель CAT6 для лучшей производительности."
    }
  },
  // E-Series - Industrial - B2B
  {
    id: "es-i-b2b-1",
    product: "eseries",
    scenario: "industrial",
    type: "b2b",
    question: {
      en: "What are the technical specifications for E-Series industrial cameras?",
      zh: "E 系列工业摄像头的技术规格是什么？",
      es: "¿Cuáles son las especificaciones técnicas de las cámaras industriales de la serie E?",
      fr: "Quelles sont les spécifications techniques des caméras industrielles de la série E?",
      de: "Was sind die technischen Spezifikationen für E-Series-Industriekameras?",
      ru: "Каковы технические характеристики промышленных камер серии E?"
    },
    answer: {
      en: "E-Series Specifications:\n- Resolution: 4K (8MP) to 12MP\n- Frame Rate: 30fps @ 4K, 60fps @ 1080p\n- Night Vision: Up to 100m IR range\n- Weatherproof: IP67 rated\n- Operating Temperature: -40°C to +60°C\n- Storage: Up to 4TB internal\n- Connectivity: PoE, WiFi, 4G LTE\n- ONVIF compliant\n\nIdeal for harsh industrial environments.",
      zh: "E 系列规格：\n- 分辨率：4K (8MP) 至 12MP\n- 帧率：4K @ 30fps，1080p @ 60fps\n- 夜视：红外范围达 100 米\n- 防水：IP67 等级\n- 工作温度：-40°C 至 +60°C\n- 存储：内部最多 4TB\n- 连接：PoE、WiFi、4G LTE\n- ONVIF 兼容\n\n适合恶劣的工业环境。",
      es: "Especificaciones de la serie E:\n- Resolución: 4K (8MP) a 12MP\n- Velocidad de fotogramas: 30fps @ 4K, 60fps @ 1080p\n- Visión nocturna: Rango IR de hasta 100m\n- A prueba de agua: Clasificación IP67\n- Temperatura de funcionamiento: -40°C a +60°C\n- Almacenamiento: Hasta 4TB interno\n- Conectividad: PoE, WiFi, 4G LTE\n- Compatible con ONVIF\n\nIdeal para entornos industriales severos.",
      fr: "Spécifications de la série E:\n- Résolution: 4K (8MP) à 12MP\n- Fréquence d'images: 30fps @ 4K, 60fps @ 1080p\n- Vision nocturne: Portée IR jusqu'à 100m\n- Étanche: Classement IP67\n- Température de fonctionnement: -40°C à +60°C\n- Stockage: Jusqu'à 4TB interne\n- Connectivité: PoE, WiFi, 4G LTE\n- Compatible ONVIF\n\nIdéal pour les environnements industriels difficiles.",
      de: "E-Series-Spezifikationen:\n- Auflösung: 4K (8MP) bis 12MP\n- Bildrate: 30fps @ 4K, 60fps @ 1080p\n- Nachtsicht: IR-Reichweite bis 100m\n- Wasserdicht: IP67-Bewertung\n- Betriebstemperatur: -40°C bis +60°C\n- Speicher: Bis zu 4TB intern\n- Konnektivität: PoE, WiFi, 4G LTE\n- ONVIF-kompatibel\n\nIdeal für raue Industrieumgebungen.",
      ru: "Спецификации серии E:\n- Разрешение: 4K (8MP) до 12MP\n- Частота кадров: 30fps @ 4K, 60fps @ 1080p\n- Ночное видение: Дальность ИК до 100 м\n- Водонепроницаемость: Рейтинг IP67\n- Рабочая температура: -40°C до +60°C\n- Хранилище: До 4 ТБ внутреннего\n- Подключение: PoE, WiFi, 4G LTE\n- Совместимость ONVIF\n\nИдеально для суровых промышленных сред."
    }
  }
];

export default function HiseeuHomeV2() {
  const { language, setLanguage, t } = useHiseeuLanguage();
  const [selectedProduct, setSelectedProduct] = useState<"wireless" | "wired" | "eseries" | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<"home" | "commercial" | "industrial" | null>(null);
  const [selectedType, setSelectedType] = useState<"b2c" | "b2b" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "ru", label: "Русский" }
  ];

  const products = [
    { id: "wireless", label: { en: "Wireless Series", zh: "无线系列", es: "Serie Inalámbrica", fr: "Série Sans Fil", de: "Wireless-Serie", ru: "Беспроводная серия" } },
    { id: "wired", label: { en: "Wired Series", zh: "有线系列", es: "Serie Cableada", fr: "Série Filaire", de: "Kabelgebundene Serie", ru: "Проводная серия" } },
    { id: "eseries", label: { en: "E-Series", zh: "E 系列", es: "Serie E", fr: "Série E", de: "E-Serie", ru: "Серия E" } }
  ];

  const scenarios = [
    { id: "home", label: { en: "Home", zh: "家用", es: "Hogar", fr: "Maison", de: "Zuhause", ru: "Дом" }, type: "b2c" },
    { id: "commercial", label: { en: "Commercial", zh: "商业", es: "Comercial", fr: "Commercial", de: "Kommerziell", ru: "Коммерческий" }, type: "b2b" },
    { id: "industrial", label: { en: "Industrial", zh: "行业", es: "Industrial", fr: "Industriel", de: "Industriell", ru: "Промышленный" }, type: "b2b" }
  ];

  const filteredFAQs = useMemo(() => {
    return HISEEU_FAQ_DATA.filter(faq => {
      const matchProduct = !selectedProduct || faq.product === selectedProduct;
      const matchScenario = !selectedScenario || faq.scenario === selectedScenario;
      const matchType = !selectedType || faq.type === selectedType;
      const matchSearch = !searchQuery || 
        faq.question[language as keyof typeof faq.question]?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchProduct && matchScenario && matchType && matchSearch;
    });
  }, [selectedProduct, selectedScenario, selectedType, searchQuery, language]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <HiseeuLogo />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Hiseeu FAQ</h1>
                <p className="text-sm text-gray-600">{t("header.subtitle")}</p>
              </div>
            </div>

            {/* Desktop Language Switcher */}
            <div className="hidden md:flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={cn(
                    "px-3 py-2 rounded text-sm font-medium transition-colors",
                    language === lang.code
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Hiseeu Official Website Button */}
            <Button
              onClick={() => window.open("https://www.hiseeu.com/", "_blank")}
              className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t("header.officialWebsite")}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3 pb-4">
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "px-3 py-2 rounded text-sm font-medium transition-colors",
                      language === lang.code
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => {
                  window.open("https://www.hiseeu.com/", "_blank");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("header.officialWebsite")}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Product Filter */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t("sidebar.products")}</h3>
                <div className="space-y-2">
                  {products.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id as any)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-lg transition-colors",
                        selectedProduct === product.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {product.label[language as keyof typeof product.label]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenario Filter */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t("sidebar.scenarios")}</h3>
                <div className="space-y-2">
                  {scenarios.map(scenario => (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id as any);
                        setSelectedType(scenario.type as any);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-lg transition-colors",
                        selectedScenario === scenario.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {scenario.label[language as keyof typeof scenario.label]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedProduct || selectedScenario) && (
                <Button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedScenario(null);
                    setSelectedType(null);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  {t("sidebar.clearFilters")}
                </Button>
              )}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">{t("faq.noResults")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {faq.question[language as keyof typeof faq.question]}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-gray-600 transition-transform",
                          expandedId === faq.id && "rotate-180"
                        )}
                      />
                    </button>

                    {expandedId === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="prose prose-sm max-w-none">
                          {faq.answer[language as keyof typeof faq.answer]?.split("\n").map((line, idx) => (
                            <p key={idx} className="text-gray-700 mb-2">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">{t("footer.aboutHiseeu")}</h4>
              <p className="text-gray-400 text-sm">
                {t("footer.description")}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.contact")}</h4>
              <p className="text-gray-400 text-sm">Email: sales@hiseeu.com</p>
              <p className="text-gray-400 text-sm">Website: https://www.hiseeu.com/</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t("footer.browserSupport")}</h4>
              <p className="text-gray-400 text-sm">
                {t("footer.supportText")}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Hiseeu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
