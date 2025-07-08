export const DOCUMENT_KEYS = {
  COMPANY_PROFILE: 'COMPANY_PROFILE',
  CONSTRUCTION_ENGINEERING: 'CONSTRUCTION_ENGINEERING',
  CATALOGUE: 'CATALOGUE'
};

export const DOCUMENT_LABELS = {
  [DOCUMENT_KEYS.COMPANY_PROFILE]: 'Company Profile',
  [DOCUMENT_KEYS.CONSTRUCTION_ENGINEERING]: 'Kỹ thuật xây dựng',
  [DOCUMENT_KEYS.CATALOGUE]: 'Nhận Catalogue'
};

export const DOCUMENT_OPTIONS = Object.entries(DOCUMENT_LABELS).map(
  ([key, value]) => ({
    label: value,
    value: key
  })
);
