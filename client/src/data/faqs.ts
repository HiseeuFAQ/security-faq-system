// FAQ data for Hiseeu FAQ system
// Categories: General, Products, Technology, Installation, Troubleshooting

export interface FAQ {
  id: string;
  category: string;
  subcategory?: string;
  question: {
    en: string;
    zh: string;
  };
  answer: {
    en: string;
    zh: string;
  };
  tags: string[];
  priority: number; // Higher = more frequently asked
}

export interface FAQCategory {
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
  faqs: FAQ[];
}

// General FAQs about Hiseeu
const generalFAQs: FAQ[] = [
  {
    id: "gen-1",
    category: "general",
    question: {
      en: "What is Hiseeu known for?",
      zh: "Hiseeu以什么闻名？",
    },
    answer: {
      en: "Hiseeu is a leading manufacturer of security cameras and surveillance systems, specializing in wireless, battery-powered, and PoE solutions. We are known for delivering professional-grade security products at competitive prices, with a focus on easy installation, smart AI detection, and reliable performance for both home and business applications.",
      zh: "Hiseeu是安防摄像头和监控系统的领先制造商，专注于无线、电池供电和PoE解决方案。我们以具有竞争力的价格提供专业级安防产品而闻名，专注于简易安装、智能AI检测和可靠性能，适用于家庭和商业应用。",
    },
    tags: ["company", "brand", "about"],
    priority: 10,
  },
  {
    id: "gen-2",
    category: "general",
    question: {
      en: "Where can I purchase Hiseeu products?",
      zh: "在哪里可以购买Hiseeu产品？",
    },
    answer: {
      en: "Hiseeu products are available through multiple channels: our official website, Amazon, AliExpress, and authorized distributors worldwide. For B2B customers, we offer direct wholesale pricing and customization options. Contact our sales team for bulk orders or partnership inquiries.",
      zh: "Hiseeu产品可通过多种渠道购买：我们的官方网站、亚马逊、速卖通以及全球授权经销商。对于B2B客户，我们提供直接批发价格和定制选项。如需批量订购或合作咨询，请联系我们的销售团队。",
    },
    tags: ["purchase", "buy", "distributor"],
    priority: 9,
  },
  {
    id: "gen-3",
    category: "general",
    question: {
      en: "What warranty does Hiseeu provide?",
      zh: "Hiseeu提供什么保修？",
    },
    answer: {
      en: "All Hiseeu products come with a standard 2-year manufacturer warranty covering defects in materials and workmanship. Extended warranty options are available for commercial customers. Our warranty includes free technical support and replacement for defective units within the warranty period.",
      zh: "所有Hiseeu产品均享有2年标准制造商保修，涵盖材料和工艺缺陷。商业客户可选择延长保修。我们的保修包括免费技术支持和保修期内缺陷产品的更换。",
    },
    tags: ["warranty", "guarantee", "support"],
    priority: 8,
  },
  {
    id: "gen-4",
    category: "general",
    question: {
      en: "Does Hiseeu offer technical support?",
      zh: "Hiseeu提供技术支持吗？",
    },
    answer: {
      en: "Yes, Hiseeu provides comprehensive technical support through multiple channels: email support (24-48 hour response), live chat on our website, detailed user manuals, video tutorials, and this FAQ knowledge base. For urgent issues, B2B customers have access to priority support lines.",
      zh: "是的，Hiseeu通过多种渠道提供全面技术支持：邮件支持（24-48小时响应）、网站在线聊天、详细用户手册、视频教程和本FAQ知识库。对于紧急问题，B2B客户可使用优先支持热线。",
    },
    tags: ["support", "help", "service"],
    priority: 8,
  },
  {
    id: "gen-5",
    category: "general",
    question: {
      en: "What certifications do Hiseeu products have?",
      zh: "Hiseeu产品有哪些认证？",
    },
    answer: {
      en: "Hiseeu products are certified to meet international safety and quality standards including CE (Europe), FCC (USA), RoHS (environmental compliance), and various regional certifications. Our batteries are UN38.3 and MSDS certified for safe transportation.",
      zh: "Hiseeu产品经认证符合国际安全和质量标准，包括CE（欧洲）、FCC（美国）、RoHS（环保合规）和各种区域认证。我们的电池通过UN38.3和MSDS认证，确保安全运输。",
    },
    tags: ["certification", "compliance", "standards"],
    priority: 7,
  },
];

