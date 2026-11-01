export interface VenueMeta {
  /** CSS 类名，用于载体色彩标签 */
  cls: 'v-ieee' | 'v-applied' | 'v-cn';
  /** 短标签（缩写或中文刊名） */
  tag: string;
  /** 是否为国际顶刊（IEEE Trans 系列 / Applied Energy） */
  top: boolean;
}

const SHORT_ZH: Record<string, string> = {
  'IEEE Transactions on Smart Grid': 'IEEE TSG',
  'IEEE Transactions on Power Systems': 'IEEE TPWRS',
  'IEEE Transactions on Sustainable Energy': 'IEEE TSTE',
  'IEEE Transactions on Industrial Informatics': 'IEEE TII',
  'Applied Energy': 'Applied Energy',
  '电工技术学报': '电工学报',
  '中国电机工程学报': '电机工程',
};

const SHORT_EN: Record<string, string> = {
  'IEEE Transactions on Smart Grid': 'IEEE TSG',
  'IEEE Transactions on Power Systems': 'IEEE TPWRS',
  'IEEE Transactions on Sustainable Energy': 'IEEE TSTE',
  'IEEE Transactions on Industrial Informatics': 'IEEE TII',
  'Applied Energy': 'Applied Energy',
  '电工技术学报': 'TCES',
  '中国电机工程学报': 'CSEE',
};

/** 根据发表载体返回展示用的色彩标签、短名与是否顶刊。 */
export function venueMeta(venue: string, lang: 'zh' | 'en' = 'zh'): VenueMeta {
  const v = venue || '';
  const isIeee = /ieee transactions/i.test(v);
  const isApplied = /applied energy/i.test(v);
  const isCn = /学报/.test(v);

  let cls: VenueMeta['cls'] = 'v-cn';
  let top = false;
  if (isIeee) {
    cls = 'v-ieee';
    top = true;
  } else if (isApplied) {
    cls = 'v-applied';
    top = true;
  } else if (isCn) {
    cls = 'v-cn';
    top = false;
  }

  const tag = (lang === 'en' ? SHORT_EN : SHORT_ZH)[v] || v;
  return { cls, tag, top };
}
