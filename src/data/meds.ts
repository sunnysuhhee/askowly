/**
 * Plain-language info for common medicines taken by older adults.
 * General information only, written at a ~6th grade reading level.
 * Not dosing advice. Reviewed against MedlinePlus drug summaries.
 */
export interface MedInfo {
  name: string
  aliases: string[]
  /** Completes the sentence "X is usually used ..." */
  purpose: string
  watchFor: string[]
  tips: string[]
}

export const MEDS: MedInfo[] = [
  {
    name: 'Lisinopril', aliases: ['zestril', 'prinivil'],
    purpose: 'to lower blood pressure and protect the heart and kidneys',
    watchFor: ['A dry cough that will not go away', 'Feeling dizzy when you stand up', 'Swelling of the face, lips, or tongue (get help right away)'],
    tips: ['Stand up slowly', 'Ask before using salt substitutes, since many contain potassium'],
  },
  {
    name: 'Amlodipine', aliases: ['norvasc'],
    purpose: 'to lower blood pressure and ease chest pain',
    watchFor: ['Swollen ankles or feet', 'Flushing or headache', 'Feeling dizzy'],
    tips: ['Grapefruit can raise the amount in your blood. Ask your pharmacist.'],
  },
  {
    name: 'Losartan', aliases: ['cozaar'],
    purpose: 'to lower blood pressure and protect the kidneys',
    watchFor: ['Feeling dizzy or lightheaded', 'Unusual tiredness'],
    tips: ['Ask before using salt substitutes that contain potassium'],
  },
  {
    name: 'Metoprolol', aliases: ['lopressor', 'toprol', 'toprol xl'],
    purpose: 'to slow the heart rate and lower blood pressure',
    watchFor: ['Feeling very tired', 'A very slow heartbeat', 'Cold hands and feet'],
    tips: ['Do not stop suddenly. Talk to your doctor first.'],
  },
  {
    name: 'Hydrochlorothiazide', aliases: ['hctz', 'microzide'],
    purpose: 'as a "water pill" to lower blood pressure and reduce swelling',
    watchFor: ['Needing to use the bathroom more', 'Muscle cramps', 'Feeling dizzy'],
    tips: ['Many people take it in the morning so they are not up at night'],
  },
  {
    name: 'Furosemide', aliases: ['lasix'],
    purpose: 'as a strong "water pill" to reduce swelling and fluid',
    watchFor: ['Muscle cramps or weakness', 'Feeling very thirsty or dizzy', 'Ringing in the ears'],
    tips: ['Weigh yourself at the same time each day if your doctor asked you to'],
  },
  {
    name: 'Atorvastatin', aliases: ['lipitor'],
    purpose: 'to lower cholesterol and help prevent heart attack and stroke',
    watchFor: ['Muscle pain or weakness you cannot explain', 'Dark urine'],
    tips: ['Tell your doctor about any new muscle aches'],
  },
  {
    name: 'Simvastatin', aliases: ['zocor'],
    purpose: 'to lower cholesterol',
    watchFor: ['Muscle pain or weakness', 'Dark urine'],
    tips: ['Avoid large amounts of grapefruit juice'],
  },
  {
    name: 'Rosuvastatin', aliases: ['crestor'],
    purpose: 'to lower cholesterol',
    watchFor: ['Muscle pain or weakness', 'Dark urine'],
    tips: ['Tell your doctor about any new muscle aches'],
  },
  {
    name: 'Metformin', aliases: ['glucophage'],
    purpose: 'to lower blood sugar in type 2 diabetes',
    watchFor: ['Upset stomach or diarrhea, especially at first', 'Unusual tiredness or trouble breathing (call your doctor)'],
    tips: ['Usually taken with meals to ease stomach upset'],
  },
  {
    name: 'Glipizide', aliases: ['glucotrol'],
    purpose: 'to lower blood sugar in type 2 diabetes',
    watchFor: ['Shakiness, sweating, or confusion, which can mean low blood sugar'],
    tips: ['Keep a snack or juice nearby in case your sugar drops'],
  },
  {
    name: 'Insulin', aliases: ['lantus', 'humalog', 'novolog', 'basaglar', 'levemir'],
    purpose: 'to control blood sugar in diabetes',
    watchFor: ['Shakiness, sweating, or confusion, which can mean low blood sugar'],
    tips: ['Keep unopened insulin in the refrigerator', 'Keep juice or glucose tablets nearby'],
  },
  {
    name: 'Levothyroxine', aliases: ['synthroid', 'levoxyl', 'unithroid'],
    purpose: 'to replace thyroid hormone when the thyroid is underactive',
    watchFor: ['A racing heartbeat', 'Feeling shaky or unable to sleep'],
    tips: ['Usually taken on an empty stomach with water, 30 to 60 minutes before breakfast', 'Keep it apart from calcium and iron pills'],
  },
  {
    name: 'Omeprazole', aliases: ['prilosec'],
    purpose: 'to reduce stomach acid for heartburn and ulcers',
    watchFor: ['Diarrhea that will not stop', 'Long-term use can lower magnesium and B12'],
    tips: ['Usually taken before a meal'],
  },
  {
    name: 'Pantoprazole', aliases: ['protonix'],
    purpose: 'to reduce stomach acid for heartburn and ulcers',
    watchFor: ['Diarrhea that will not stop', 'Headache'],
    tips: ['Usually taken before breakfast'],
  },
  {
    name: 'Warfarin', aliases: ['coumadin', 'jantoven'],
    purpose: 'to thin the blood and prevent dangerous clots',
    watchFor: ['Unusual bleeding or bruising', 'Red or black stools', 'Blood in urine'],
    tips: ['Keep the amount of leafy greens you eat steady from week to week', 'Ask before taking any pain reliever or supplement'],
  },
  {
    name: 'Apixaban', aliases: ['eliquis'],
    purpose: 'to thin the blood and prevent stroke and clots',
    watchFor: ['Unusual bleeding or bruising', 'Red or black stools'],
    tips: ['Do not skip doses or stop without asking your doctor'],
  },
  {
    name: 'Clopidogrel', aliases: ['plavix'],
    purpose: 'to keep blood cells from sticking together and forming clots',
    watchFor: ['Unusual bleeding or bruising'],
    tips: ['Tell your dentist you take it'],
  },
  {
    name: 'Aspirin', aliases: ['baby aspirin', 'bayer', 'ecotrin'],
    purpose: 'for pain, or in low doses to help prevent heart attack and stroke',
    watchFor: ['Stomach pain or black stools', 'Unusual bleeding'],
    tips: ['Ask your doctor before starting daily aspirin'],
  },
  {
    name: 'Ibuprofen', aliases: ['advil', 'motrin'],
    purpose: 'for pain, swelling, and fever',
    watchFor: ['Stomach pain or black stools', 'Swelling in the legs'],
    tips: ['Take with food', 'Ask your doctor before using it often, especially if you have kidney or heart problems'],
  },
  {
    name: 'Naproxen', aliases: ['aleve', 'naprosyn'],
    purpose: 'for pain and swelling, such as arthritis',
    watchFor: ['Stomach pain or black stools', 'Swelling in the legs'],
    tips: ['Take with food'],
  },
  {
    name: 'Acetaminophen', aliases: ['tylenol'],
    purpose: 'for pain and fever',
    watchFor: ['Yellow skin or eyes (call your doctor)'],
    tips: ['Many cold medicines also contain it. Check labels so you do not take too much.'],
  },
  {
    name: 'Gabapentin', aliases: ['neurontin'],
    purpose: 'for nerve pain and some types of seizures',
    watchFor: ['Feeling sleepy or unsteady', 'Swelling in the hands or feet'],
    tips: ['Be extra careful on stairs until you know how it affects you'],
  },
  {
    name: 'Sertraline', aliases: ['zoloft'],
    purpose: 'for depression and anxiety',
    watchFor: ['Upset stomach at first', 'Trouble sleeping', 'Unusual bleeding when combined with blood thinners'],
    tips: ['It can take a few weeks to feel the full effect'],
  },
  {
    name: 'Donepezil', aliases: ['aricept'],
    purpose: 'to help with memory and thinking in Alzheimer’s disease',
    watchFor: ['Upset stomach', 'Vivid dreams', 'A slow heartbeat'],
    tips: ['Often taken at bedtime'],
  },
  {
    name: 'Tamsulosin', aliases: ['flomax'],
    purpose: 'to make it easier to urinate when the prostate is enlarged',
    watchFor: ['Feeling dizzy when you stand up'],
    tips: ['Stand up slowly, especially at night'],
  },
  {
    name: 'Alendronate', aliases: ['fosamax'],
    purpose: 'to strengthen bones and prevent fractures',
    watchFor: ['Heartburn or pain when swallowing'],
    tips: ['Usually taken first thing in the morning with a full glass of water, staying upright for 30 minutes'],
  },
  {
    name: 'Prednisone', aliases: ['deltasone'],
    purpose: 'to calm inflammation and swelling',
    watchFor: ['Higher blood sugar', 'Mood changes or trouble sleeping'],
    tips: ['Do not stop suddenly if you have taken it for a while'],
  },
  {
    name: 'Potassium chloride', aliases: ['k-dur', 'klor-con', 'potassium'],
    purpose: 'to raise low potassium levels',
    watchFor: ['Stomach upset', 'Muscle weakness or an irregular heartbeat'],
    tips: ['Take with food and a full glass of water'],
  },
  {
    name: 'Sildenafil', aliases: ['viagra', 'revatio'],
    purpose: 'for erectile problems or high blood pressure in the lungs',
    watchFor: ['Headache or flushing', 'Sudden vision or hearing changes (get help)'],
    tips: ['Never combine with nitroglycerin or other nitrates'],
  },
  {
    name: 'Nitroglycerin', aliases: ['nitrostat', 'isosorbide', 'imdur'],
    purpose: 'to relieve or prevent chest pain (angina)',
    watchFor: ['Headache', 'Feeling dizzy'],
    tips: ['Sit down before taking it under the tongue'],
  },
  {
    name: 'Diphenhydramine', aliases: ['benadryl', 'tylenol pm', 'zzzquil'],
    purpose: 'for allergies or as a sleep aid',
    watchFor: ['Confusion, unsteadiness, or falls, especially in older adults'],
    tips: ['Ask your pharmacist about safer options for sleep'],
  },
]

const byKey = new Map<string, MedInfo>()
for (const m of MEDS) {
  byKey.set(m.name.toLowerCase(), m)
  for (const a of m.aliases) byKey.set(a, m)
}

export function findMed(name: string): MedInfo | undefined {
  return byKey.get(name.trim().toLowerCase())
}

/** Finds the first known medicine or brand name mentioned anywhere in free text. */
export function findMedInText(text: string): MedInfo | undefined {
  const lower = text.toLowerCase()
  // Longest keys first so "tylenol pm" wins over "tylenol".
  const keys = [...byKey.keys()].sort((a, b) => b.length - a.length)
  const hit = keys.find((k) => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(lower))
  return hit ? byKey.get(hit) : undefined
}

export function searchMeds(query: string, limit = 3): MedInfo[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  return MEDS.filter((m) => m.name.toLowerCase().startsWith(q) || m.aliases.some((a) => a.startsWith(q))).slice(0, limit)
}