// Product FAQs
const productFAQs: FAQ[] = [
  {
    id: "prod-1",
    category: "products",
    subcategory: "cameras",
    question: {
      en: "What is the difference between wireless and wire-free cameras?",
      zh: "无线摄像头和免布线摄像头有什么区别？",
    },
    answer: {
      en: "Wireless cameras transmit video over WiFi but still require a power cable. Wire-free (battery-powered) cameras like our C20 and C90 are completely cable-free, running on rechargeable batteries. Wire-free cameras offer maximum installation flexibility but require periodic charging, while wireless cameras provide continuous power but need access to an outlet.",
      zh: "无线摄像头通过WiFi传输视频，但仍需要电源线。免布线（电池供电）摄像头如我们的C20和C90完全无需线缆，使用可充电电池运行。免布线摄像头提供最大安装灵活性，但需要定期充电；而无线摄像头提供持续供电，但需要接入电源插座。",
    },
    tags: ["wireless", "battery", "wire-free", "power"],
    priority: 10,
  },
  {
    id: "prod-2",
    category: "products",
    subcategory: "cameras",
    question: {
      en: "What resolution should I choose for my security camera?",
      zh: "我应该为安防摄像头选择什么分辨率？",
    },
    answer: {
      en: "Resolution depends on your monitoring needs: 2MP (1080P) is sufficient for general monitoring and small areas. 4MP-5MP provides clearer details for identifying faces and license plates at medium distances. 8MP (4K) is ideal for large areas or when you need to zoom in on recorded footage. 12MP offers maximum detail for forensic-level evidence. Higher resolution requires more storage and bandwidth.",
      zh: "分辨率取决于您的监控需求：2MP（1080P）足够用于一般监控和小区域。4MP-5MP在中等距离下可清晰识别人脸和车牌。8MP（4K）适合大面积区域或需要放大回放画面。12MP提供取证级证据的最大细节。更高分辨率需要更多存储空间和带宽。",
    },
    tags: ["resolution", "4K", "1080P", "quality"],
    priority: 9,
  },
  {
    id: "prod-3",
    category: "products",
    subcategory: "cameras",
    question: {
      en: "What is the difference between NVR and DVR?",
      zh: "NVR和DVR有什么区别？",
    },
    answer: {
      en: "NVR (Network Video Recorder) works with IP cameras that process video at the camera level and transmit digital data over Ethernet or WiFi. DVR (Digital Video Recorder) works with analog cameras that send raw video to the recorder for processing. NVRs offer higher resolution, easier installation, and more flexibility. All Hiseeu systems use NVR technology for superior performance.",
      zh: "NVR（网络录像机）与IP摄像头配合使用，摄像头端处理视频并通过以太网或WiFi传输数字数据。DVR（数字录像机）与模拟摄像头配合使用，将原始视频发送到录像机进行处理。NVR提供更高分辨率、更简易安装和更大灵活性。所有Hiseeu系统均使用NVR技术以获得卓越性能。",
    },
    tags: ["NVR", "DVR", "recorder", "system"],
    priority: 9,
  },
  {
    id: "prod-4",
    category: "products",
    subcategory: "cameras",
    question: {
      en: "How long does the battery last on wire-free cameras?",
      zh: "免布线摄像头的电池能用多久？",
    },
    answer: {
      en: "Battery life varies by model and usage: The C20 offers up to 6 months of normal use (20 events/day) and 12 months standby with its 5200mAh battery. The C90 provides similar performance with optimized power management. Actual battery life depends on recording frequency, detection sensitivity, and environmental temperature. Solar panels are available for unlimited runtime.",
      zh: "电池续航因型号和使用情况而异：C20配备5200mAh电池，正常使用（每天20次事件）可达6个月，待机12个月。C90通过优化电源管理提供类似性能。实际电池续航取决于录像频率、检测灵敏度和环境温度。可选配太阳能板实现无限续航。",
    },
    tags: ["battery", "life", "charging", "solar"],
    priority: 8,
  },
  {
    id: "prod-5",
    category: "products",
    subcategory: "cameras",
    question: {
      en: "What is PoE and why should I consider it?",
      zh: "什么是PoE，为什么要考虑它？",
    },
    answer: {
      en: "PoE (Power over Ethernet) delivers both power and data through a single Ethernet cable, eliminating the need for separate power adapters. Benefits include: simplified installation with fewer cables, more reliable power delivery, easier cable management, and the ability to place cameras far from power outlets. Our Y-Series cameras support IEEE 802.3af PoE standard.",
      zh: "PoE（以太网供电）通过单根以太网线同时传输电力和数据，无需单独的电源适配器。优点包括：更少线缆简化安装、更可靠的供电、更简便的线缆管理、以及可将摄像头安装在远离电源插座的位置。我们的Y系列摄像头支持IEEE 802.3af PoE标准。",
    },
    tags: ["PoE", "power", "ethernet", "installation"],
    priority: 8,
  },
  {
    id: "prod-6",
    category: "products",
    subcategory: "nvr",
    question: {
      en: "How many cameras can I connect to an NVR?",
      zh: "NVR可以连接多少个摄像头？",
    },
    answer: {
      en: "Camera capacity depends on the NVR model: Our TZ-NVR10CA and TZ-NVR10S support up to 10 channels. The YNVR-32H supports up to 32 channels for large installations. When selecting an NVR, consider not just the channel count but also the total bandwidth and storage capacity needed for your camera resolutions.",
      zh: "摄像头容量取决于NVR型号：我们的TZ-NVR10CA和TZ-NVR10S支持最多10通道。YNVR-32H支持最多32通道，适合大型安装。选择NVR时，不仅要考虑通道数，还要考虑摄像头分辨率所需的总带宽和存储容量。",
    },
    tags: ["NVR", "channels", "capacity", "cameras"],
    priority: 7,
  },
];

