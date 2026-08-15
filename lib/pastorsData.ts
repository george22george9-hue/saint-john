export interface Pastor {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  image: string;
  isMetropolitan?: boolean;
}

export const PASTORS_DATA: Pastor[] = [
  {
    id: 'bishop-marcos',
    nameAr: 'نيافة الأنبا مرقس',
    nameEn: 'H.G. Bishop Marcos',
    titleAr: 'مطران شبرا الخيمة وتوابعها',
    titleEn: 'Metropolitan of Shoubra El-Kheima and its Dependencies',
    image: '/anba-morcos.jpg',
    isMetropolitan: true,
  },
  {
    id: 'fr-wessa',
    nameAr: 'القمص ويصا',
    nameEn: 'Fr. Wessa',
    titleAr: 'كاهن الكنيسة ورائي الاجتماع',
    titleEn: 'Church & Meeting Pastor',
    image: '/abona_wessa.jpeg',
  },
  {
    id: 'fr-bevnoty',
    nameAr: 'القس بفنوتي عوض',
    nameEn: 'Fr. Bevnoty',
    titleAr: 'كاهن الكنيسة ورائي الاجتماع',
    titleEn: 'Church & Meeting Pastor',
    image: '/abona_bevnoty.jpeg',
  },
];
