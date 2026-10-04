// 中文受控写作：虚动词结构（建议直接用后面的动词）、空泛套话（建议换成具体事实）、
// 非推荐词（建议写法）、中文被动标记、步骤的非祈使开头。
// 非推荐词和句式规则取自「简明技术中文」词表（https://github.com/mzopedia/simplified-technical-chinese），
// 只收误报少的条目；依赖语境的词（问题、处理、操作）不收。
export const ZH_LIGHT_VERBS = Object.freeze([
  { re: /进行(?![中时])了?([一-龥]{2})/g, label: '进行' },
  { re: /(?:加以|予以)([一-龥]{2})/g, label: '加以/予以' },
  { re: /[做作]出了?([一-龥]{2})/g, label: '做出' },
]);

export const ZH_CLICHES = Object.freeze([
  '赋能', '抓手', '闭环', '打通', '全方位', '多维度', '深度融合', '显著提升', '至关重要', '不可或缺',
  '与此同时', '综上所述', '值得注意的是', '总而言之', '众所周知', '毋庸置疑', '一站式', '底层逻辑', '颗粒度', '方法论',
  '拉通', '沉淀', '兜底', '收口', '透传', '赛道', '心智',
]);

// 非推荐词 → 建议写法。rule 省略时为 word。
const UNIT = String.raw`(?:个|次|秒|天|分钟|小时|倍|字|条|项|人|行|位|%|MB|GB|KB|TB|ms)?`;
export const ZH_WORDS = Object.freeze([
  // 没有数值的量和程度
  { re: /尽快/g, suggestion: '写出具体时限' },
  { re: /及时(?!性)/g, suggestion: '写出具体时限，或删除' },
  { re: /大概|大约/g, suggestion: '描述句用「约」，步骤写数值' },
  { re: /(?<=[\d个次秒天钟时元倍%])\s*左右/g, suggestion: '写数值或范围' },
  { re: /若干/g, suggestion: '写数字' },
  { re: /多次/g, suggestion: '写次数' },
  { re: /基本上/g, suggestion: '删除，或写出例外' },
  { re: /非常|极其|十分(?!钟)/g, suggestion: '删除，或给出数值' },
  { re: new RegExp(String.raw`(?<=\d\s*${UNIT}\s*)(?:以上|以下)`, 'g'), suggestion: '写明端点：大于 / 不小于，小于 / 不大于' },
  { re: /(?<=\d[^。，；\n]{0,6})以内/g, suggestion: '不超过' },
  // 冗词
  { re: /的话/g, suggestion: '删除' },
  { re: /一下(?!子)/g, suggestion: '删除' },
  { re: /相关(?!性|系数|联)/g, suggestion: '写出具体对象' },
  { re: /(?<=在[^，。]{0,12})的?情况下/g, suggestion: '改为「……时」' },
  { re: /其实|事实上|实际上|所谓/g, suggestion: '删除' },
  { re: /也就是说/g, suggestion: '即' },
  // 情态：强制、禁止、建议各用一个词
  { re: /应该|应当/g, suggestion: '强制用「必须」，推荐用「建议」' },
  { re: /一定要|务必|千万(?=不|别|要|记)/g, suggestion: '必须' },
  { re: /不得(?!不|已)|不准|不许/g, suggestion: '禁止，或「不要」' },
  { re: /最好(?!的)/g, suggestion: '建议' },
  // 一个意义一个词
  { re: /单击|点按/g, suggestion: '点击' },
  { re: /键入/g, suggestion: '输入' },
  { re: /登出/g, suggestion: '退出登录' },
  { re: /入参/g, suggestion: '参数' },
  { re: /出参/g, suggestion: '返回值' },
  { re: /报错/g, suggestion: '名词用「错误」，动词用「返回错误」' },
  { re: /缺省/g, suggestion: '默认' },
  { re: /开启/g, suggestion: '功能用「启用」，文件和页面用「打开」，程序用「启动」' },
  // 错别字
  { re: /登陆/g, suggestion: '登录' },
  { re: /帐号/g, suggestion: '账号' },
  { re: /阀值/g, suggestion: '阈值' },
  { re: /布署/g, suggestion: '部署' },
  // 句式
  {
    re: /(?<=(?:、[^、，。；：\n]{1,16}|(?:和|及|以及)[^，。；\n]{1,16}))等(?:等)?(?!待|候|级|于|同|价|号|式|效|比|分|距|量|温|高|长|边|到|着)/g,
    rule: 'open-list', message: '开放列举', suggestion: '列全，或写数量并用「包括」引出',
  },
  {
    re: /明天|后天|昨天|前天|下周|上周|下个月|上个月|近期|稍后|过几天/g,
    rule: 'relative-time', message: '相对时间', suggestion: '写绝对日期或时长',
  },
]);

// 中文被动标记。「被动」「被告」这类词不算。
export const ZH_PASSIVE = /被(?!动|告|迫|称为|视为)|受到|遭到|为[^，。]{1,10}所(?!以|有|属)/;

// 步骤（有序列表）里的句子不以动词开头的常见写法。
export const ZH_NOT_IMPERATIVE = /^(?:请(?!求)|您|你|用户(?:需要|可以|应该|应当|必须)?|需要|需(?!求))/;