// Technology FAQs
const technologyFAQs: FAQ[] = [
  {
    id: "tech-1",
    category: "technology",
    subcategory: "video",
    question: {
      en: "What is H.265 and why is it better than H.264?",
      zh: "什么是H.265，为什么比H.264更好？",
    },
    answer: {
      en: "H.265 (HEVC) is a video compression standard that reduces file sizes by up to 50% compared to H.264 while maintaining the same quality. This means you can store more footage on the same hard drive and use less network bandwidth. Our cameras also support H.265+ and Ultra 265 for even greater efficiency, reducing storage needs by up to 70%.",
      zh: "H.265（HEVC）是一种视频压缩标准，在保持相同画质的情况下，文件大小比H.264减少高达50%。这意味着您可以在同一硬盘上存储更多录像，并使用更少的网络带宽。我们的摄像头还支持H.265+和Ultra 265，效率更高，存储需求减少高达70%。",
    },
    tags: ["H.265", "H.264", "compression", "storage"],
    priority: 8,
  },
  {
    id: "tech-2",
    category: "technology",
    subcategory: "detection",
    question: {
      en: "How does AI human detection work?",
      zh: "AI人形检测是如何工作的？",
    },
    answer: {
      en: "AI human detection uses deep learning algorithms to analyze video frames and identify human shapes, distinguishing them from animals, vehicles, or moving objects like trees. This dramatically reduces false alarms compared to simple motion detection. Our cameras process AI detection locally for instant response, sending alerts only when humans are detected.",
      zh: "AI人形检测使用深度学习算法分析视频帧并识别人形，将其与动物、车辆或树木等移动物体区分开来。与简单的移动侦测相比，这大大减少了误报。我们的摄像头在本地处理AI检测以实现即时响应，仅在检测到人形时发送警报。",
    },
    tags: ["AI", "detection", "human", "smart"],
    priority: 9,
  },
  {
    id: "tech-3",
    category: "technology",
    subcategory: "night-vision",
    question: {
      en: "What is the difference between IR and color night vision?",
      zh: "红外夜视和彩色夜视有什么区别？",
    },
    answer: {
      en: "IR (Infrared) night vision uses invisible infrared LEDs to illuminate the scene, producing black-and-white images. Color night vision uses white light LEDs to provide full-color images at night. Our dual-light cameras offer both modes: IR for discreet monitoring and color for detailed identification. Smart mode automatically switches based on detected activity.",
      zh: "红外（IR）夜视使用不可见的红外LED照亮场景，产生黑白图像。彩色夜视使用白光LED在夜间提供全彩图像。我们的双光源摄像头提供两种模式：红外用于隐蔽监控，彩色用于详细识别。智能模式根据检测到的活动自动切换。",
    },
    tags: ["night vision", "IR", "color", "dual-light"],
    priority: 8,
  },
  {
    id: "tech-4",
    category: "technology",
    subcategory: "network",
    question: {
      en: "What is the difference between 2.4GHz and 5GHz WiFi?",
      zh: "2.4GHz和5GHz WiFi有什么区别？",
    },
    answer: {
      en: "2.4GHz offers longer range and better wall penetration but is more prone to interference from other devices. 5GHz provides faster speeds and less interference but has shorter range. Our dual-band cameras (like TZ-HBY08) support both frequencies, automatically selecting the best connection. Use 2.4GHz for distant cameras and 5GHz for high-bandwidth 4K streaming.",
      zh: "2.4GHz提供更长的传输距离和更好的穿墙能力，但更容易受到其他设备的干扰。5GHz提供更快的速度和更少的干扰，但传输距离较短。我们的双频摄像头（如TZ-HBY08）支持两种频率，自动选择最佳连接。远距离摄像头使用2.4GHz，高带宽4K流媒体使用5GHz。",
    },
    tags: ["WiFi", "2.4GHz", "5GHz", "dual-band"],
    priority: 7,
  },
  {
    id: "tech-5",
    category: "technology",
    subcategory: "protection",
    question: {
      en: "What do IP65, IP66, and IP67 ratings mean?",
      zh: "IP65、IP66和IP67等级是什么意思？",
    },
    answer: {
      en: "IP (Ingress Protection) ratings indicate dust and water resistance. The first digit (6) means complete dust protection. The second digit indicates water resistance: IP65 protects against water jets, IP66 against powerful water jets, and IP67 allows temporary immersion up to 1 meter. All ratings are suitable for outdoor use; choose IP67 for areas with heavy rain or potential flooding.",
      zh: "IP（防护等级）表示防尘和防水能力。第一位数字（6）表示完全防尘。第二位数字表示防水能力：IP65防护水柱喷射，IP66防护强力水柱，IP67允许短时浸入1米深水中。所有等级都适合户外使用；在暴雨或可能发生水淹的区域选择IP67。",
    },
    tags: ["IP rating", "waterproof", "outdoor", "protection"],
    priority: 7,
  },
];

