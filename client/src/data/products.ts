// Product data for Hiseeu FAQ system
// Three product series: X-Series, Y-Series, E-Series

export interface ProductSpec {
  key: string;
  value: {
    en: string;
    zh: string;
  };
}

export interface ProductAdvantage {
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  icon: string;
}

export interface Product {
  id: string;
  model: string;
  name: {
    en: string;
    zh: string;
  };
  series: "x" | "y" | "e";
  type: "camera" | "nvr" | "accessory";
  image?: string;
  summary: {
    en: string;
    zh: string;
  };
  advantages: ProductAdvantage[];
  specs: ProductSpec[];
}

export interface ProductSeries {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  icon: string;
  products: Product[];
}

// E-Series Products
const eSeriesProducts: Product[] = [
  {
    id: "c20",
    model: "C20",
    name: {
      en: "4MP Wireless Battery Camera",
      zh: "4MP 无线电池摄像头",
    },
    series: "e",
    type: "camera",
    summary: {
      en: "Fully wireless design with 6-month battery life, 4MP crystal-clear resolution, and smart human detection. Perfect for flexible outdoor monitoring without any wiring hassle.",
      zh: "全无线设计，电池续航长达6个月，4MP超清分辨率，智能人形检测。无需布线，灵活部署户外监控。",
    },
    advantages: [
      {
        title: { en: "Ultra-Long Battery Life", zh: "超长电池续航" },
        description: {
          en: "Built-in 5200mAh rechargeable battery provides up to 6 months of normal operation and 12 months standby. Solar panel compatible for unlimited runtime.",
          zh: "内置5200mAh可充电电池，正常使用可达6个月，待机长达12个月。支持太阳能板供电，续航无忧。",
        },
        icon: "battery",
      },
      {
        title: { en: "4MP Crystal Clear", zh: "4MP超清画质" },
        description: {
          en: "2560×1440 high-definition resolution captures every detail. 7m infrared night vision with optional color night vision for 24/7 clear monitoring.",
          zh: "2560×1440高清分辨率，细节纤毫毕现。7米红外夜视，可选彩色夜视，全天候清晰监控。",
        },
        icon: "video",
      },
      {
        title: { en: "Smart Detection", zh: "智能检测" },
        description: {
          en: "AI-powered human detection reduces false alarms from animals or moving objects. Instant push notifications to your phone.",
          zh: "AI人形检测，有效过滤动物或物体移动的误报。即时推送告警到手机。",
        },
        icon: "brain",
      },
      {
        title: { en: "Easy Installation", zh: "便捷安装" },
        description: {
          en: "Completely wireless with no cables needed. IP65 weatherproof design. Universal 1/4\" screw mount for flexible placement.",
          zh: "完全无线，无需布线。IP65防尘防水设计。1/4\"通用螺丝孔，安装位置灵活。",
        },
        icon: "tool",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "4MP (2560×1440)", zh: "4MP (2560×1440)" } },
      { key: "Battery", value: { en: "5200mAh, 6 months runtime", zh: "5200mAh，续航6个月" } },
      { key: "Night Vision", value: { en: "7m IR / Color night vision", zh: "7米红外/彩色夜视" } },
      { key: "WiFi", value: { en: "2.4GHz/5.8GHz dual-band", zh: "2.4GHz/5.8GHz双频" } },
      { key: "Storage", value: { en: "Cloud / MicroSD up to 256GB", zh: "云存储/MicroSD最大256GB" } },
      { key: "Protection", value: { en: "IP65 weatherproof", zh: "IP65防尘防水" } },
    ],
  },
  {
    id: "c90",
    model: "C90",
    name: {
      en: "4MP AI Intrusion Detection Battery Camera",
      zh: "4MP AI入侵检测电池摄像头",
    },
    series: "e",
    type: "camera",
    summary: {
      en: "Advanced AI detection for humans, vehicles, pets, and packages. Compact design with powerful features for comprehensive outdoor security.",
      zh: "先进AI检测，识别人形、车辆、宠物和包裹。紧凑设计，功能强大，全面户外安防。",
    },
    advantages: [
      {
        title: { en: "Multi-Object AI Detection", zh: "多目标AI检测" },
        description: {
          en: "Detects humans, vehicles, pets, and packages with premium AI services. Dramatically reduces false alarms while ensuring no important events are missed.",
          zh: "检测人形、车辆、宠物和包裹（需开通高级服务）。大幅减少误报，确保不遗漏重要事件。",
        },
        icon: "scan",
      },
      {
        title: { en: "4MP Wide-Angle View", zh: "4MP广角视野" },
        description: {
          en: "138° diagonal field of view covers more area. 2560×1440 resolution ensures clear identification of faces and license plates.",
          zh: "138°对角线视野，覆盖更大范围。2560×1440分辨率，人脸和车牌清晰可辨。",
        },
        icon: "eye",
      },
      {
        title: { en: "Two-Way Audio", zh: "双向语音" },
        description: {
          en: "Built-in microphone and speaker with echo cancellation. Communicate with visitors or deter intruders remotely.",
          zh: "内置麦克风和扬声器，支持回声消除。远程与访客对话或威慑入侵者。",
        },
        icon: "mic",
      },
      {
        title: { en: "Compact & Durable", zh: "紧凑耐用" },
        description: {
          en: "Ultra-compact 59×60×91mm design. IP65 weatherproof rating withstands rain, snow, and extreme temperatures.",
          zh: "超紧凑59×60×91mm设计。IP65防护等级，耐受雨雪和极端温度。",
        },
        icon: "shield",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "4MP (2560×1440)", zh: "4MP (2560×1440)" } },
      { key: "Field of View", value: { en: "138° diagonal", zh: "138°对角线" } },
      { key: "AI Detection", value: { en: "Human/Vehicle/Pet/Package", zh: "人形/车辆/宠物/包裹" } },
      { key: "Night Vision", value: { en: "7m IR / White light", zh: "7米红外/白光" } },
      { key: "Storage", value: { en: "Cloud / MicroSD up to 128GB", zh: "云存储/MicroSD最大128GB" } },
      { key: "Dimensions", value: { en: "59×60×91mm", zh: "59×60×91mm" } },
    ],
  },
  {
    id: "tz-hby08",
    model: "TZ-HBY08",
    name: {
      en: "4K PTZ Dual-Band WiFi Camera",
      zh: "4K云台双频WiFi摄像头",
    },
    series: "e",
    type: "camera",
    summary: {
      en: "4K ultra-HD resolution with 270° pan and 90° tilt coverage. Dual-band WiFi ensures stable transmission even in complex environments.",
      zh: "4K超高清分辨率，270°水平+90°垂直旋转覆盖。双频WiFi确保复杂环境下稳定传输。",
    },
    advantages: [
      {
        title: { en: "4K Ultra-HD Quality", zh: "4K超高清画质" },
        description: {
          en: "3840×2160 resolution delivers 4x the detail of 1080P. Capture license plates, faces, and fine details with exceptional clarity.",
          zh: "3840×2160分辨率，清晰度是1080P的4倍。车牌、人脸、细节纤毫毕现。",
        },
        icon: "video",
      },
      {
        title: { en: "Full PTZ Coverage", zh: "全方位云台覆盖" },
        description: {
          en: "270° horizontal and 90° vertical rotation covers every corner. Remote control via app for real-time tracking.",
          zh: "270°水平+90°垂直旋转，覆盖每个角落。APP远程控制，实时追踪。",
        },
        icon: "rotate",
      },
      {
        title: { en: "Dual-Band WiFi", zh: "双频WiFi" },
        description: {
          en: "2.4GHz/5.8GHz dual-band operation minimizes interference. Compatible with WiFi 4/5/6 for maximum flexibility.",
          zh: "2.4GHz/5.8GHz双频运行，最小化干扰。兼容WiFi 4/5/6，灵活性最大化。",
        },
        icon: "wifi",
      },
      {
        title: { en: "Smart Night Vision", zh: "智能夜视" },
        description: {
          en: "Dual-light design with IR and white light. Auto-switch between modes for optimal visibility up to 15 meters.",
          zh: "红外+白光双光源设计。自动切换模式，夜视距离达15米。",
        },
        icon: "moon",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "4K (3840×2160)", zh: "4K (3840×2160)" } },
      { key: "PTZ Range", value: { en: "Pan 270° / Tilt 90°", zh: "水平270° / 垂直90°" } },
      { key: "WiFi", value: { en: "2.4GHz/5.8GHz dual-band", zh: "2.4GHz/5.8GHz双频" } },
      { key: "Night Vision", value: { en: "15m dual-light", zh: "15米双光源" } },
      { key: "Storage", value: { en: "TF card up to 256GB + NVR", zh: "TF卡最大256GB + NVR" } },
      { key: "Protection", value: { en: "IP65", zh: "IP65" } },
    ],
  },
  {
    id: "tz-nvr10ca",
    model: "TZ-NVR10CA",
    name: {
      en: "10-Channel Wireless NVR with Display",
      zh: "10通道无线NVR带显示屏",
    },
    series: "e",
    type: "nvr",
    summary: {
      en: "All-in-one NVR with built-in display and touch interface. Supports 10 cameras, dual storage options, and remote viewing.",
      zh: "一体化NVR，内置显示屏和触控界面。支持10路摄像头，双存储选项，远程查看。",
    },
    advantages: [
      {
        title: { en: "Built-in Display", zh: "内置显示屏" },
        description: {
          en: "MIPI display interface with 6-pin capacitive touch. View live feeds and playback without external monitor.",
          zh: "MIPI显示接口，6针电容触控。无需外接显示器即可查看实时画面和回放。",
        },
        icon: "monitor",
      },
      {
        title: { en: "10-Channel Capacity", zh: "10通道容量" },
        description: {
          en: "Connect up to 10 IP cameras. Supports resolutions from 720P to 8MP for flexible system configuration.",
          zh: "最多连接10路IP摄像头。支持720P至8MP分辨率，系统配置灵活。",
        },
        icon: "grid",
      },
      {
        title: { en: "Dual Storage", zh: "双存储" },
        description: {
          en: "SD card slot (up to 256GB) plus HDD bay (up to 8TB). Cloud storage option for off-site backup.",
          zh: "SD卡槽（最大256GB）+硬盘位（最大8TB）。云存储选项用于异地备份。",
        },
        icon: "database",
      },
      {
        title: { en: "Remote Access", zh: "远程访问" },
        description: {
          en: "Multi-channel remote monitoring via mobile and PC. Online upgrades for NVR and connected cameras.",
          zh: "手机和PC多通道远程监控。NVR和摄像头在线升级。",
        },
        icon: "globe",
      },
    ],
    specs: [
      { key: "Channels", value: { en: "10 IP cameras", zh: "10路IP摄像头" } },
      { key: "Resolution", value: { en: "Up to 8MP", zh: "最高8MP" } },
      { key: "Storage", value: { en: "SD 256GB + HDD 8TB", zh: "SD 256GB + HDD 8TB" } },
      { key: "Output", value: { en: "HDMI 4K@30Hz", zh: "HDMI 4K@30Hz" } },
      { key: "WiFi", value: { en: "2.4GHz/5.8GHz", zh: "2.4GHz/5.8GHz" } },
      { key: "Power", value: { en: "DC 12V 2A", zh: "DC 12V 2A" } },
    ],
  },
  {
    id: "tz-nvr10s",
    model: "TZ-NVR10S",
    name: {
      en: "10-Channel Compact Wireless NVR",
      zh: "10通道紧凑型无线NVR",
    },
    series: "e",
    type: "nvr",
    summary: {
      en: "Compact NVR design for space-efficient installation. Full wireless connectivity with reliable recording capabilities.",
      zh: "紧凑型NVR设计，节省安装空间。全无线连接，可靠录像功能。",
    },
    advantages: [
      {
        title: { en: "Space-Saving Design", zh: "节省空间设计" },
        description: {
          en: "Compact form factor fits anywhere. Perfect for small businesses, apartments, or home offices.",
          zh: "紧凑外形，适合任何空间。小型企业、公寓或家庭办公室的理想选择。",
        },
        icon: "box",
      },
      {
        title: { en: "Wireless Freedom", zh: "无线自由" },
        description: {
          en: "Full wireless connectivity eliminates cable clutter. Easy setup with QR code pairing.",
          zh: "全无线连接，告别线缆杂乱。二维码配对，轻松设置。",
        },
        icon: "wifi",
      },
      {
        title: { en: "Multi-Resolution Support", zh: "多分辨率支持" },
        description: {
          en: "Supports cameras from 720P to 8MP. Mix and match cameras based on your needs.",
          zh: "支持720P至8MP摄像头。根据需求混合搭配。",
        },
        icon: "layers",
      },
      {
        title: { en: "Smart Playback", zh: "智能回放" },
        description: {
          en: "Motion recording, scheduled recording, and human detection recording modes. Quick search and playback.",
          zh: "移动侦测录像、定时录像、人形检测录像模式。快速搜索和回放。",
        },
        icon: "play",
      },
    ],
    specs: [
      { key: "Channels", value: { en: "10 IP cameras", zh: "10路IP摄像头" } },
      { key: "Resolution", value: { en: "Up to 8MP", zh: "最高8MP" } },
      { key: "Recording", value: { en: "Motion/Schedule/Human", zh: "移动/定时/人形" } },
      { key: "WiFi", value: { en: "2.4GHz/5.8GHz", zh: "2.4GHz/5.8GHz" } },
      { key: "Storage", value: { en: "HDD supported", zh: "支持硬盘" } },
      { key: "Power", value: { en: "DC 12V", zh: "DC 12V" } },
    ],
  },
  {
    id: "whc905",
    model: "WHC905",
    name: {
      en: "5MP Metal PTZ Dome Camera",
      zh: "5MP金属云台球机",
    },
    series: "e",
    type: "camera",
    summary: {
      en: "Ultra-compact 2.5-inch metal dome with 5MP resolution. 300° pan and 90° tilt for comprehensive coverage in a durable package.",
      zh: "超紧凑2.5英寸金属球机，5MP分辨率。300°水平+90°垂直旋转，耐用外壳全方位覆盖。",
    },
    advantages: [
      {
        title: { en: "All-Metal Construction", zh: "全金属结构" },
        description: {
          en: "Premium metal housing for superior durability. IP66 waterproof rating for harsh outdoor environments.",
          zh: "优质金属外壳，超强耐用性。IP66防水等级，适应恶劣户外环境。",
        },
        icon: "shield",
      },
      {
        title: { en: "5MP High Definition", zh: "5MP高清" },
        description: {
          en: "2880×1620 resolution captures fine details. Wide 101° diagonal field of view.",
          zh: "2880×1620分辨率，捕捉精细细节。101°对角线广角视野。",
        },
        icon: "video",
      },
      {
        title: { en: "Full PTZ Control", zh: "全云台控制" },
        description: {
          en: "300° horizontal and 90° vertical rotation. Remote control via mobile app for real-time positioning.",
          zh: "300°水平+90°垂直旋转。手机APP远程控制，实时定位。",
        },
        icon: "rotate",
      },
      {
        title: { en: "Smart Security", zh: "智能安防" },
        description: {
          en: "Human detection filters false alarms. Zone motion detection with instant push notifications.",
          zh: "人形检测过滤误报。区域移动侦测，即时推送通知。",
        },
        icon: "bell",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "5MP (2880×1620)", zh: "5MP (2880×1620)" } },
      { key: "PTZ Range", value: { en: "Pan 300° / Tilt 90°", zh: "水平300° / 垂直90°" } },
      { key: "Material", value: { en: "Metal housing", zh: "金属外壳" } },
      { key: "Night Vision", value: { en: "10m IR", zh: "10米红外" } },
      { key: "Protection", value: { en: "IP66", zh: "IP66" } },
      { key: "WiFi", value: { en: "2.4GHz/5.8GHz", zh: "2.4GHz/5.8GHz" } },
    ],
  },
  {
    id: "whd205",
    model: "WHD205",
    name: {
      en: "2MP Wireless Dome Camera",
      zh: "2MP无线球机",
    },
    series: "e",
    type: "camera",
    summary: {
      en: "Entry-level wireless dome camera with reliable performance. Perfect for indoor monitoring and small spaces.",
      zh: "入门级无线球机，性能可靠。适合室内监控和小型空间。",
    },
    advantages: [
      {
        title: { en: "Affordable Quality", zh: "经济实惠" },
        description: {
          en: "Cost-effective solution without compromising essential features. Ideal for budget-conscious users.",
          zh: "经济实惠的解决方案，不牺牲核心功能。预算有限用户的理想选择。",
        },
        icon: "dollar",
      },
      {
        title: { en: "Easy Setup", zh: "简易设置" },
        description: {
          en: "Wireless connectivity with simple app-based configuration. No professional installation required.",
          zh: "无线连接，APP简单配置。无需专业安装。",
        },
        icon: "tool",
      },
      {
        title: { en: "Reliable Recording", zh: "可靠录像" },
        description: {
          en: "Supports local storage and NVR recording. Multiple recording modes for flexible operation.",
          zh: "支持本地存储和NVR录像。多种录像模式，操作灵活。",
        },
        icon: "save",
      },
      {
        title: { en: "Two-Way Audio", zh: "双向语音" },
        description: {
          en: "Built-in microphone and speaker for real-time communication. Full-duplex audio quality.",
          zh: "内置麦克风和扬声器，实时通讯。全双工音频质量。",
        },
        icon: "mic",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "2MP (1920×1080)", zh: "2MP (1920×1080)" } },
      { key: "Audio", value: { en: "Two-way, full-duplex", zh: "双向全双工" } },
      { key: "WiFi", value: { en: "2.4GHz/5.8GHz", zh: "2.4GHz/5.8GHz" } },
      { key: "Storage", value: { en: "TF card + NVR", zh: "TF卡 + NVR" } },
      { key: "Night Vision", value: { en: "IR night vision", zh: "红外夜视" } },
      { key: "Installation", value: { en: "Wall/Ceiling mount", zh: "壁挂/吸顶" } },
    ],
  },
];

