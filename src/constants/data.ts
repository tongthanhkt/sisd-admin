import { NavItem } from '@/types';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  images: {
    main: string;
    thumbnails: string[];
  };
  packaging: string;
  advantages: {
    id: string;
    value: string;
  }[];
  technicalSpecifications: {
    standard: string;
    specifications: {
      stt: number;
      category: string;
      performance: string;
    }[];
  };
  transportationAndStorage: {
    id: string;
    value: string;
  }[];
  safetyRegulations: {
    warning: string;
    notes: string;
  };
  isFeatured: boolean;
}

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  // {
  //   title: 'Dashboard',
  //   url: '/dashboard/overview',
  //   icon: 'dashboard',
  //   isActive: false,
  //   shortcut: ['d', 'd'],
  //   items: [] // Empty array as there are no child items for Dashboard
  // },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Blogs',
    url: '/dashboard/blogs',
    icon: 'post',
    shortcut: ['b', 'b'],
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];

export const mortalProductsData = [
  {
    id: 'dpc-100',
    name: 'Vữa thô DPC-100',
    code: 'DPC-100',
    description:
      'VASA DPC-100 là vữa trắng chất cảm vô cơ cao cấp, được sản xuất từ cát chọn lọc, xi măng vô cơ màu trắng, chất độn mịn và phụ gia hiệu suất cao. Sản phẩm có độ bám dính tốt, dễ thi công, tạo bề mặt nhẵn mịn, mang lại hiệu ứng trang trí thẩm mỹ cao cho công trình.',
    image: '/images/products/dpc-100.svg',
    shortDescription: 'Chất tăng bám dính',
    category: 'MORTAL',
    href: 'products/dpc-100',
    images: {
      main: '/DPC-main-1.png',
      thumbnails: [
        'https://storage.googleapis.com/lianlian-425307.appspot.com/pexels-aleksandar-pasaric-2341830.jpeg'
      ]
    },
    advantages: [
      'Dễ thi công, không chảy rơi khi san lấp lớp dày.',
      'Chống ẩm, thoáng khí, ngăn ngừa nấm mốc.',
      'Thân thiện môi trường, carbon thấp.',
      'Ứng dụng đa dạng, phù hợp với nhiều bề mặt.'
    ],
    packaging: 'Quy cách đóng gói: 25kg/bao',
    technicalSpecifications: {
      standard: 'VASA DPC-100 đạt tiêu chuẩn GB/T 25181-2019',
      specifications: [
        {
          stt: 1,
          category: 'Bên ngoài',
          performance: 'Đồng đều, không vón cục, không tạp chất'
        },
        {
          stt: 2,
          category: 'Tỷ lệ giữ nước, %',
          performance: '≥ 88'
        },
        {
          stt: 3,
          category: 'Thời gian đông cứng/h',
          performance: '3 - 12'
        },
        {
          stt: 4,
          category: 'Tỷ lệ độ đặc tổn thất trong 2 tiếng/%',
          performance: '≤ 30'
        },
        {
          stt: 5,
          category: 'Cường độ kéo dán bám dính trong 14 ngày /Mpa',
          performance: '≥ 0.20'
        },
        {
          stt: 6,
          category: 'Tỉ lệ co vào trong 28 ngày/%',
          performance: '≤ 0.20'
        },
        {
          stt: 7,
          category: 'Cường độ chịu nén 28/Mpa',
          performance: '≥ 10'
        },
        {
          stt: 8,
          category: 'Tính chống băng giá',
          performance:
            '≤ 5 (Tỷ lệ cường độ tổn thất/%)\n≤ 25 (Tỷ lệ cường độ tổn thất/%)'
        }
      ]
    },
    transportationAndStorage: [
      'Tránh dính mưa, va đập trong quá trình vận chuyển để tránh làm hỏng bao bì',
      'Cần bảo quản trong kho khô ráo, thoáng mát, tránh ẩm ướt, không được để tiếp xúc với ánh nắng trực tiếp và với nước.',
      'Trong điều kiện vận chuyển và bảo quản thông thường, thời gian bảo quản sản phẩm là 6 tháng.',
      'Sản phẩm này nên được bảo quản ngoài tầm với của trẻ em để tránh vô tình ăn phải.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu nó vô tình bắn vào mắt, bạn hãy rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes:
        'Màng quấn palletizer và pallet đáy do nhà máy trang bị sẽ có lợi hơn cho việc chống thấm sản phẩm, chống bụi, chống ẩm và bảo vệ bao bì sản phẩm, vì vậy vui lòng không làm hỏng nó trước khi sử dụng! (Không cung cấp màng và pallet khi số lượng)'
    }
  },
  {
    id: 'dpx-200',
    name: 'Vữa thô DPX-200',
    code: 'DPX-200',
    description:
      'VASA DPX-200 là vữa trắng chất cảm vô cơ cao cấp, được sản xuất từ cát chọn lọc, xi măng vô cơ màu trắng, chất độn mịn và phụ gia hiệu suất cao. Sản phẩm có độ bám dính tốt, dễ thi công, tạo bề mặt nhẵn mịn, mang lại hiệu ứng trang trí thẩm mỹ cao cho công trình.',
    image: '/images/products/dpx-200.svg',
    shortDescription: 'Chất tăng bám dính',
    category: 'MORTAL',
    href: 'products/dpx-200',
    images: {
      main: '/DPX-main-1.png',
      thumbnails: [
        '/DPX-main-1.png',
        '/DPX-thumb-1.png',
        '/DPX-thumb-2.png',
        '/DPX-thumb-3.png',
        '/DPX-thumb-4.png',
        '/DPX-thumb-5.png'
      ]
    },
    advantages: [
      'Dễ thi công, không chảy rơi khi san lấp lớp dày.',
      'Chống ẩm, thoáng khí, ngăn ngừa nấm mốc.',
      'Thân thiện môi trường, carbon thấp.',
      'Ứng dụng đa dạng, phù hợp với nhiều bề mặt.'
    ],
    packaging: 'Quy cách đóng gói: 25kg/bao',
    technicalSpecifications: {
      standard: 'VASA DPX-200 đạt tiêu chuẩn GB/T 25181-2019',
      specifications: [
        {
          stt: 1,
          category: 'Bên ngoài',
          performance: 'Đồng đều, không vón cục, không tạp chất'
        },
        {
          stt: 2,
          category: 'Tỷ lệ giữ nước, %',
          performance: '≥ 88'
        },
        {
          stt: 3,
          category: 'Thời gian đông cứng/h',
          performance: '3 - 12'
        },
        {
          stt: 4,
          category: 'Tỷ lệ độ đặc tổn thất trong 2 tiếng/%',
          performance: '≤ 30'
        },
        {
          stt: 5,
          category: 'Cường độ kéo dán bám dính trong 14 ngày /Mpa',
          performance: '≥ 0.20'
        },
        {
          stt: 6,
          category: 'Tỉ lệ co vào trong 28 ngày/%',
          performance: '≤ 0.20'
        },
        {
          stt: 7,
          category: 'Cường độ chịu nén 28/Mpa',
          performance: '≥ 10'
        },
        {
          stt: 8,
          category: 'Tính chống băng giá',
          performance:
            '≤ 5 (Tỷ lệ cường độ tổn thất/%)\n≤ 25 (Tỷ lệ cường độ tổn thất/%)'
        }
      ]
    },
    transportationAndStorage: [
      'Tránh dính mưa, va đập trong quá trình vận chuyển để tránh làm hỏng bao bì',
      'Cần bảo quản trong kho khô ráo, thoáng mát, tránh ẩm ướt, không được để tiếp xúc với ánh nắng trực tiếp và với nước.',
      'Trong điều kiện vận chuyển và bảo quản thông thường, thời gian bảo quản sản phẩm là 6 tháng.',
      'Sản phẩm này nên được bảo quản ngoài tầm với của trẻ em để tránh vô tình ăn phải.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu nó vô tình bắn vào mắt, bạn hãy rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes:
        'Màng quấn palletizer và pallet đáy do nhà máy trang bị sẽ có lợi hơn cho việc chống thấm sản phẩm, chống bụi, chống ẩm và bảo vệ bao bì sản phẩm, vì vậy vui lòng không làm hỏng nó trước khi sử dụng! (Không cung cấp màng và pallet khi số lượng)'
    }
  },
  {
    id: 'mj-100',
    name: 'Vữa thô MJ-100',
    code: 'MJ-100',
    image: '/images/products/mj-100.svg',
    shortDescription: 'Chất tăng bám dính',
    category: 'MORTAL',
    description:
      'VASA MJ-100 là vữa trắng chất cảm vô cơ cao cấp, được sản xuất từ cát chọn lọc, xi măng vô cơ màu trắng, chất độn mịn và phụ gia hiệu suất cao. Sản phẩm có độ bám dính tốt, dễ thi công, tạo bề mặt nhẵn mịn, mang lại hiệu ứng trang trí thẩm mỹ cao cho công trình.',
    href: 'products/mj-100',
    images: {
      main: '/MJ-main-1.png',
      thumbnails: [
        '/MJ-main-1.png',
        '/MJ-thumb-1.png',
        '/MJ-thumb-2.png',
        '/MJ-thumb-3.png'
      ]
    },
    advantages: [
      'Dễ thi công, không chảy rơi khi san lấp lớp dày.',
      'Chống ẩm, thoáng khí, ngăn ngừa nấm mốc.',
      'Thân thiện môi trường, carbon thấp.',
      'Ứng dụng đa dạng, phù hợp với nhiều bề mặt.'
    ],
    packaging: 'Quy cách đóng gói: 25kg/bao',
    technicalSpecifications: {
      standard: 'VASA MJ-100 đạt tiêu chuẩn GB/T 25181-2019',
      specifications: [
        {
          stt: 1,
          category: 'Bên ngoài',
          performance: 'Đồng đều, không vón cục, không tạp chất'
        },
        {
          stt: 2,
          category: 'Tỷ lệ giữ nước, %',
          performance: '≥ 88'
        },
        {
          stt: 3,
          category: 'Thời gian đông cứng/h',
          performance: '3 - 12'
        },
        {
          stt: 4,
          category: 'Tỷ lệ độ đặc tổn thất trong 2 tiếng/%',
          performance: '≤ 30'
        },
        {
          stt: 5,
          category: 'Cường độ kéo dán bám dính trong 14 ngày /Mpa',
          performance: '≥ 0.20'
        },
        {
          stt: 6,
          category: 'Tỉ lệ co vào trong 28 ngày/%',
          performance: '≤ 0.20'
        },
        {
          stt: 7,
          category: 'Cường độ chịu nén 28/Mpa',
          performance: '≥ 10'
        },
        {
          stt: 8,
          category: 'Tính chống băng giá',
          performance:
            '≤ 5 (Tỷ lệ cường độ tổn thất/%)\n≤ 25 (Tỷ lệ cường độ tổn thất/%)'
        }
      ]
    },
    transportationAndStorage: [
      'Tránh dính mưa, va đập trong quá trình vận chuyển để tránh làm hỏng bao bì',
      'Cần bảo quản trong kho khô ráo, thoáng mát, tránh ẩm ướt, không được để tiếp xúc với ánh nắng trực tiếp và với nước.',
      'Trong điều kiện vận chuyển và bảo quản thông thường, thời gian bảo quản sản phẩm là 6 tháng.',
      'Sản phẩm này nên được bảo quản ngoài tầm với của trẻ em để tránh vô tình ăn phải.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu nó vô tình bắn vào mắt, bạn hãy rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes:
        'Màng quấn palletizer và pallet đáy do nhà máy trang bị sẽ có lợi hơn cho việc chống thấm sản phẩm, chống bụi, chống ẩm và bảo vệ bao bì sản phẩm, vì vậy vui lòng không làm hỏng nó trước khi sử dụng! (Không cung cấp màng và pallet khi số lượng)'
    }
  },
  {
    id: 'dr-m402',
    name: 'Vữa màu hai thành phần DR-M402',
    image: '/images/products/dr-m402.svg',
    description: 'Chất tăng bám dính',
    category: 'MORTAL',
    href: ''
  },
  {
    id: 'ta-s100',
    name: 'Keo dán gạch loại siêu dính thông dụng TA-S100 VASA',
    code: 'TA-S100',
    image: '/images/products/ta-s100.svg',
    shortDescription: 'Chất tăng bám dính',
    category: 'TILE',
    href: 'products/ta-s100',
    description:
      'Keo dán gạch siêu dính TA-S100 VASA được pha chế từ xi măng chất lượng cao, cát tinh chế và các phụ gia polymer chức năng. Sản phẩm phù hợp với nhiều loại gạch và bề mặt nền như vữa, bê tông, xi măng, tường gạch,... Dạng bột màu xám, dễ nhào trộn và thân thiện với môi trường.',
    images: {
      main: '/TA-S100-thumb1.png',
      thumbnails: [
        '/TA-S100-thumb1.png',
        '/TA-S100-thumb2.png',
        '/TA-S100-thumb3.png',
        '/TA-S100-thumb4.png',
        '/TA-S100-thumb5.png'
      ]
    },
    advantages: [
      'Tính thông dụng cao, phù hợp nhiều loại gạch',
      'Độ bám dính cao, chống rơi gạch khi thi công',
      'Thi công trơn tru, dễ nhào trộn',
      'Thân thiện với môi trường'
    ],
    packaging: 'Quy cách đóng gói: 25kg/bao',
    technicalSpecifications: {
      standard:
        'Đạt các tiêu chuẩn C1T: TCVN 7899-1:2008, TCVN 7899-2:2008, ISO 13007-1:2014, ISO 13007-2:2013, JC/T 547-2017',
      specifications: [
        {
          stt: 1,
          category: 'Cường độ kéo dãn bám dính ban đầu',
          performance: '≥0.5 MPa'
        },
        {
          stt: 2,
          category: 'Sau khi ngâm nước',
          performance: '≥0.5 MPa'
        },
        {
          stt: 3,
          category: 'Sau khi lão hóa nhiệt',
          performance: '≥0.5 MPa'
        },
        {
          stt: 4,
          category: 'Sau chu kỳ đóng băng và tan băng',
          performance: '≥0.5 MPa'
        },
        {
          stt: 5,
          category: 'Sau khi để khô 20 phút',
          performance: '≥0.5 MPa'
        },
        {
          stt: 6,
          category: 'Độ trượt',
          performance: '≤0.5 mm'
        }
      ]
    },
    transportationAndStorage: [
      'Tránh mưa, va đập trong quá trình vận chuyển để tránh làm hỏng bao bì.',
      'Cần bảo quản trong kho khô ráo, thoáng mát để chống ẩm, nghiêm cấm tiếp xúc với nước.',
      'Trong điều kiện vận chuyển và bảo quản thông thường, thời gian bảo quản sản phẩm là 12 tháng.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu vô tình bắn vào mắt, vui lòng rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes: ''
    }
  },
  {
    id: 'ta-s101',
    name: 'Keo dán gạch tiết kiệm TA-S101 VASA',
    code: 'TA-S101',
    image: '/images/products/ta-s101.svg',
    shortDescription: 'Loại siêu dính thông dụng',
    category: 'TILE',
    href: 'products/ta-s101',
    description:
      'Keo dán gạch tiết kiệm TA-S101 VASA được pha chế bằng xi măng chất lượng cao làm vật liệu kết dính vô cơ, cát phân loại tinh chế làm cốt liệu, và bổ sung nhiều loại phụ gia chức năng khác nhau. Sản phẩm này có thể sử dụng trực tiếp mà không cần ngâm nước trước, đặc biệt phù hợp để dán các loại gạch men thông thường trong nhà.',
    images: {
      main: '',
      thumbnails: []
    },
    advantages: [
      'Độ bám dính cao',
      'Miếng dán mỏng giúp tiết kiệm không gian',
      'Cấu trúc mịn và dễ nhào trộn',
      'Thân thiện với môi trường'
    ],
    packaging: 'Quy cách đóng gói: 25kg/bao',
    technicalSpecifications: {
      standard: 'TA-S101 VASA tuân thủ tiêu chuẩn GB/T25181-2019 Vữa trộn sẵn',
      specifications: [
        {
          stt: 1,
          category: 'Độ bền liên kết kéo ban đầu (MPa)',
          performance: '≥ 0.5'
        },
        {
          stt: 2,
          category: 'Độ bền liên kết sau khi ngâm nước (MPa)',
          performance: '≥ 0.5'
        },
        {
          stt: 3,
          category: 'Độ bền liên kết sau khi để khô 20 phút (MPa)',
          performance: '≥ 0.5'
        }
      ]
    },
    transportationAndStorage: [
      'Tránh mưa, va đập trong quá trình vận chuyển để tránh làm hỏng bao bì.',
      'Cần bảo quản trong kho khô ráo, thoáng mát để chống ẩm, nghiêm cấm tiếp xúc với nước.',
      'Trong điều kiện vận chuyển và bảo quản thông thường, thời gian bảo quản sản phẩm là 12 tháng.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu vô tình bắn vào mắt, vui lòng rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes: ''
    }
  },
  {
    id: 'ta-s106',
    name: 'Keo dán gạch loại gạch nặng TA-S106 VASA',
    code: 'TA-S106',
    image: '/images/products/ta-s106.svg',
    shortDescription: 'Loại gạch nặng',
    category: 'TILE',
    href: 'products/ta-s106',
    description:
      'Keo dán gạch loại gạch nặng TA-S106 VASA được pha chế bằng xi măng chất lượng cao làm chất kết dính vô cơ, với cốt liệu là cát đã được phân loại tinh chế, đồng thời bổ sung nhiều loại phụ gia polymer chức năng. Sản phẩm này có thể được sử dụng trực tiếp luôn sau khi thêm nước. Sản phẩm phù hợp để sử dụng trên các bề mặt vững chắc như vữa, bê tông, xi măng, tường gạch,...\n\nSản phẩm có dạng bột màu xám.',
    images: {
      main: '/TA-S106-thumb1.png',
      thumbnails: [
        '/TA-S106-thumb1.png',
        '/TA-S106-thumb2.png',
        '/TA-S106-thumb3.png',
        '/TA-S106-thumb4.png',
        '/TA-S106-thumb5.png'
      ]
    },
    advantages: [
      'Độ bám dính siêu cao',
      'Có thể chống rơi gạch trong quá trình thi công',
      'Thi công trơn tru, dễ nhấn ép',
      'Bảo vệ môi trường'
    ],
    packaging: 'Quy cách đóng gói: 25kg/bao',
    technicalSpecifications: {
      standard:
        'Keo dán gạch loại gạch nặng TA-S106 VASA đạt các yêu cầu C1T trong tiêu chuẩn TCVN 7899-1:2008, TCVN 7899-2:2008, ISO 13007-1:2014, ISO 13007-2:2013, JC/T 547-2017',
      specifications: [
        {
          stt: 1,
          category: 'Cường độ kéo dãn bám dính ban đầu (MPa)',
          performance: '≥ 1.0'
        },
        {
          stt: 2,
          category: 'Cường độ kéo dãn bám dính sau khi ngâm nước (MPa)',
          performance: '≥ 1.0'
        },
        {
          stt: 3,
          category: 'Cường độ kéo dãn bám dính sau khi lão hóa nhiệt (MPa)',
          performance: '≥ 1.0'
        },
        {
          stt: 4,
          category:
            'Cường độ kéo dãn bám dính sau chu kỳ đóng băng và tan băng (MPa)',
          performance: '≥ 1.0'
        },
        {
          stt: 5,
          category: 'Cường độ kéo dãn bám dính sau khi để khô 20 phút (MPa)',
          performance: '≥ 0.5'
        },
        { stt: 6, category: 'Độ trượt (mm)', performance: '≤ 0.5' }
      ]
    },
    transportationAndStorage: [
      'Tránh mưa, va đập trong quá trình vận chuyển để tránh làm hỏng bao bì.',
      'Cần bảo quản trong kho khô ráo, thoáng mát để chống ẩm, nghiêm cấm tiếp xúc với nước.',
      'Trong điều kiện vận chuyển và bảo quản thông thường, thời gian bảo quản sản phẩm là 12 tháng.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu vô tình bắn vào mắt, vui lòng rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes: ''
    }
  },
  {
    id: 'ta-s106',
    name: 'Keo dán gạch TA-S106',
    image: '/images/products/ta-s106.svg',
    description: 'Loại gạch nặng',
    category: 'TILE',
    href: 'products/ta-s106'
  },
  {
    id: 'tf-g100',
    name: 'Keo chà ron thẩm mỹ TF-G100 Hengcai',
    code: 'TF-G100',
    image: '/images/products/tf-g100.svg',
    shortDescription: 'Loại siêu dính thông dụng',
    category: 'TILE',
    href: 'products/tf-g100',
    description:
      'Keo chà ron thẩm mỹ VASA TF-G100 Hengcai là một loại vật liệu trang trí khe gạch, góc cạnh thiết bị nhà bếp và nhà vệ sinh, góc trong nhà, có chất lượng như sứ và màu sắc tươi sáng. Sản phẩm này cải thiện nhược điểm của keo chà ron truyền thống là khó pha trộn và thi công, với độ chảy tốt hơn, đồng thời nâng cao mức độ thân thiện với môi trường và ít mùi hơn.\n\nSản phẩm là dạng keo, nhiều màu sắc (Tham khảo bảng màu đính kèm trong ảnh minh họa, có 15 màu khác nhau).',
    images: {
      main: '/TF-G100-thumb1.png',
      thumbnails: [
        '/TF-G100-thumb1.png',
        '/TF-G100-thumb2.png',
        '/TF-G100-thumb3.png',
        '/TF-G100-thumb4.png'
      ]
    },
    advantages: [
      'Sáng bóng và bền lâu',
      'Thân thiện với môi trường và ít mùi',
      'Láng mịn và dễ thi công',
      'Chống thấm và chống mốc',
      'Chống bẩn và dễ dàng làm sạch'
    ],
    packaging: 'Quy cách đóng gói: 420g×12 lọ/ thùng',
    technicalSpecifications: {
      standard:
        'Keo chà ron thẩm mỹ TF-G100 tuân thủ các yêu cầu tiêu chuẩn của Q/SY YHF0099-2019 "Keo chà ron thẩm mỹ"',
      specifications: [
        { stt: 1, category: 'Thời gian khô bề mặt', performance: '≤ 4h' },
        { stt: 2, category: 'Độ chảy sệ (dọc)', performance: '≤ 3 mm' },
        { stt: 3, category: 'Chiều ngang', performance: 'Không biến dạng' },
        {
          stt: 4,
          category: 'Đường kính 50mm không có vết nứt',
          performance: ''
        },
        { stt: 5, category: 'Hàm lượng chất rắn', performance: '≥ 96%' },
        { stt: 6, category: 'Độ cứng', performance: '≥ 60 Shod D' },
        { stt: 7, category: 'Tính chống mài mòn', performance: '≤ 50 mg' },
        { stt: 8, category: 'Kháng axit (axit axetic 5%)', performance: '' },
        { stt: 9, category: 'Kháng kiềm (dung dịch NaOH 5%)', performance: '' },
        {
          stt: 10,
          category: 'Không bị tác động bởi giấm, trà',
          performance: ''
        },
        { stt: 11, category: 'Cường độ kéo dãn', performance: '≥ 10 MPa' },
        {
          stt: 12,
          category: 'Độ bền liên kết với gạch men',
          performance: '≥ 3.0 MPa'
        }
      ]
    },
    transportationAndStorage: [
      'Trong quá trình vận chuyển, tránh tiếp xúc với ánh nắng, mưa và va đập, tránh làm hỏng bao bì và đảm bảo miệng chai sản phẩm hướng lên trên.',
      'Sản phẩm nên được bảo quản ở nơi khô ráo, thoáng mát và nhiệt độ bảo quản không được cao hơn 40°C.',
      'Trong điều kiện bảo quản và vận chuyển bình thường, thời gian bảo quản là 12 tháng.'
    ],
    safetyRegulations: {
      warning:
        'Sản phẩm này có chứa các thành phần hóa học gây kích ứng mắt và da, vui lòng mang các dụng cụ bảo hộ cần thiết trong quá trình thi công. Nếu vô tình bắn vào mắt, vui lòng rửa ngay bằng nước sạch và tìm cách điều trị y tế kịp thời.',
      notes: ''
    }
  },
  {
    id: 'wm-102',
    name: 'Chất phủ chống thấm WM-102',
    image: '/images/products/wm-102.svg',
    description: 'Loại polyme màu',
    category: 'vat-tu-chong-tham'
  }
];
