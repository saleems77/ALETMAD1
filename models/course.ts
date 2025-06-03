// models/course.ts
export interface Track {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface Course {
    title: string;
    description: string;
    price: number;
    discount: number;
    track: string;
    level: string;
    thumbnail: string;
    videoUrl: string;
    duration: number;
    prerequisites: string[];
    objectives: string[];
    syllabus: string[];
    instructor: string;
    createdAt: Date;
    updatedAt: Date;
    ratings: number[];
    enrolledStudents: number;
    status: 'draft' | 'published';
  }