// Y-Series Products
const ySeriesProducts: Product[] = [
  {
    id: "yhb88-pa",
    model: "YHB88-PA",
    name: {
      en: "8MP HD Fixed Bullet PoE Camera",
      zh: "8MP高清固定枪机PoE摄像头",
    },
    series: "y",
    type: "camera",
    summary: {
      en: "Professional-grade 8MP bullet camera with smart dual-light and Ultra 265 compression. Built for demanding commercial applications.",
      zh: "专业级8MP枪机，智能双光源和Ultra 265压缩。专为高要求商业应用打造。",
    },
    advantages: [
      {
        title: { en: "8MP Ultra-HD", zh: "8MP超高清" },
        description: {
          en: "3840×2160 resolution at 25fps. Captures license plates and faces with exceptional clarity even at distance.",
          zh: "3840×2160分辨率，25fps。即使远距离也能清晰捕捉车牌和人脸。",
        },
        icon: "video",
      },
      {
        title: { en: "Smart Dual-Light", zh: "智能双光源" },
        description: {
          en: "30m IR and warm light range. Auto-switches between modes for optimal night visibility.",
          zh: "30米红外和暖光照射范围。自动切换模式，夜间可视性最佳。",
        },
        icon: "sun",
      },
      {
        title: { en: "Ultra 265 Compression", zh: "Ultra 265压缩" },
        description: {
          en: "Advanced compression reduces bandwidth by up to 50% vs H.265. Saves storage while maintaining quality.",
          zh: "先进压缩技术，带宽比H.265减少50%。节省存储同时保持画质。",
        },
        icon: "compress",
      },
      {
        title: { en: "PoE Power", zh: "PoE供电" },
        description: {
          en: "Single cable for power and data. IEEE 802.3af compliant for easy installation.",
          zh: "单线供电和传输数据。符合IEEE 802.3af标准，安装简便。",
        },
        icon: "plug",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "8MP (3840×2160)", zh: "8MP (3840×2160)" } },
      { key: "Lens", value: { en: "2.8mm, F1.6", zh: "2.8mm, F1.6" } },
      { key: "Field of View", value: { en: "108.6° horizontal", zh: "108.6°水平" } },
      { key: "Night Vision", value: { en: "30m IR + warm light", zh: "30米红外+暖光" } },
      { key: "Compression", value: { en: "Ultra 265/H.265/H.264", zh: "Ultra 265/H.265/H.264" } },
      { key: "Protection", value: { en: "IP67", zh: "IP67" } },
    ],
  },
  {
    id: "yhb812-pa",
    model: "YHB812-PA",
    name: {
      en: "12MP HD Fixed Bullet PoE Camera",
      zh: "12MP高清固定枪机PoE摄像头",
    },
    series: "y",
    type: "camera",
    summary: {
      en: "Top-tier 12MP resolution for maximum detail capture. Ideal for critical security applications requiring the highest image quality.",
      zh: "顶级12MP分辨率，最大化细节捕捉。适合需要最高画质的关键安防应用。",
    },
    advantages: [
      {
        title: { en: "12MP Maximum Detail", zh: "12MP极致细节" },
        description: {
          en: "Industry-leading resolution captures details invisible to lower-resolution cameras. Perfect for forensic-level recording.",
          zh: "行业领先分辨率，捕捉低分辨率摄像头无法呈现的细节。完美的取证级录像。",
        },
        icon: "zoom",
      },
      {
        title: { en: "Wide Dynamic Range", zh: "宽动态范围" },
        description: {
          en: "DWDR technology handles challenging lighting conditions. Clear images in high-contrast scenes.",
          zh: "DWDR技术应对复杂光照条件。高对比度场景下图像清晰。",
        },
        icon: "contrast",
      },
      {
        title: { en: "512GB Storage", zh: "512GB存储" },
        description: {
          en: "MicroSD support up to 512GB for extended local recording. ANR ensures no footage loss during network issues.",
          zh: "MicroSD最大支持512GB，延长本地录像时间。ANR确保网络故障时不丢失录像。",
        },
        icon: "database",
      },
      {
        title: { en: "Professional Build", zh: "专业构造" },
        description: {
          en: "Graphene + metal construction for superior heat dissipation. IP67 rated for all-weather operation.",
          zh: "石墨烯+金属结构，散热性能卓越。IP67等级，全天候运行。",
        },
        icon: "shield",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "12MP", zh: "12MP" } },
      { key: "Sensor", value: { en: "1/2.7\" CMOS", zh: "1/2.7\" CMOS" } },
      { key: "Storage", value: { en: "MicroSD up to 512GB", zh: "MicroSD最大512GB" } },
      { key: "Night Vision", value: { en: "30m dual-light", zh: "30米双光源" } },
      { key: "Material", value: { en: "Graphene + Metal", zh: "石墨烯+金属" } },
      { key: "Protection", value: { en: "IP67, 4KV surge", zh: "IP67, 4KV防雷" } },
    ],
  },
  {
    id: "yhc88-pa",
    model: "YHC88-PA",
    name: {
      en: "8MP HD Fixed Dome PoE Camera",
      zh: "8MP高清固定半球PoE摄像头",
    },
    series: "y",
    type: "camera",
    summary: {
      en: "Discreet dome design with 8MP resolution. Perfect for indoor commercial spaces requiring unobtrusive monitoring.",
      zh: "隐蔽半球设计，8MP分辨率。适合需要低调监控的室内商业空间。",
    },
    advantages: [
      {
        title: { en: "Discreet Design", zh: "隐蔽设计" },
        description: {
          en: "Low-profile dome blends into any environment. Vandal-resistant housing protects against tampering.",
          zh: "低调半球造型融入任何环境。防破坏外壳防止篡改。",
        },
        icon: "eye-off",
      },
      {
        title: { en: "8MP Clarity", zh: "8MP清晰度" },
        description: {
          en: "3840×2160 resolution with 2D/3D noise reduction. Crystal-clear images even in low light.",
          zh: "3840×2160分辨率，2D/3D降噪。低光照下图像依然清晰。",
        },
        icon: "video",
      },
      {
        title: { en: "3-Axis Adjustment", zh: "三轴调节" },
        description: {
          en: "Pan, tilt, and rotate adjustment for precise positioning. Covers the exact area you need.",
          zh: "水平、垂直、旋转调节，精确定位。覆盖您需要的确切区域。",
        },
        icon: "move",
      },
      {
        title: { en: "Smart Detection", zh: "智能检测" },
        description: {
          en: "Ultra motion detection based on human and vehicle recognition. Reduces false alarms significantly.",
          zh: "基于人形和车辆识别的超级移动侦测。大幅减少误报。",
        },
        icon: "brain",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "8MP (3840×2160)", zh: "8MP (3840×2160)" } },
      { key: "Form Factor", value: { en: "Fixed Dome", zh: "固定半球" } },
      { key: "Adjustment", value: { en: "3-axis", zh: "三轴" } },
      { key: "Night Vision", value: { en: "30m dual-light", zh: "30米双光源" } },
      { key: "Detection", value: { en: "Human/Vehicle", zh: "人形/车辆" } },
      { key: "Protection", value: { en: "IP67", zh: "IP67" } },
    ],
  },
  {
    id: "ynvr-32h",
    model: "YNVR-32H",
    name: {
      en: "32-Channel 4K Network Video Recorder",
      zh: "32通道4K网络录像机",
    },
    series: "y",
    type: "nvr",
    summary: {
      en: "Enterprise-grade 32-channel NVR with 4K output and advanced AI analytics. Designed for large-scale commercial deployments.",
      zh: "企业级32通道NVR，4K输出和高级AI分析。专为大规模商业部署设计。",
    },
    advantages: [
      {
        title: { en: "32-Channel Capacity", zh: "32通道容量" },
        description: {
          en: "Connect up to 32 IP cameras. Supports up to 12MP resolution per channel for maximum flexibility.",
          zh: "最多连接32路IP摄像头。每通道支持最高12MP分辨率，灵活性最大化。",
        },
        icon: "grid",
      },
      {
        title: { en: "4K HDMI Output", zh: "4K HDMI输出" },
        description: {
          en: "3840×2160 display resolution. HDMI and VGA simultaneous output for multi-monitor setups.",
          zh: "3840×2160显示分辨率。HDMI和VGA同时输出，支持多显示器设置。",
        },
        icon: "monitor",
      },
      {
        title: { en: "AI Analytics", zh: "AI分析" },
        description: {
          en: "Face detection, vehicle detection, intrusion detection, and people counting. Smart search across all channels.",
          zh: "人脸检测、车辆检测、入侵检测和人流统计。全通道智能搜索。",
        },
        icon: "brain",
      },
      {
        title: { en: "Enterprise Storage", zh: "企业级存储" },
        description: {
          en: "2 SATA interfaces supporting up to 10TB each. ANR technology ensures recording continuity.",
          zh: "2个SATA接口，每个最大支持10TB。ANR技术确保录像连续性。",
        },
        icon: "database",
      },
    ],
    specs: [
      { key: "Channels", value: { en: "32 IP cameras", zh: "32路IP摄像头" } },
      { key: "Max Resolution", value: { en: "12MP per channel", zh: "每通道12MP" } },
      { key: "Output", value: { en: "4K HDMI + VGA", zh: "4K HDMI + VGA" } },
      { key: "Storage", value: { en: "2×SATA, 10TB each", zh: "2×SATA, 每个10TB" } },
      { key: "Bandwidth", value: { en: "160Mbps in / 128Mbps out", zh: "160Mbps入 / 128Mbps出" } },
      { key: "AI Features", value: { en: "Face/Vehicle/Intrusion", zh: "人脸/车辆/入侵" } },
    ],
  },
];

