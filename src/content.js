// Single source of truth for every piece of copy on the site.
export const profile = {
  name: 'Mubarak Almalki',
  nameAr: 'مبارك المالكي',
  title: 'IT Support & Network Systems',
  tagline: 'أي عطل… له حل.',
  finalLine: '',
  contacts: {
    email: 'mubarak_almalki@outlook.com',
    whatsapp: 'https://wa.me/966580231353',
    instagram: 'https://instagram.com/guum',
    cv: './cv.pdf',
  },
  stages: [
    {
      id: 'ram',
      part: 'RAM',
      faultText: 'MEMORY ERROR',
      fixedText: 'MEMORY OK',
      label: 'الأساس',
      info: ['دبلوم إدارة أنظمة الشبكات', 'التدريب التقني والمهني · نجران'],
    },
    {
      id: 'storage',
      part: 'SSD / OS',
      faultText: 'BOOT FAILED',
      fixedText: 'BOOT SUCCESS',
      label: 'الأنظمة',
      info: ['Windows Server', 'Active Directory', 'Linux · Windows OS'],
    },
    {
      id: 'network',
      part: 'NETWORK',
      faultText: 'NO LINK',
      fixedText: 'LINK UP · 1 Gbps',
      label: 'الشبكات',
      info: ['Switches Configuration', 'LAN Troubleshooting', 'CCNA 200-301'],
    },
    {
      id: 'cpu',
      part: 'CPU',
      faultText: 'TEMP 98°C',
      fixedText: 'TEMP 42°C',
      label: 'العقلية',
      info: ['أشخّص قبل ما أصلّح', '+500 ساعة تعلّم في منصة سطر'],
    },
  ],
};