// Installation FAQs
const installationFAQs: FAQ[] = [
  {
    id: "inst-1",
    category: "installation",
    question: {
      en: "How do I set up my Hiseeu camera for the first time?",
      zh: "如何首次设置Hiseeu摄像头？",
    },
    answer: {
      en: "1. Download the Hiseeu app (iOS/Android) and create an account. 2. Power on your camera and wait for the indicator light. 3. In the app, tap 'Add Device' and scan the QR code on the camera. 4. Follow the prompts to connect to your WiFi network. 5. Position and mount the camera. 6. Adjust settings like detection sensitivity and recording preferences in the app.",
      zh: "1. 下载Hiseeu应用（iOS/Android）并创建账户。2. 打开摄像头电源，等待指示灯亮起。3. 在应用中点击'添加设备'并扫描摄像头上的二维码。4. 按提示连接到您的WiFi网络。5. 定位并安装摄像头。6. 在应用中调整检测灵敏度和录像偏好等设置。",
    },
    tags: ["setup", "installation", "app", "first-time"],
    priority: 10,
  },
  {
    id: "inst-2",
    category: "installation",
    question: {
      en: "What is the maximum distance between camera and NVR?",
      zh: "摄像头和NVR之间的最大距离是多少？",
    },
    answer: {
      en: "For wireless cameras: Open-field range is typically 100 meters, but walls and obstacles reduce this. For best performance, keep cameras within 30-50 meters of the NVR with minimal obstructions. For PoE cameras: Standard Ethernet cables support up to 100 meters. Use PoE extenders for longer distances up to 300 meters.",
      zh: "无线摄像头：开阔地带传输距离通常为100米，但墙壁和障碍物会减少距离。为获得最佳性能，将摄像头保持在NVR 30-50米范围内，尽量减少障碍物。PoE摄像头：标准以太网线支持最远100米。使用PoE延长器可延长至300米。",
    },
    tags: ["distance", "range", "wireless", "PoE"],
    priority: 8,
  },
  {
    id: "inst-3",
    category: "installation",
    question: {
      en: "Where should I install outdoor cameras?",
      zh: "户外摄像头应该安装在哪里？",
    },
    answer: {
      en: "Key locations include: entry points (front/back doors, garage), driveways and parking areas, side gates and fences, and areas with valuables. Install cameras 8-10 feet high, angled slightly downward. Avoid pointing directly at bright lights or the sun. Ensure WiFi signal reaches the location. Consider camera field of view to minimize blind spots.",
      zh: "关键位置包括：入口点（前/后门、车库）、车道和停车区、侧门和围栏、以及有贵重物品的区域。将摄像头安装在2.5-3米高度，略微向下倾斜。避免直接对准强光或太阳。确保WiFi信号能覆盖该位置。考虑摄像头视野以减少盲区。",
    },
    tags: ["outdoor", "placement", "location", "mounting"],
    priority: 8,
  },
  {
    id: "inst-4",
    category: "installation",
    question: {
      en: "How do I connect my camera to a new WiFi network?",
      zh: "如何将摄像头连接到新的WiFi网络？",
    },
    answer: {
      en: "1. Open the Hiseeu app and go to camera settings. 2. Select 'WiFi Settings' or 'Network Configuration'. 3. Choose your new WiFi network from the list. 4. Enter the password and confirm. 5. Wait for the camera to reconnect (may take 1-2 minutes). If this fails, reset the camera and set it up as a new device.",
      zh: "1. 打开Hiseeu应用，进入摄像头设置。2. 选择'WiFi设置'或'网络配置'。3. 从列表中选择新的WiFi网络。4. 输入密码并确认。5. 等待摄像头重新连接（可能需要1-2分钟）。如果失败，重置摄像头并作为新设备设置。",
    },
    tags: ["WiFi", "network", "change", "connect"],
    priority: 7,
  },
  {
    id: "inst-5",
    category: "installation",
    question: {
      en: "How do I install a hard drive in my NVR?",
      zh: "如何在NVR中安装硬盘？",
    },
    answer: {
      en: "1. Disconnect power from the NVR. 2. Remove the cover screws and open the case. 3. Connect the SATA data and power cables to the hard drive. 4. Secure the drive with the provided screws. 5. Replace the cover and reconnect power. 6. The NVR will automatically detect and format the new drive. Use surveillance-grade HDDs (WD Purple, Seagate SkyHawk) for best reliability.",
      zh: "1. 断开NVR电源。2. 拆下外壳螺丝并打开机箱。3. 将SATA数据线和电源线连接到硬盘。4. 用提供的螺丝固定硬盘。5. 盖上外壳并重新接通电源。6. NVR将自动检测并格式化新硬盘。使用监控级硬盘（WD Purple、希捷SkyHawk）以获得最佳可靠性。",
    },
    tags: ["HDD", "hard drive", "NVR", "storage"],
    priority: 7,
  },
];