// X-Series Products
const xSeriesProducts: Product[] = [
  {
    id: "hd118-pz",
    model: "HD118-PZ",
    name: {
      en: "8MP 20x Optical Zoom PTZ Camera",
      zh: "8MP 20倍光学变焦云台摄像头",
    },
    series: "x",
    type: "camera",
    summary: {
      en: "Professional PTZ with 20x optical zoom and AI detection. 350° pan coverage for comprehensive surveillance of large areas.",
      zh: "专业云台，20倍光学变焦和AI检测。350°水平覆盖，大面积全面监控。",
    },
    advantages: [
      {
        title: { en: "20x Optical Zoom", zh: "20倍光学变焦" },
        description: {
          en: "4.7-94mm motorized lens for extreme close-up details. Identify faces and license plates from hundreds of meters away.",
          zh: "4.7-94mm电动镜头，极致特写细节。数百米外识别人脸和车牌。",
        },
        icon: "zoom",
      },
      {
        title: { en: "8MP Resolution", zh: "8MP分辨率" },
        description: {
          en: "3480×2160 at 15fps with IMX415 sensor. Ultra-low light performance at 0.0001 lux.",
          zh: "3480×2160 15fps，IMX415传感器。0.0001 lux超低光照性能。",
        },
        icon: "video",
      },
      {
        title: { en: "AI Triple Detection", zh: "AI三重检测" },
        description: {
          en: "Face detection, human figure detection, and vehicle type detection. Smart tracking capabilities.",
          zh: "人脸检测、人形检测、车辆类型检测。智能追踪功能。",
        },
        icon: "brain",
      },
      {
        title: { en: "Full PTZ Coverage", zh: "全云台覆盖" },
        description: {
          en: "350° horizontal and 90° vertical rotation. Covers vast areas with a single camera.",
          zh: "350°水平+90°垂直旋转。单台摄像头覆盖广阔区域。",
        },
        icon: "rotate",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "8MP (3480×2160)", zh: "8MP (3480×2160)" } },
      { key: "Zoom", value: { en: "20x optical (4.7-94mm)", zh: "20倍光学 (4.7-94mm)" } },
      { key: "PTZ Range", value: { en: "Pan 350° / Tilt 90°", zh: "水平350° / 垂直90°" } },
      { key: "Min Illumination", value: { en: "0.0001 lux", zh: "0.0001 lux" } },
      { key: "AI Detection", value: { en: "Face/Human/Vehicle", zh: "人脸/人形/车辆" } },
      { key: "Compression", value: { en: "H.265AI/H.265/H.264", zh: "H.265AI/H.265/H.264" } },
    ],
  },
  {
    id: "hc215-pa",
    model: "HC215-PA",
    name: {
      en: "5MP Fixed Dome PoE Camera",
      zh: "5MP固定半球PoE摄像头",
    },
    series: "x",
    type: "camera",
    summary: {
      en: "Compact 5MP dome camera with professional features. Ideal for retail, office, and commercial indoor applications.",
      zh: "紧凑型5MP半球摄像头，专业功能。适合零售、办公室和商业室内应用。",
    },
    advantages: [
      {
        title: { en: "5MP Clarity", zh: "5MP清晰度" },
        description: {
          en: "2592×1944 resolution captures clear details. Perfect balance of quality and storage efficiency.",
          zh: "2592×1944分辨率，捕捉清晰细节。画质和存储效率的完美平衡。",
        },
        icon: "video",
      },
      {
        title: { en: "Compact Design", zh: "紧凑设计" },
        description: {
          en: "Small form factor blends into any interior. Discreet monitoring without drawing attention.",
          zh: "小巧外形融入任何室内环境。低调监控不引人注目。",
        },
        icon: "minimize",
      },
      {
        title: { en: "PoE Simplicity", zh: "PoE简便" },
        description: {
          en: "Single Ethernet cable for power and data. Reduces installation complexity and cost.",
          zh: "单根网线供电和传输数据。降低安装复杂度和成本。",
        },
        icon: "plug",
      },
      {
        title: { en: "IR Night Vision", zh: "红外夜视" },
        description: {
          en: "Built-in IR LEDs for clear night vision. Auto day/night switching.",
          zh: "内置红外LED，夜视清晰。自动日夜切换。",
        },
        icon: "moon",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "5MP (2592×1944)", zh: "5MP (2592×1944)" } },
      { key: "Form Factor", value: { en: "Fixed Dome", zh: "固定半球" } },
      { key: "Power", value: { en: "PoE (IEEE 802.3af)", zh: "PoE (IEEE 802.3af)" } },
      { key: "Night Vision", value: { en: "IR LEDs", zh: "红外LED" } },
      { key: "Compression", value: { en: "H.265/H.264", zh: "H.265/H.264" } },
      { key: "Protection", value: { en: "IP67", zh: "IP67" } },
    ],
  },
  {
    id: "hb715-pa",
    model: "HB715-PA",
    name: {
      en: "5MP Fixed Bullet PoE Camera",
      zh: "5MP固定枪机PoE摄像头",
    },
    series: "x",
    type: "camera",
    summary: {
      en: "Versatile 5MP bullet camera for indoor and outdoor use. Robust design with professional-grade features.",
      zh: "多功能5MP枪机，室内外通用。坚固设计，专业级功能。",
    },
    advantages: [
      {
        title: { en: "Versatile Mounting", zh: "灵活安装" },
        description: {
          en: "Wall or ceiling mount options. Adjustable bracket for optimal viewing angle.",
          zh: "壁挂或吸顶安装选项。可调支架获得最佳视角。",
        },
        icon: "tool",
      },
      {
        title: { en: "5MP Quality", zh: "5MP画质" },
        description: {
          en: "High-resolution imaging for clear identification. Efficient H.265 compression saves bandwidth.",
          zh: "高分辨率成像，清晰识别。高效H.265压缩节省带宽。",
        },
        icon: "video",
      },
      {
        title: { en: "Weather Resistant", zh: "耐候性" },
        description: {
          en: "IP67 rated for outdoor installation. Operates in -30°C to 60°C temperatures.",
          zh: "IP67等级，适合户外安装。-30°C至60°C温度范围运行。",
        },
        icon: "cloud",
      },
      {
        title: { en: "Smart Features", zh: "智能功能" },
        description: {
          en: "Motion detection, tampering alarm, and audio detection. Comprehensive security coverage.",
          zh: "移动侦测、篡改报警、音频检测。全面安防覆盖。",
        },
        icon: "bell",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "5MP (2592×1944)", zh: "5MP (2592×1944)" } },
      { key: "Form Factor", value: { en: "Fixed Bullet", zh: "固定枪机" } },
      { key: "Power", value: { en: "PoE / DC 12V", zh: "PoE / DC 12V" } },
      { key: "Night Vision", value: { en: "IR LEDs", zh: "红外LED" } },
      { key: "Operating Temp", value: { en: "-30°C to 60°C", zh: "-30°C至60°C" } },
      { key: "Protection", value: { en: "IP67", zh: "IP67" } },
    ],
  },
  {
    id: "hc116-pa",
    model: "HC116-PA",
    name: {
      en: "6MP Fixed Dome PoE Camera",
      zh: "6MP固定半球PoE摄像头",
    },
    series: "x",
    type: "camera",
    summary: {
      en: "High-resolution 6MP dome with advanced features. Excellent choice for demanding commercial environments.",
      zh: "高分辨率6MP半球，高级功能。高要求商业环境的绝佳选择。",
    },
    advantages: [
      {
        title: { en: "6MP Resolution", zh: "6MP分辨率" },
        description: {
          en: "3072×2048 resolution for exceptional detail. Ideal for facial recognition and evidence capture.",
          zh: "3072×2048分辨率，细节出众。适合人脸识别和证据采集。",
        },
        icon: "video",
      },
      {
        title: { en: "WDR Technology", zh: "WDR技术" },
        description: {
          en: "Wide Dynamic Range handles bright and dark areas simultaneously. Clear images in challenging lighting.",
          zh: "宽动态范围同时处理明暗区域。复杂光照下图像清晰。",
        },
        icon: "sun",
      },
      {
        title: { en: "Audio Capability", zh: "音频功能" },
        description: {
          en: "Built-in microphone for audio recording. Adds another layer of security evidence.",
          zh: "内置麦克风录音。增加安防证据层次。",
        },
        icon: "mic",
      },
      {
        title: { en: "ONVIF Compatible", zh: "ONVIF兼容" },
        description: {
          en: "Works with any ONVIF-compliant NVR or VMS. Maximum integration flexibility.",
          zh: "兼容任何ONVIF标准NVR或VMS。最大化集成灵活性。",
        },
        icon: "link",
      },
    ],
    specs: [
      { key: "Resolution", value: { en: "6MP (3072×2048)", zh: "6MP (3072×2048)" } },
      { key: "Form Factor", value: { en: "Fixed Dome", zh: "固定半球" } },
      { key: "WDR", value: { en: "120dB True WDR", zh: "120dB真实WDR" } },
      { key: "Audio", value: { en: "Built-in mic", zh: "内置麦克风" } },
      { key: "Protocol", value: { en: "ONVIF Profile S/G/T", zh: "ONVIF Profile S/G/T" } },
      { key: "Protection", value: { en: "IP67, IK10", zh: "IP67, IK10" } },
    ],
  },
];

