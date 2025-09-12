export const VIDEO_PAGE_LABEL = {
  HOMEPAGE: 'Trang chủ',
  SPC_PAGE: 'Trang sàn đá công nghệ SPC'
};

export const VIDEO_PAGE_OPTIONS = Object.entries(VIDEO_PAGE_LABEL).map(
  ([key, value]) => ({
    label: value,
    value: key
  })
);
