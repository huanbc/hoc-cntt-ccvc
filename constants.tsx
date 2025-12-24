
import React from 'react';
import type { Category } from './types';
import { CodeBracketIcon, ServerStackIcon, CloudIcon, CircleStackIcon, CommandLineIcon, CpuChipIcon, DocumentTextIcon, PencilSquareIcon, PhotoIcon, VideoCameraIcon } from './components/icons/Icons';

export const LEARNING_TOPICS: Category[] = [
  {
    name: 'Ôn thi Công chức, Viên chức',
    topics: [
      { 
        name: 'Kiến thức Máy tính Cơ bản', 
        icon: CpuChipIcon,
        lessons: [
          'Bài 1: Các khái niệm cơ bản về máy tính và CNTT',
          'Bài 2: Cấu trúc và hoạt động của máy tính',
          'Bài 3: Thiết bị lưu trữ và các loại bộ nhớ',
          'Bài 4: Mạng máy tính và các khái niệm liên quan',
          'Bài 5: Virus máy tính và cách phòng chống',
        ],
      },
      { 
        name: 'Sử dụng Hệ điều hành Windows', 
        icon: CommandLineIcon,
        lessons: [
          'Bài 1: Làm quen với Windows',
          'Bài 2: Quản lý tệp và thư mục với File Explorer',
          'Bài 3: Tùy chỉnh và cá nhân hóa Windows',
          'Bài 4: Sử dụng các công cụ và tiện ích hệ thống',
        ],
      },
      { 
        name: 'Soạn thảo văn bản với Word', 
        icon: DocumentTextIcon,
        lessons: [
          'Bài 1: Giới thiệu Microsoft Word và giao diện',
          'Bài 2: Định dạng văn bản và đoạn văn',
          'Bài 3: Chèn và làm việc với bảng (Table)',
          'Bài 4: Chèn đối tượng (ảnh, hình vẽ, biểu đồ)',
          'Bài 5: Trình bày và in ấn văn bản',
        ],
      },
      { 
        name: 'Xử lý bảng tính với Excel', 
        icon: DocumentTextIcon,
        lessons: [
          'Bài 1: Khái niệm cơ bản về Microsoft Excel',
          'Bài 2: Nhập liệu và định dạng dữ liệu',
          'Bài 3: Sử dụng các hàm tính toán cơ bản',
          'Bài 4: Sắp xếp, lọc và quản lý dữ liệu',
          'Bài 5: Tạo và tùy chỉnh biểu đồ',
        ],
      },
      { 
        name: 'Tạo trình chiếu với PowerPoint', 
        icon: DocumentTextIcon,
        lessons: [
          'Bài 1: Bắt đầu với PowerPoint',
          'Bài 2: Soạn thảo nội dung và thiết kế slide',
          'Bài 3: Chèn đa phương tiện và đồ họa',
          'Bài 4: Sử dụng hiệu ứng và chuyển tiếp',
          'Bài 5: Trình chiếu và các tùy chọn nâng cao',
        ],
      },
      { 
        name: 'Sử dụng Internet & Email', 
        icon: CloudIcon,
        lessons: [
          'Bài 1: Tổng quan về Internet và World Wide Web',
          'Bài 2: Sử dụng trình duyệt web hiệu quả',
          'Bài 3: Tìm kiếm thông tin trên Internet',
          'Bài 4: Sử dụng thư điện tử (Email)',
          'Bài 5: An toàn và bảo mật thông tin trực tuyến',
        ],
      },
    ],
  },
  {
    name: 'Tin học Văn phòng',
    topics: [
      { name: 'Microsoft Word', icon: DocumentTextIcon },
      { name: 'Microsoft Excel', icon: DocumentTextIcon },
      { name: 'Microsoft PowerPoint', icon: DocumentTextIcon },
    ],
  },
  {
    name: 'Tin học Cơ bản',
    topics: [
      { name: 'Phần cứng Máy tính', icon: CpuChipIcon },
      { name: 'Phần mềm', icon: ServerStackIcon },
      { name: 'Hệ điều hành', icon: CommandLineIcon },
    ],
  },
  {
    name: 'Thiết kế & Sáng tạo',
    topics: [
      { name: 'Canva', icon: PencilSquareIcon },
      { name: 'Chỉnh sửa ảnh', icon: PhotoIcon },
      { name: 'Chỉnh sửa video', icon: VideoCameraIcon },
      { name: 'Thiết kế CAD', icon: PencilSquareIcon },
    ],
  },
  {
    name: 'Phát triển Web',
    topics: [
      { name: 'HTML', icon: CodeBracketIcon },
      { name: 'CSS', icon: CodeBracketIcon },
      { name: 'JavaScript', icon: CodeBracketIcon },
      { name: 'React', icon: CodeBracketIcon },
      { name: 'Node.js', icon: ServerStackIcon },
    ],
  },
  {
    name: 'Cơ sở dữ liệu',
    topics: [
      { name: 'SQL', icon: CircleStackIcon },
      { name: 'NoSQL', icon: CircleStackIcon },
      { name: 'MongoDB', icon: CircleStackIcon },
      { name: 'PostgreSQL', icon: CircleStackIcon },
    ],
  },
  {
    name: 'Cloud & DevOps',
    topics: [
      { name: 'Cloud Computing', icon: CloudIcon },
      { name: 'Docker', icon: ServerStackIcon },
      { name: 'Git', icon: CommandLineIcon },
      { name: 'CI/CD', icon: CommandLineIcon },
    ],
  },
   {
    name: 'Kiến thức Cốt lõi',
    topics: [
      { name: 'Data Structures', icon: CpuChipIcon },
      { name: 'Algorithms', icon: CpuChipIcon },
      { name: 'Networking', icon: CloudIcon },
      { name: 'Operating Systems', icon: ServerStackIcon },
    ],
  },
];