// Product Series Data
export const productSeries: ProductSeries[] = [
  {
    id: "x-series",
    name: {
      en: "X-Series",
      zh: "X系列",
    },
    description: {
      en: "Professional-grade cameras with advanced features for commercial and enterprise applications. High-resolution imaging, powerful zoom, and comprehensive AI analytics.",
      zh: "专业级摄像头，高级功能适用于商业和企业应用。高分辨率成像、强大变焦和全面AI分析。",
    },
    icon: "star",
    products: xSeriesProducts,
  },
  {
    id: "y-series",
    name: {
      en: "Y-Series",
      zh: "Y系列",
    },
    description: {
      en: "High-performance PoE cameras and NVRs for demanding surveillance needs. Ultra-HD resolution, smart dual-light technology, and enterprise-grade storage.",
      zh: "高性能PoE摄像头和NVR，满足苛刻监控需求。超高清分辨率、智能双光源技术和企业级存储。",
    },
    icon: "zap",
    products: ySeriesProducts,
  },
  {
    id: "e-series",
    name: {
      en: "E-Series",
      zh: "E系列",
    },
    description: {
      en: "Wireless and battery-powered solutions for flexible installation. Easy setup, long battery life, and smart detection for home and small business security.",
      zh: "无线和电池供电解决方案，安装灵活。简易设置、长电池续航和智能检测，适合家庭和小型企业安防。",
    },
    icon: "battery",
    products: eSeriesProducts,
  },
];

// Get all products
export function getAllProducts(): Product[] {
  return productSeries.flatMap((series) => series.products);
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

// Get products by series
export function getProductsBySeries(seriesId: string): Product[] {
  const series = productSeries.find((s) => s.id === seriesId);
  return series?.products || [];
}

// Search products
export function searchProducts(query: string, language: "en" | "zh"): Product[] {
  const lowerQuery = query.toLowerCase();
  return getAllProducts().filter((product) => {
    const name = product.name[language].toLowerCase();
    const model = product.model.toLowerCase();
    const summary = product.summary[language].toLowerCase();
    return (
      name.includes(lowerQuery) ||
      model.includes(lowerQuery) ||
      summary.includes(lowerQuery)
    );
  });
}
