import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, Test, TestAssignment, UserRole, UserStatus, Student, Counselor, School, Admin, TestAssignmentStatus } from '../types/types';
import { seedUsers, seedTests, seedAssignments } from './seedData';

interface DataContextType {
  users: User[];
  tests: Test[];
  assignments: TestAssignment[];
  findUserByEmail: (email: string) => User | undefined;
  addUser: (userData: Omit<Student, 'id' | 'status'> | Omit<Counselor, 'id' | 'status'> | Omit<School, 'id' | 'status'> | Omit<Admin, 'id' | 'status'>) => User | null;
  updateUser: (userId: string, updates: Partial<User>) => void;
  getUserById: (userId: string) => User | undefined;
  getUsersByRole: (role: UserRole) => User[];
  getAllStudents: () => Student[];
  getAllTests: () => Test[];
  getAssignmentsForStudent: (studentId: string) => TestAssignment[];
  getAssignmentById: (assignmentId: string) => TestAssignment | undefined;
  getTestById: (testId: string) => Test | undefined;
  getStudentsForCounselor: (counselorId: string) => Student[];
  getTestsForCounselor: (creatorId: string) => Test[];
  getCounselorsForSchool: (schoolId: string) => Counselor[];
  assignTestToStudents: (testId: string, studentIds: string[]) => void;
  startTest: (assignmentId: string) => void;
  updateAssignment: (assignmentId: string, updates: Partial<TestAssignment>) => void;
  submitTest: (assignmentId: string) => void;
  addTest: (test: Omit<Test, 'id'>) => void;
  deleteTest: (testId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [tests, setTests] = useState<Test[]>(seedTests);
  const [assignments, setAssignments] = useState<TestAssignment[]>(seedAssignments);

  const findUserByEmail = useCallback((email: string) => users.find(u => u.email === email), [users]);

  const addUser = (userData: Omit<Student, 'id' | 'status'> | Omit<Counselor, 'id' | 'status'> | Omit<School, 'id' | 'status'> | Omit<Admin, 'id' | 'status'>) => {
    if (findUserByEmail(userData.email)) {
      return null;
    }
    const newUser: User = {
      ...userData,
      id: `user${users.length + 1}`,
      status: UserStatus.Active,
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === userId ? { ...user, ...updates } : user));
  };
  
  const getUserById = useCallback((userId: string) => users.find(u => u.id === userId), [users]);
  
  const getUsersByRole = useCallback((role: UserRole) => users.filter(u => u.role === role), [users]);

  const getAllStudents = useCallback(() => users.filter(u => u.role === UserRole.Student) as Student[], [users]);

  const getAllTests = useCallback(() => tests, [tests]);

  const getAssignmentsForStudent = useCallback((studentId: string) => assignments.filter(a => a.studentId === studentId), [assignments]);

  const getAssignmentById = useCallback((assignmentId: string) => assignments.find(a => a.id === assignmentId), [assignments]);

  const getTestById = useCallback((testId: string) => tests.find(t => t.id === testId), [tests]);

  const getStudentsForCounselor = useCallback((counselorId: string) => {
    return users.filter(u => u.role === UserRole.Student && (u as Student).counselorId === counselorId) as Student[];
  }, [users]);
  
  const getTestsForCounselor = useCallback((creatorId: string) => tests.filter(t => t.creatorId === creatorId), [tests]);

  const getCounselorsForSchool = useCallback((schoolId: string) => {
    return users.filter(u => u.role === UserRole.Counselor && (u as Counselor).schoolId === schoolId) as Counselor[];
  }, [users]);

  const assignTestToStudents = (testId: string, studentIds: string[]) => {
      const newAssignments: TestAssignment[] = studentIds.map(studentId => ({
          id: `assign${assignments.length + Math.random()}`,
          studentId,
          testId,
          status: TestAssignmentStatus.Pending,
          assignedDate: new Date().toISOString(),
          answers: {},
          markedForReview: [],
      }));
      setAssignments(prev => [...prev, ...newAssignments]);
  };
  
  const startTest = (assignmentId: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === assignmentId ? { ...a, status: TestAssignmentStatus.InProgress, startTime: Date.now() } : a
    ));
  };

  const updateAssignment = (assignmentId: string, updates: Partial<TestAssignment>) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, ...updates } : a
    ));
  };

  const submitTest = (assignmentId: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, status: TestAssignmentStatus.Completed, endTime: Date.now() } : a
    ));
  };

  const addTest = (testData: Omit<Test, 'id'>) => {
    const newTest: Test = {
      ...testData,
      id: `test${tests.length + 1}`,
    };
    setTests(prev => [...prev, newTest]);
  };

  const deleteTest = (testId: string) => {
    setTests(prevTests => prevTests.filter(test => test.id !== testId));
    setAssignments(prevAssignments => prevAssignments.filter(assignment => assignment.testId !== testId));
  };

  return (
    <DataContext.Provider value={{ users, tests, assignments, findUserByEmail, addUser, updateUser, getUserById, getUsersByRole, getAllStudents, getAllTests, getAssignmentsForStudent, getAssignmentById, getTestById, getStudentsForCounselor, getTestsForCounselor, getCounselorsForSchool, assignTestToStudents, startTest, updateAssignment, submitTest, addTest, deleteTest }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};