// Troubleshooting FAQs
const troubleshootingFAQs: FAQ[] = [
  {
    id: "trouble-1",
    category: "troubleshooting",
    question: {
      en: "My camera is offline. How do I fix it?",
      zh: "我的摄像头离线了，如何修复？",
    },
    answer: {
      en: "Try these steps: 1. Check if the camera has power (indicator light on). 2. Verify your WiFi router is working. 3. Move the camera closer to the router temporarily. 4. Restart both the camera and router. 5. Check if your WiFi password changed. 6. Ensure your app is updated. 7. If using battery camera, check battery level. 8. As a last resort, reset the camera and set it up again.",
      zh: "尝试以下步骤：1. 检查摄像头是否有电（指示灯亮）。2. 确认WiFi路由器正常工作。3. 暂时将摄像头移近路由器。4. 重启摄像头和路由器。5. 检查WiFi密码是否更改。6. 确保应用已更新。7. 如果是电池摄像头，检查电池电量。8. 最后手段是重置摄像头并重新设置。",
    },
    tags: ["offline", "connection", "troubleshoot", "fix"],
    priority: 10,
  },
  {
    id: "trouble-2",
    category: "troubleshooting",
    question: {
      en: "Why is my video quality poor or blurry?",
      zh: "为什么我的视频质量差或模糊？",
    },
    answer: {
      en: "Common causes and solutions: 1. Clean the camera lens with a soft cloth. 2. Check network bandwidth - poor WiFi can reduce quality. 3. Verify video quality settings in the app (set to HD or higher). 4. Ensure adequate lighting for the scene. 5. Check if the camera lens is fogged (common in temperature changes). 6. Update camera firmware for optimizations.",
      zh: "常见原因和解决方案：1. 用软布清洁摄像头镜头。2. 检查网络带宽 - WiFi差会降低画质。3. 在应用中确认视频质量设置（设为高清或更高）。4. 确保场景有足够照明。5. 检查镜头是否起雾（温度变化时常见）。6. 更新摄像头固件以获得优化。",
    },
    tags: ["quality", "blurry", "video", "resolution"],
    priority: 8,
  },
  {
    id: "trouble-3",
    category: "troubleshooting",
    question: {
      en: "I'm not receiving push notifications. What should I do?",
      zh: "我没有收到推送通知，该怎么办？",
    },
    answer: {
      en: "Check these settings: 1. Ensure notifications are enabled in the Hiseeu app. 2. Check your phone's notification settings for the app. 3. Verify motion/human detection is enabled on the camera. 4. Check if 'Do Not Disturb' mode is active on your phone. 5. Ensure the app has background refresh permissions. 6. Log out and back into the app. 7. Reinstall the app if issues persist.",
      zh: "检查以下设置：1. 确保Hiseeu应用中已启用通知。2. 检查手机对该应用的通知设置。3. 确认摄像头上已启用移动/人形检测。4. 检查手机是否开启了'勿扰模式'。5. 确保应用有后台刷新权限。6. 退出并重新登录应用。7. 如果问题持续，重新安装应用。",
    },
    tags: ["notifications", "alerts", "push", "app"],
    priority: 8,
  },
  {
    id: "trouble-4",
    category: "troubleshooting",
    question: {
      en: "My NVR is not recording. How do I fix it?",
      zh: "我的NVR没有录像，如何修复？",
    },
    answer: {
      en: "Troubleshooting steps: 1. Check if a hard drive is installed and detected (check NVR menu). 2. Verify the HDD has free space. 3. Check recording schedule settings - ensure recording is enabled. 4. Confirm cameras are connected and streaming. 5. Check if the HDD needs formatting. 6. Try a different HDD to rule out drive failure. 7. Update NVR firmware.",
      zh: "故障排除步骤：1. 检查是否已安装硬盘并被检测到（查看NVR菜单）。2. 确认硬盘有剩余空间。3. 检查录像计划设置 - 确保已启用录像。4. 确认摄像头已连接并正在传输。5. 检查硬盘是否需要格式化。6. 尝试其他硬盘以排除硬盘故障。7. 更新NVR固件。",
    },
    tags: ["NVR", "recording", "HDD", "storage"],
    priority: 7,
  },
  {
    id: "trouble-5",
    category: "troubleshooting",
    question: {
      en: "How do I reset my camera to factory settings?",
      zh: "如何将摄像头恢复出厂设置？",
    },
    answer: {
      en: "Most Hiseeu cameras have a reset button (small hole on the body): 1. Locate the reset hole on the camera. 2. Use a pin or paperclip to press and hold the reset button. 3. Hold for 10-15 seconds until you hear a voice prompt or see the indicator light change. 4. Release the button and wait for the camera to restart. 5. Set up the camera as a new device in the app.",
      zh: "大多数Hiseeu摄像头都有重置按钮（机身上的小孔）：1. 找到摄像头上的重置孔。2. 用针或回形针按住重置按钮。3. 按住10-15秒，直到听到语音提示或看到指示灯变化。4. 松开按钮，等待摄像头重启。5. 在应用中将摄像头作为新设备设置。",
    },
    tags: ["reset", "factory", "restore", "settings"],
    priority: 7,
  },
];

