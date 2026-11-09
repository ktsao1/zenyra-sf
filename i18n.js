// Bilingual EN / 中文 support.
// English lives in the HTML (readable without JS and by search engines); Chinese lives here, keyed by
// the element's data-i18n* attribute. Language order: ?lang= → saved choice → browser language → English.
(function () {
  const STORAGE_KEY = 'zenyra-lang';

  // Strings that never appear in the HTML (used by main.js).
  const en = {
    'common.menu': 'Menu',
    'common.close': 'Close',
    'chat.q1': 'My hands and feet often feel cold. What should I try?',
    'chat.q2': 'I’d like a relaxing scalp treatment.',
    'chat.q3': 'I sit all day and my shoulders feel tight.',
    'chat.q4': 'I’m new here. What should I book first?',
    'chat.who': 'Zenyra',
    'chat.you': 'You',
    'chat.placeholderReply': 'Thanks for asking! Our AI advisor is still being set up. For now, call us at (415) 712-4366 or book a $29 first visit — we’ll recommend what fits when you arrive.',
    // Home (index.html): questions sent to the advisor by the hero chips.
    'host.q1': 'I’ve been stressed and not sleeping well. What would help?',
    'host.q2': 'I’d like care for my scalp and hair. What do you suggest?',
    'host.q3': 'My neck and shoulders are tight. What should I try?',
    'host.q4': 'My hands and feet often feel cold. What should I try?',
    // Advisor module (index.html): fixed intake copy from the Figma conversation frame.
    'am.who': 'Zenyra AI advisor',
    'am.typing': 'Zenyra AI advisor is typing',
    'am.greeting': 'Hi! I’m Zenyra’s AI wellness advisor. What would you like help with today?',
    'am.askWhere': 'Thanks, that helps. Where do you feel it most? Pick any that apply.',
    'am.askWhereStress': 'That sounds draining. Thank you for sharing. Where do you feel it most? Pick any that apply.',
    'am.askRoutine': 'Got it. Last question: how often could you come in?',
    'am.planIntro': 'Thank you, that’s everything I need to suggest a first visit.',
    'am.repliesLabel': 'Quick replies',
    'am.where1': 'Neck & shoulders',
    'am.where2': 'Head & scalp',
    'am.where3': 'Lower back',
    'am.where4': 'Legs & feet',
    'am.where5': 'Not sure',
    'am.routine1': 'Just once, to try it',
    'am.routine2': 'Once or twice a month',
    'am.routine3': 'Every week',
    'am.goal1': 'Better sleep, less stress',
    'am.goal2': 'Healthier scalp and hair',
    'am.goal3': 'Less neck and shoulder tension',
    'am.goal4': 'Warmth for cold hands and feet',
    'am.stepOf': 'Step {n} of 4',
    'am.step1': 'Your goals',
    'am.step2': 'Where you feel it',
    'am.step3': 'Your routine',
    'am.step4': 'Your plan',
    'am.answering': 'Answering now…',
    'am.listJoin': ', ',
    'am.bookFirst': 'Book your first visit',
    'am.call': 'Call'
  };

  const zh = {
    // Meta
    'meta.homeTitle': '悠然美 Zenyra 旧金山 — 日落区头疗与养生馆',
    'meta.homeDescription': '悠然美 Zenyra 位于旧金山日落区，提供特色头疗、草本熏蒸和智能养生调理。新客首次体验 $29 起，每天 9 点至 21 点营业。',
    'meta.memTitle': '会员 — 节律成长计划 · 悠然美 Zenyra 旧金山',
    'meta.memDescription': '从 $29 首次体验开始，在悠然美建立属于自己的养生节奏。查看节律成长计划的全部六个阶段。',
    'meta.galTitle': '店内实景 — 悠然美 Zenyra 旧金山',
    'meta.galDescription': '悠然美日落区养生馆的照片和视频：护理房、蝴蝶墙和社区活动。',

    // Common
    'common.skip': '跳到正文',
    'common.navLabel': '主导航',
    'common.footerNav': '页脚导航',
    'common.menu': '菜单',
    'common.close': '关闭',
    'common.duration': '时长',
    'common.price': '价格',
    'common.tbd': '待定',
    'common.perMonth': '/月',
    'common.placeholder': '占位',
    'common.disclaimer': '养生服务不属于医疗。如有健康问题，请咨询持牌医生。',

    // Nav
    'nav.services': '服务项目',
    'nav.firstVisit': '首次体验',
    'nav.membership': '会员',
    'nav.about': '关于我们',
    'nav.gallery': '店内实景',
    'nav.visit': '到店',

    // CTAs
    'cta.bookShort': '预约',
    'cta.bookFirst': '预约首次体验',
    'cta.seeServices': '查看服务',
    'cta.orCall': '或致电',
    'cta.bookHeadSpa': '预约头疗',
    'cta.compareTiers': '查看全部六个阶段 →',
    'cta.planGroup': '致电预约团体活动 →',
    'cta.directions': '导航到店',
    'cta.startAt29': '从 $29 体验开始',

    // Home — hero
    'home.heroKicker': '头疗与养生 · 旧金山日落区',
    'home.heroTitle': '慢下来，*好好被照顾*一次。',
    'home.heroLede': '特色头疗、草本熏蒸、智能养生调理，就在 Noriega 街。来过一次，我们就记得你。',
    'home.factPriceValue': '$29 起',
    'home.factPrice': '首次体验',
    'home.factHoursValue': '9:00–21:00',
    'home.factHours': '每天营业',
    'home.factLang': '中英文服务',
    'home.heroAlt': '悠然美店内的蓝色蝴蝶墙',
    'home.badgeLabel': '新客专享',
    'home.badgeValue': '2 次体验 · $29',

    // Home — first visit
    'home.fvKicker': '首次体验',
    'home.fvTitle': '*$29* 先试试，不用办卡。',
    'home.fvBody': '第一次来？从“节律探索”开始：一次性体验我们的智能养生设备，体验前先简单聊聊你的身体状况。',
    'home.offerA': '轻体验',
    'home.offerADetail': '2 次智能设备体验',
    'home.offerB': '多体验',
    'home.offerBDetail': '4 次智能设备体验',
    'home.offerRule': '二选一，每人限购一次。',
    'home.step1': '在线预约或来电',
    'home.step1Body': '选个方便的时间。我们讲普通话、粤语和英语。',
    'home.step2': '先聊一聊',
    'home.step2Body': '最近累不累、哪里紧、手脚凉不凉，或者只是想歇一歇。',
    'home.step3': '安心体验',
    'home.step3Body': '在独立房间里放松，细节交给我们。',
    'home.step4': '觉得合适再说',
    'home.step4Body': '不推销。如果你喜欢，再跟你介绍会员怎么常来养护。',

    // Home — services
    'home.svcKicker': '服务项目',
    'home.svcTitle': '按*你想要的感觉*来选。',
    'home.svcLede': '不知道选哪个？到店时跟我们说说，我们帮你推荐。',
    'home.sigAlt': '灯光柔和的独立护理房',
    'home.sigTag': '老顾客最爱',
    'home.sigTitle': '特色头疗',
    'home.sigBody': '多年来最受欢迎的项目。头皮清洁护理、温热草本熏蒸，再加上头、颈、肩的放松按摩，根据你当天的状态调整。',
    'home.svc1': '草本面部熏蒸',
    'home.svc1Body': '温和的草本熏蒸与护肤，按你的肤质和习惯来。',
    'home.svc2': '智能养生设备',
    'home.svc2Body': '在能量 360 舱和智能系列设备里，温暖身体、恢复状态。',
    'home.svc2Meta': '新客 $29 起',
    'home.svc3': '腿足调理',
    'home.svc3Body': '手脚冰凉、久站腿累，来暖一暖、松一松。',
    'home.svc4': '肩背与全身',
    'home.svc4Body': '久坐上班族的肩颈紧绷和日常疲劳，深度放松。',
    'home.svc5': '腹部与盆底养护',
    'home.svc5Body': '温和、非侵入式的调理，先私下沟通，再决定是否适合。',
    'home.svcMetaTbd': '价格与时长待定',

    // Home — approach
    'home.videoLabel': '悠然美介绍视频',
    'home.videoCaption': '走进悠然美 · 0:32',
    'home.apKicker': '我们的理念',
    'home.apTitle': '老传统，新方法，一样的用心。',
    'home.apLede': '把草本熏蒸的传统养生和现代智能设备结合起来，让你走出门时真的觉得身体调回来了，而不只是舒服了一小时。',
    'home.ap1': '每次都因人而异',
    'home.ap1Body': '每次护理，都从你今天的状态开始。',
    'home.ap2': '熏蒸 + 科技',
    'home.ap2Body': '草本熏蒸和智能设备，一起考虑、搭配使用。',
    'home.ap3': '为城市生活而设',
    'home.ap3Body': '给忙碌的旧金山生活，一个安静的角落。',

    // Home — path
    'home.pathKicker': '体验之后',
    'home.pathTitle': '常来，养成*自己的节奏*。',
    'home.pathLede': '节律成长计划陪你一步步来：从第一次尝试，到每月固定养护，再到一群常来的老朋友。',
    'home.pathMore': '另有“节律大使”和“节律领袖”，适合想把悠然美分享给更多人的老顾客。',

    // Home — advisor
    'home.advKicker': '不知道约什么？',
    'home.advTitle': '问问悠然美养生顾问。',
    'home.advBody': '哪里紧、容易累、手脚凉，说给顾问听，到店前先拿个建议。想跟真人聊？营业时间随时来电。',
    'home.advSoon': 'AI 顾问即将上线',

    // Home — founder
    'home.founderAlt': '创始人 Ellaine Luo 在社区活动上招待来宾',
    'home.founderKicker': '创始人',
    'home.founderTitle': 'Ellaine 用心经营的，是人与人的关系。',
    'home.founderP1': 'Ellaine 早年在国内从事美容行业。来到旧金山后，她做了八年餐饮，又用六年多时间建立起自己的美容养生事业。这些年她一直扎根日落区社区，给邻里送餐、参与公益服务。',
    'home.founderQuote': '“用心关怀，专业服务，长久相伴。”',
    'home.recTitle': '服务社区，获多方表彰',

    // Home — reviews / groups
    'home.revKicker': '顾客心声',
    'home.revTitle': '听听顾客怎么说。',
    'home.revPlaceholder': 'Google 顾客评价 — 待添加',
    'home.grpKicker': '企业与私人团体',
    'home.grpTitle': '带上你的团队和朋友。',
    'home.grpBody': '企业养生日、团队放松、VIP 客户活动和小型私人体验，都可以按你们的需要安排。',

    // Recognition
    'rec.1': '荣誉证书',
    'rec.1By': '旧金山市参事委员会',
    'rec.2': '表彰证书',
    'rec.2By': '加州参议院',
    'rec.3': '开业表彰',
    'rec.3By': '加州主计长',
    'rec.4': '感谢状',
    'rec.4By': 'Love and Care 无家者基金会',
    'rec.5': '媒体报道',
    'rec.5By': '星岛日报',

    // Visit
    'visit.kicker': '到店',
    'visit.title': '就在日落区 Noriega 街。',
    'visit.address': '地址',
    'visit.hours': '营业时间',
    'visit.hoursValue': '每天 9:00–21:00',
    'visit.phone': '电话',
    'visit.wechat': '微信',
    'visit.mapTitle': '悠然美地图：2560 Noriega St',

    // Footer
    'footer.line': '用心的照顾，像邻居一样的亲切。',
    'footer.notMedical': '养生建议不能替代医疗建议。',

    // Tiers
    'tier.1.name': '节律探索',
    'tier.1.short': '首次体验',
    'tier.1.stage': '首次体验',
    'tier.1.optA': '2 次智能设备体验',
    'tier.1.optB': '4 次智能设备体验',
    'tier.1.rule': '二选一，每人限购一次。',
    'tier.2.name': '节律体验',
    'tier.2.short': '7 次设备体验',
    'tier.2.stage': '熟悉起来',
    'tier.2.opt': '7 次智能设备体验',
    'tier.2.per': '约每次 $28',
    'tier.2.rule': '仅限智能设备，每人限购一次。',
    'tier.3.name': '节律终身会员',
    'tier.3.short': '全店会员价',
    'tier.3.stage': '成为会员',
    'tier.3.opt': '一次性入会',
    'tier.3.body': '所有适用项目享会员价，并可参加会员日、好友同行日，优先预约。',
    'tier.4.name': '节律见证',
    'tier.4.short': '每月头疗或面部熏蒸',
    'tier.4.stage': '每月养护',
    'tier.4.opt': '每月',
    'tier.4.body': '每月一次固定养护：头疗或草本面部熏蒸任选，搭配智能设备。',
    'tier.4.annual': '也可年付 $1,548，含 $300 智能设备额度。',
    'tier.5.name': '节律大使',
    'tier.5.stage': '分享体验',
    'tier.5.opt': '含 $1,000 智能设备额度',
    'tier.5.rule': '完整权益在一对一咨询时详细说明。',
    'tier.6.name': '节律领袖',
    'tier.6.stage': '深度养护',
    'tier.6.opt': '含 $5,000 智能设备额度',
    'tier.6.rule': '完整权益与资格在一对一咨询时详细说明。',

    // Perks
    'perk.1': '每月会员日',
    'perk.1Body': '专属体验，抢先试新项目。',
    'perk.2': '好友同行',
    'perk.2Body': 'VIP 日带上在乎的人一起来。',
    'perk.3': '优先预约',
    'perk.3Body': '常做的项目，更容易约到好时间。',
    'perk.4': '社区活动',
    'perk.4Body': '和街坊邻居聚一聚，像回家一样。',

    // Membership page
    'mem.kicker': '会员',
    'mem.title': '节律*成长*计划',
    'mem.lede': '先来一次，找到适合自己的，再按自己的节奏慢慢养成习惯。',
    'mem.tiersLabel': '节律成长计划各阶段',
    'mem.groupA': '从这里开始',
    'mem.groupABody': '轻松上手，先体验智能养生设备。',
    'mem.groupB': '成为会员',
    'mem.groupBBody': '享会员价，每月固定养护。',
    'mem.groupC': '更进一步',
    'mem.groupCBody': '给想深度养护、也想分享给身边人的老顾客。',
    'mem.benefitsTbd': '详细权益 — 待添加',
    'mem.videoLabel': '悠然美智能养生设备',
    'mem.eqKicker': '智能系列',
    'mem.eqTitle': '认识计划背后的设备。',
    'mem.eqBody': '每个阶段都包含智能养生设备体验，比如能量 360 舱——温暖、安静，让你彻底放松下来。',
    'mem.perksKicker': '会员生活',
    'mem.perksTitle': '不只是折扣，更是街坊邻里。',
    'mem.faqKicker': '选择之前',
    'mem.faqTitle': '可以先问问这些。',
    'mem.faqMore': '还没想好？首次体验时问我们，或致电',

    // FAQ
    'faq.1q': '不是会员可以来吗？',
    'faq.1a': '可以，任何人都能预约。大多数顾客从 $29 的节律探索开始。',
    'faq.2q': '哪些设备和项目适用？',
    'faq.3q': '额度有效期多久？',
    'faq.4q': '月付计划可以暂停或取消吗？',
    'faq.tbd': '答案待与门店确认。',

    // Gallery
    'gal.kicker': '店内实景',
    'gal.title': '一个*用心*布置的真实空间。',
    'gal.lede': '护理房、小细节和社区时光，这就是悠然美。',
    'gal.filterLabel': '筛选照片',
    'gal.gridLabel': '照片',
    'gal.all': '全部',
    'gal.space': '店内空间',
    'gal.community': '社区',
    'gal.recognition': '荣誉',
    'gal.c.video': '视频导览 · 0:32',
    'gal.c.butterfly': '蝴蝶墙',
    'gal.c.room': '护理房',
    'gal.c.private': '可以好好喘口气的独立房间',
    'gal.c.capsule': '能量 360 舱',
    'gal.c.ellaine': 'Ellaine 招待来宾',
    'gal.c.reception': '前台',
    'gal.c.retail': '产品区与接待区',
    'gal.c.window': '安静的窗边角落',
    'gal.c.detail': '智能设备',
    'gal.c.alcove': '咨询角',
    'gal.c.storefront': '就在 Noriega 街',
    'gal.c.wall': '多年来的荣誉',
    'gal.ctaTitle': '亲自来看看吧。',

    // Chat (placeholder advisor)
    'chat.who': '悠然美',
    'chat.you': '你',
    'chat.greeting': '你好！今天想怎么放松一下？',
    'chat.examples': '常见问题',
    'chat.q1Label': '手脚冰凉',
    'chat.q2Label': '头皮护理',
    'chat.q3Label': '肩颈紧绷',
    'chat.q4Label': '第一次来',
    'chat.q1': '我经常手脚冰凉，适合做什么？',
    'chat.q2': '我想做一次放松的头皮护理。',
    'chat.q3': '我每天久坐，肩颈很紧。',
    'chat.q4': '我是第一次来，先约什么好？',
    'chat.label': '你的问题',
    'chat.placeholder': '输入你的问题…',
    'chat.send': '发送',
    'chat.disclaimer': '仅供日常养生参考，不能替代医疗建议。',
    'chat.placeholderReply': '谢谢你的提问！AI 顾问还在准备中。现在可以致电 (415) 712-4366，或预约 $29 首次体验，到店后我们会帮你推荐合适的项目。',

    // Home (index.html)
    'host.bookNow': '立即预约',
    'host.title': '欢迎光临。<br>一起找到<wbr>*适合你*的护理。',
    'host.lede': '和我们的 AI 顾问聊聊，我们会推荐适合你需求的项目并附上价格，真正预约前你都可以慢慢决定。',
    'host.placeholder': '我最近睡得不好，肩膀也很酸…',
    'host.q1Label': '压力与睡眠',
    'host.q2Label': '头皮与头发护理',
    'host.q3Label': '肩颈',
    'host.q4Label': '手脚冰凉',
    'host.q1': '我最近压力大、睡不好，有什么适合我？',
    'host.q2': '我想护理头皮和头发，有什么推荐？',
    'host.q3': '我肩颈很紧，适合做什么？',
    'host.q4': '我经常手脚冰凉，适合做什么？',
    'host.knowWhat': '已经想好了？',
    'host.bookDirect': '直接预约',
    'host.bookDirectLink': '直接预约',
    'host.orCall': '或致电',
    'host.call': '致电',
    'host.heroPlan': '获取专属方案',
    'host.pathJoinA': '办理会员请致电',
    'host.pathJoinB': '或到店：',
    'host.pathJoinC': '。',
    'mem.joinNote': '会员方案需到店或致电办理。欢迎来电或直接到店，我们会为你安排。',
    'mem.callJoin': '致电',
    'mem.visitJoin': '到店咨询',
    'host.heroLede': '头皮护理、温热草本熏蒸和 Energy 360 能量舱，就在 Noriega 街。我们讲普通话、粤语和英语。',
    'host.heroServices': '看看服务项目',
    'host.heroBook': '预约到店',
    'host.heroMore': '了解更多',
    'host.pathLede': '首次体验之后，选一个方案，常来养护更轻松。',
    'host.moreTiers': '另有两个高阶方案，在一对一咨询时详细介绍',
    'host.aiBadge': '由养生 AI 驱动',
    'host.roomAlt': '天花板挂着浅蓝与米色帐幔的护理房',
    'host.beginTitle': '三种方式，*轻松开始*。',
    'host.beginLede': '可以请 AI 顾问为你推荐方案；已经想好就直接在线预约；也可以打电话，和专人聊聊。',
    'host.planTitle': '即时获取方案与报价',
    'host.bookBody': '在线选择项目和时间。首次体验 $29，含 2 次智能设备体验。',
    'host.bookOnline': '在线预约',
    'host.disclaimer': '仅供日常养生参考，不能替代医疗建议。',
    'host.heroAlt': '条纹帐顶下的私人护理房，有护理床、草本熏蒸台和养生海报',
    'host.placeLine1': '2560 Noriega St · 日落区',
    'host.placeLine2': '每天 9:00–21:00 营业',
    'host.stepsKicker': '如何开始',
    'host.stepsTitle': '三步得到*你的方案*。',
    'host.stepsLede': '不用填表，也没有压力。顾问会询问、倾听并给出建议，由你来决定。',
    'host.step1': '说说你的感受',
    'host.step1Body': '回答几个简单的问题：你的目标、哪里容易紧绷，以及这一周过得怎样。',
    'host.step2': '获取推荐方案',
    'host.step2Body': '根据你的情况匹配首次体验，附上价格和之后可以怎样继续。',
    'host.step3': '在线预约或致电',
    'host.step3Body': '轻点几下就能预约首次体验，或打电话由我们帮你安排。',
    'host.svcTitle': '我们的*服务*',
    'host.svcLede': '选择一项服务，看看它所用的房间和设备。',
    'host.svc0Body': '头皮护理、温热草本熏蒸，以及从容的头、颈、肩按摩。',
    'host.svc1Body': '温和的草本熏蒸与护肤，根据你的肤质调整。',
    'host.svc2Body': '在 Energy 360 能量舱中温暖身体。',
    'host.askAdvisor': '咨询顾问',
    'host.visitTitle': '就在 *Noriega 街*，日落区的中心。',
    'host.openDaily': '每天营业',
    'host.hoursTime': '9:00–21:00',
    'host.capsuleAlt': 'Energy 360 养生舱：白色温热拱罩下的软垫床',
    'host.headAlt': '护理房，前景是头疗洗头床',
    'host.headCap': '头疗洗头床',
    'host.headCapBody': '可躺式洗头床，头皮护理和草本熏蒸都在这里进行。',
    'host.facialCap': '面部护理房',
    'host.facialCapBody': '独立的房间，护理床床头配有面部熏蒸仪。',
    'host.capsuleCap': 'Energy 360 能量舱',
    'host.capsuleCapBody': '躺在软垫床上，置身温热的拱罩之下。',
    'host.seatCap': '泡脚座位',
    'host.seatCapBody': '窗边座位，内置足浴盆，泡脚暖身。',
    'host.photoTbd': '◌ 照片待定',
    'host.capTbd': '房间与设备待确认。',
    'host.seatAlt': '窗边的泡脚座位',
    'host.studioAlt': '悠然美前厅：摆满养生产品的货架，旁边是发光的蝴蝶墙',
    // Mobbin research changes (2026-11-09): hero trust row, booking note, first-visit steps, the door.
    'host.trustLabel': '一览',
    'host.trustPrice': '首次体验',
    'host.trustNoMember': '无需办理会员',
    'host.trustHours': '每天 9:00–21:00 营业',
    'host.bookSteps': '选择项目、挑选时间、确认即可。无需办理会员。',
    'host.fvTitle': '首次到店，一步一步来',
    'host.fv1Alt': '悠然美前厅，后方是前台',
    'host.fv1Title': '用你喜欢的方式预约',
    'host.fv1Body': '问问 AI 顾问、在线预约或打电话，怎么方便怎么来。',
    'host.fv2Title': '$29 先体验',
    'host.fv2Body': '首次体验「节律探索」：$29 含 2 次智能设备体验。',
    'host.fv3Title': '想常来，再选方案',
    'host.fv3Body': '如果想继续养护，我们会通过电话或到店为你介绍各个方案。不需要在线注册。',
    'host.doorAlt': 'Noriega 街上的悠然美门口，上方是写着「悠然美」的绿色招牌',
    'host.doorCap': '认准门口上方写着「悠然美」的绿色招牌。',

    // Advisor module (index.html)
    'am.title': '悠然美养生顾问',
    'am.startOver': '重新开始',
    'am.placeholder': '输入你的回答…',
    'am.heardTitle': '我们了解到的',
    'am.heardLede': '你的方案会随着回答逐步形成。',
    'am.factGoal': '目标',
    'am.factWhere': '部位',
    'am.factRoutine': '频率',
    'am.personTitle': '想直接和人聊？',
    'am.personBody': '致电我们，直接为你预约。可讲英语、普通话和粤语，每天 9:00–21:00 都可来电。',
    'am.who': '悠然美 AI 顾问',
    'am.typing': '悠然美 AI 顾问正在输入',
    'am.greeting': '你好！我是悠然美的 AI 养生顾问。今天想让我帮你什么？',
    'am.askWhere': '谢谢，这很有帮助。你哪里感觉最明显？可以多选。',
    'am.askWhereStress': '听起来很累，谢谢你愿意分享。你哪里感觉最明显？可以多选。',
    'am.askRoutine': '明白了。最后一个问题：你大概多久能来一次？',
    'am.planIntro': '谢谢，我已经了解足够的信息，可以为你推荐首次体验了。',
    'am.repliesLabel': '快捷回复',
    'am.where1': '肩颈',
    'am.where2': '头部与头皮',
    'am.where3': '下背部',
    'am.where4': '腿脚',
    'am.where5': '不确定',
    'am.routine1': '只来一次，先试试',
    'am.routine2': '每月一到两次',
    'am.routine3': '每周一次',
    'am.goal1': '睡得更好，压力更小',
    'am.goal2': '更健康的头皮和头发',
    'am.goal3': '缓解肩颈紧绷',
    'am.goal4': '温暖冰凉的手脚',
    'am.stepOf': '第 {n} 步，共 4 步',
    'am.step1': '你的目标',
    'am.step2': '感觉部位',
    'am.step3': '来店频率',
    'am.step4': '你的方案',
    'am.answering': '正在回答…',
    'am.listJoin': '、',
    'am.bookFirst': '预约首次体验',
    'am.call': '致电'
  };

  const dictionaries = { en, zh };
  const ATTRS = [
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
    ['data-i18n-content', 'content']
  ];

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function store(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode: choice lasts for this page only */ }
  }

  function detect() {
    const param = new URLSearchParams(location.search).get('lang');
    if (param === 'zh' || param === 'en') return param;
    const saved = readStored();
    if (saved === 'zh' || saved === 'en') return saved;
    const browser = navigator.languages || [navigator.language || ''];
    return browser.some((l) => /^zh/i.test(l)) ? 'zh' : 'en';
  }

  let current = detect();
  document.documentElement.lang = current === 'zh' ? 'zh-Hans' : 'en';
  // Hide the page until Chinese is applied, so Chinese readers never see an English flash.
  if (current === 'zh') document.documentElement.classList.add('i18n-pending');

  // Remember each element's English so switching back needs no reload.
  const originals = new WeakMap();
  function original(el, attr = '#text') {
    if (!originals.has(el)) originals.set(el, {});
    const saved = originals.get(el);
    if (!(attr in saved)) saved[attr] = attr === '#text' ? el.textContent : attr === '#html' ? el.innerHTML : el.getAttribute(attr) ?? '';
    return saved[attr];
  }

  function t(key) {
    return dictionaries[current][key] ?? en[key] ?? key;
  }

  function apply() {
    try {
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        // Headings with a highlighted phrase (data-i18n-rich) keep their markup; Chinese marks the phrase as *…*.
        if (el.hasAttribute('data-i18n-rich')) {
          const englishHtml = original(el, '#html');
          const chinese = zh[el.dataset.i18n];
          el.innerHTML = current === 'zh' && chinese ? chinese.replace(/\*(.+?)\*/g, '<span class="hl">$1</span>') : englishHtml;
          return;
        }
        const english = original(el);
        el.textContent = current === 'zh' ? zh[el.dataset.i18n] ?? english : english;
      });
      ATTRS.forEach(([dataAttr, attr]) => {
        document.querySelectorAll(`[${dataAttr}]`).forEach((el) => {
          const english = original(el, attr);
          el.setAttribute(attr, current === 'zh' ? zh[el.getAttribute(dataAttr)] ?? english : english);
        });
      });
      document.querySelectorAll('[data-lang-switch]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.langSwitch === current));
      });
    } finally {
      // Never leave the page hidden, even if a translation step fails.
      document.documentElement.classList.remove('i18n-pending');
    }
  }

  function set(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    current = lang;
    store(lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    }
    apply();
    document.dispatchEvent(new CustomEvent('zenyra:langchange', { detail: { lang } }));
  }

  window.ZenyraI18n = { t, set, get lang() { return current; } };

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelectorAll('[data-lang-switch]').forEach((button) => {
      button.addEventListener('click', () => {
        const lang = button.dataset.langSwitch;
        if (lang === current) return;
        // The page re-reads itself in the new language as one soft change (styles.css, html.lang-swap),
        // where the browser can; otherwise, and with reduced motion, it simply switches.
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!document.startViewTransition || calm) { set(lang); return; }
        const root = document.documentElement;
        root.classList.add('lang-swap');
        const swap = document.startViewTransition(() => set(lang));
        swap.finished.finally(() => root.classList.remove('lang-swap'));
      });
    });
  });
})();
