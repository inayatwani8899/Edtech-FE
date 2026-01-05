import { User, UserRole, UserStatus, Test, TestAssignment, TestAssignmentStatus, Student, Counselor, School, Admin } from '../types/types';

// Hashing passwords is a good practice, but for this mock data, we'll use plain text.
export const seedUsers: User[] = [
  // Admins
  { id: 'admin1', name: 'Admin User', email: 'admin@test.com', password: 'password', role: UserRole.Admin, status: UserStatus.Active } as Admin,
  
  // Schools
  { id: 'school1', name: 'Greenwood High', email: 'contact@greenwood.com', password: 'password', role: UserRole.School, status: UserStatus.Active, orgType: 'k12', userCount: '1000+' } as School,
  { id: 'school2', name: 'Oakwood University', email: 'admin@oakwood.edu', password: 'password', role: UserRole.School, status: UserStatus.Active, orgType: 'university', userCount: '1000+' } as School,

  // Counselors
  { id: 'counselor1', name: 'Dr. Emily Carter', email: 'ecarter@test.com', password: 'password', role: UserRole.Counselor, status: UserStatus.Active, schoolId: 'school1', institution: 'Greenwood High', experience: 10, specialization: 'Career Counseling' } as Counselor,
  { id: 'counselor2', name: 'John Davis', email: 'jdavis@oakwood.edu', password: 'password', role: UserRole.Counselor, status: UserStatus.Active, schoolId: 'school2', institution: 'Oakwood University', experience: 5, specialization: 'Academic Guidance' } as Counselor,

  // Students
  { id: 'student1', name: 'Alice Johnson', email: 'student@test.com', password: 'password', role: UserRole.Student, status: UserStatus.Active, counselorId: 'counselor1', grade: '11', schoolName: 'Greenwood High' } as Student,
  { id: 'student2', name: 'Bob Williams', email: 'bob@test.com', password: 'password', role: UserRole.Student, status: UserStatus.Active, counselorId: 'counselor1', grade: '12', schoolName: 'Greenwood High' } as Student,
  { id: 'student3', name: 'Charlie Brown', email: 'charlie@test.com', password: 'password', role: UserRole.Student, status: UserStatus.Active, counselorId: 'counselor2', grade: 'college', schoolName: 'Oakwood University' } as Student,
  { id: 'student4', name: 'Diana Miller', email: 'diana@test.com', password: 'password', role: UserRole.Student, status: UserStatus.Inactive, counselorId: 'counselor2', grade: 'college', schoolName: 'Oakwood University' } as Student,
];

export const seedTests: Test[] = [
  {
    id: 'test1',
    title: 'Cognitive Aptitude Assessment',
    description: 'Measures logical reasoning, numerical ability, and problem-solving skills.',
    duration: 30,
    creatorId: 'counselor1',
    questions: [
      { id: 'q1', text: 'If a car travels at 60 mph, how long does it take to travel 180 miles?', options: ['2 hours', '3 hours', '4 hours', '2.5 hours'], correctAnswer: '3 hours' },
      { id: 'q2', text: 'Which number comes next in the series: 2, 4, 8, 16, ?', options: ['24', '32', '64', '20'], correctAnswer: '32' },
      { id: 'q3', text: 'All roses are flowers. Some flowers fade quickly. Therefore...', options: ['All roses fade quickly', 'Some roses fade quickly', 'No conclusion can be drawn', 'All flowers are roses'], correctAnswer: 'No conclusion can be drawn' },
    ],
  },
  {
    id: 'test2',
    title: 'Personality Insights',
    description: 'Based on the Big Five model to understand your personality traits.',
    creatorId: 'counselor1',
    questions: [
        { id: 'p1', text: 'Are you more of an introvert or an extrovert?', options: ['Introvert', 'Extrovert', 'Somewhere in between'], },
        { id: 'p2', text: 'Do you prefer planning things in advance or being spontaneous?', options: ['Planning', 'Spontaneous', 'A bit of both'], },
    ],
  },
  {
      id: 'test3',
      title: 'Career Interest Inventory',
      description: 'Helps identify career paths that align with your interests and skills.',
      creatorId: 'counselor2',
      questions: [
          {id: 'c1', text: 'Which activity do you enjoy most?', options: ['Building things', 'Helping people', 'Solving complex problems', 'Creating art']}
      ]
  }
];

export const seedAssignments: TestAssignment[] = [
  {
    id: 'assign1',
    studentId: 'student1',
    testId: 'test1',
    status: TestAssignmentStatus.Pending,
    assignedDate: new Date('2023-10-25T10:00:00Z').toISOString(),
    answers: {},
    markedForReview: [],
  },
  {
    id: 'assign2',
    studentId: 'student1',
    testId: 'test2',
    status: TestAssignmentStatus.Completed,
    assignedDate: new Date('2023-10-20T10:00:00Z').toISOString(),
    startTime: new Date('2023-10-20T11:00:00Z').getTime(),
    endTime: new Date('2023-10-20T11:15:00Z').getTime(),
    answers: { p1: 'Introvert', p2: 'Planning' },
    score: 85,
    markedForReview: [],
  },
  {
    id: 'assign3',
    studentId: 'student2',
    testId: 'test1',
    status: TestAssignmentStatus.InProgress,
    assignedDate: new Date('2023-10-26T09:00:00Z').toISOString(),
    startTime: new Date().getTime() - 10 * 60 * 1000, // started 10 minutes ago
    answers: { q1: '3 hours' },
    markedForReview: ['q2'],
  }
];