// Application Scenario FAQs
const scenarioFAQs: FAQ[] = [
  {
    id: "scene-1",
    category: "scenarios",
    question: {
      en: "Which cameras are best for home security?",
      zh: "哪些摄像头最适合家庭安防？",
    },
    answer: {
      en: "For home security, we recommend: Battery cameras (C20, C90) for flexible outdoor placement without wiring. PTZ cameras (TZ-HBY08, WHC905) for comprehensive coverage of yards and driveways. Indoor domes for discreet monitoring of living spaces. A 4-8 channel NVR system provides complete home coverage. Consider your specific needs: entry points, parking areas, and high-value zones.",
      zh: "家庭安防推荐：电池摄像头（C20、C90）用于灵活的户外部署，无需布线。云台摄像头（TZ-HBY08、WHC905）用于全面覆盖院子和车道。室内半球用于隐蔽监控生活空间。4-8通道NVR系统提供完整的家庭覆盖。考虑您的具体需求：入口点、停车区域和高价值区域。",
    },
    tags: ["home", "residential", "recommendation", "system"],
    priority: 9,
  },
  {
    id: "scene-2",
    category: "scenarios",
    question: {
      en: "What system do you recommend for a small business?",
      zh: "小型企业推荐什么系统？",
    },
    answer: {
      en: "For small businesses (retail, office, restaurant): Y-Series PoE cameras (YHB88-PA, YHC88-PA) offer professional-grade quality with easy installation. An 8-16 channel NVR provides room for growth. Key features to consider: 8MP resolution for clear evidence, AI detection to reduce false alarms, and remote viewing for owner monitoring. Budget approximately $500-1500 depending on camera count.",
      zh: "小型企业（零售、办公室、餐厅）推荐：Y系列PoE摄像头（YHB88-PA、YHC88-PA）提供专业级画质和简易安装。8-16通道NVR为扩展预留空间。需要考虑的关键功能：8MP分辨率获得清晰证据、AI检测减少误报、远程查看方便业主监控。根据摄像头数量，预算约500-1500美元。",
    },
    tags: ["business", "commercial", "retail", "office"],
    priority: 8,
  },
  {
    id: "scene-3",
    category: "scenarios",
    question: {
      en: "How do I monitor my property remotely while traveling?",
      zh: "旅行时如何远程监控我的房产？",
    },
    answer: {
      en: "All Hiseeu cameras support remote viewing through our mobile app: 1. Ensure cameras are connected to your home WiFi. 2. Download the Hiseeu app and log into your account. 3. View live feeds from anywhere with internet access. 4. Enable push notifications for motion alerts. 5. Use cloud storage for off-site backup of important recordings. 6. Share access with family members or trusted neighbors if needed.",
      zh: "所有Hiseeu摄像头都支持通过我们的移动应用远程查看：1. 确保摄像头连接到家庭WiFi。2. 下载Hiseeu应用并登录账户。3. 在任何有网络的地方查看实时画面。4. 启用推送通知接收移动警报。5. 使用云存储对重要录像进行异地备份。6. 如需要，可与家人或信任的邻居共享访问权限。",
    },
    tags: ["remote", "travel", "monitoring", "app"],
    priority: 8,
  },
  {
    id: "scene-4",
    category: "scenarios",
    question: {
      en: "Can I use Hiseeu cameras for warehouse or large area monitoring?",
      zh: "Hiseeu摄像头可以用于仓库或大面积监控吗？",
    },
    answer: {
      en: "Yes, for large areas we recommend: X-Series PTZ cameras (HD118-PZ) with 20x optical zoom for covering vast spaces with a single camera. Y-Series 8MP/12MP cameras for high-detail fixed monitoring. YNVR-32H NVR for up to 32 cameras with 4K output. Consider PoE switches for efficient cable management. AI analytics help monitor for intrusions and track activity across the facility.",
      zh: "是的，大面积区域推荐：X系列云台摄像头（HD118-PZ）配备20倍光学变焦，单台摄像头覆盖广阔空间。Y系列8MP/12MP摄像头用于高细节固定监控。YNVR-32H NVR支持最多32路摄像头和4K输出。考虑使用PoE交换机进行高效线缆管理。AI分析帮助监控入侵和跟踪设施内的活动。",
    },
    tags: ["warehouse", "large area", "enterprise", "PTZ"],
    priority: 7,
  },
  {
    id: "scene-5",
    category: "scenarios",
    question: {
      en: "What cameras work best in extreme weather conditions?",
      zh: "哪些摄像头在极端天气条件下效果最好？",
    },
    answer: {
      en: "For extreme conditions: All our outdoor cameras are rated IP65-IP67 for water and dust resistance. Operating temperature ranges from -30°C to 60°C for most models. Metal housing cameras (WHC905) offer better durability. For very cold climates, ensure batteries are kept above -10°C. PoE cameras are more reliable than battery cameras in extreme temperatures. Consider protective housings for additional protection.",
      zh: "极端条件下：我们所有户外摄像头都具有IP65-IP67防水防尘等级。大多数型号的工作温度范围为-30°C至60°C。金属外壳摄像头（WHC905）提供更好的耐用性。在非常寒冷的气候中，确保电池温度保持在-10°C以上。在极端温度下，PoE摄像头比电池摄像头更可靠。考虑使用防护罩提供额外保护。",
    },
    tags: ["weather", "outdoor", "temperature", "durability"],
    priority: 6,
  },
];

// All FAQ Categories
export const faqCategories: FAQCategory[] = [
  {
    id: "general",
    name: {
      en: "General FAQ",
      zh: "常见问题",
    },
    description: {
      en: "Learn more about Hiseeu and general questions about our company and services.",
      zh: "了解更多关于Hiseeu的信息以及公司和服务的常见问题。",
    },
    icon: "help-circle",
    faqs: generalFAQs,
  },
  {
    id: "products",
    name: {
      en: "Products FAQ",
      zh: "产品问题",
    },
    description: {
      en: "Common questions about our security cameras, NVRs, and accessories.",
      zh: "关于我们安防摄像头、NVR和配件的常见问题。",
    },
    icon: "camera",
    faqs: productFAQs,
  },
  {
    id: "technology",
    name: {
      en: "Technology FAQ",
      zh: "技术问题",
    },
    description: {
      en: "Find answers about the technologies used in our security products.",
      zh: "了解我们安防产品中使用的技术。",
    },
    icon: "cpu",
    faqs: technologyFAQs,
  },
  {
    id: "installation",
    name: {
      en: "Installation FAQ",
      zh: "安装问题",
    },
    description: {
      en: "Step-by-step guidance for setting up and installing your security system.",
      zh: "安防系统设置和安装的分步指南。",
    },
    icon: "tool",
    faqs: installationFAQs,
  },
  {
    id: "troubleshooting",
    name: {
      en: "Troubleshooting",
      zh: "故障排除",
    },
    description: {
      en: "Solutions for common issues and problems with your security equipment.",
      zh: "安防设备常见问题的解决方案。",
    },
    icon: "wrench",
    faqs: troubleshootingFAQs,
  },
  {
    id: "scenarios",
    name: {
      en: "Application Scenarios",
      zh: "应用场景",
    },
    description: {
      en: "Recommendations for different use cases and environments.",
      zh: "不同使用场景和环境的推荐方案。",
    },
    icon: "home",
    faqs: scenarioFAQs,
  },
];

// Get all FAQs
export function getAllFAQs(): FAQ[] {
  return faqCategories.flatMap((category) => category.faqs);
}

// Get FAQs by category
export function getFAQsByCategory(categoryId: string): FAQ[] {
  const category = faqCategories.find((c) => c.id === categoryId);
  return category?.faqs || [];
}

// Search FAQs
export function searchFAQs(query: string, language: "en" | "zh"): FAQ[] {
  const lowerQuery = query.toLowerCase();
  return getAllFAQs().filter((faq) => {
    const question = faq.question[language].toLowerCase();
    const answer = faq.answer[language].toLowerCase();
    const tags = faq.tags.join(" ").toLowerCase();
    return (
      question.includes(lowerQuery) ||
      answer.includes(lowerQuery) ||
      tags.includes(lowerQuery)
    );
  });
}

// Get FAQ by ID
export function getFAQById(id: string): FAQ | undefined {
  return getAllFAQs().find((faq) => faq.id === id);
}
