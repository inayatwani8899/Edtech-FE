// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useAuth } from "@/contexts/AuthContext";
// import { 
//   Users, 
//   FileText, 
//   BarChart3, 
//   Settings,
//   Search,
//   Plus,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   Filter
// } from "lucide-react";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   status: "active" | "inactive";
//   lastActive: string;
//   testsCompleted: number;
// }

// interface Test {
//   id: string;
//   title: string;
//   category: string;
//   questions: number;
//   duration: number;
//   status: "active" | "draft" | "archived";
//   completions: number;
//   createdDate: string;
// }

// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     role: "student",
//     status: "active",
//     lastActive: "2024-01-20",
//     testsCompleted: 8
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     role: "professional",
//     status: "active",
//     lastActive: "2024-01-19",
//     testsCompleted: 12
//   },
//   {
//     id: "3",
//     name: "Mike Johnson",
//     email: "mike.johnson@example.com",
//     role: "counselor",
//     status: "active",
//     lastActive: "2024-01-18",
//     testsCompleted: 25
//   }
// ];

// const mockTests: Test[] = [
//   {
//     id: "1",
//     title: "Cognitive Ability Assessment",
//     category: "Aptitude",
//     questions: 50,
//     duration: 60,
//     status: "active",
//     completions: 156,
//     createdDate: "2024-01-01"
//   },
//   {
//     id: "2",
//     title: "Big Five Personality Test",
//     category: "Personality",
//     questions: 60,
//     duration: 45,
//     status: "active",
//     completions: 203,
//     createdDate: "2024-01-01"
//   },
//   {
//     id: "3",
//     title: "Leadership Assessment",
//     category: "Professional",
//     questions: 40,
//     duration: 35,
//     status: "draft",
//     completions: 0,
//     createdDate: "2024-01-15"
//   }
// ];

// export const Manage = () => {
//   const { user } = useAuth();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userFilter, setUserFilter] = useState("all");
//   const [testFilter, setTestFilter] = useState("all");

//   const filteredUsers = mockUsers.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = userFilter === "all" || user.role === userFilter;
//     return matchesSearch && matchesFilter;
//   });

//   const filteredTests = mockTests.filter(test => {
//     const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = testFilter === "all" || test.status === testFilter;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge variant="default">Active</Badge>;
//       case "inactive":
//         return <Badge variant="secondary">Inactive</Badge>;
//       case "draft":
//         return <Badge variant="outline">Draft</Badge>;
//       case "archived":
//         return <Badge variant="destructive">Archived</Badge>;
//       default:
//         return <Badge variant="secondary">{status}</Badge>;
//     }
//   };

//   const getRoleBadge = (role: string) => {
//     const colors: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
//       admin: "default",
//       counselor: "secondary",
//       professional: "outline",
//       student: "secondary"
//     };
//     return <Badge variant={colors[role] || "secondary"}>{role}</Badge>;
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Management Dashboard</h1>
//         <div className="flex gap-2">
//           <Button>
//             <Download className="h-4 w-4 mr-2" />
//             Export Data
//           </Button>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Create Test
//           </Button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center">
//               <Users className="h-8 w-8 text-primary" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-muted-foreground">Total Users</p>
//                 <p className="text-2xl font-bold">{mockUsers.length}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center">
//               <FileText className="h-8 w-8 text-primary" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-muted-foreground">Active Tests</p>
//                 <p className="text-2xl font-bold">{mockTests.filter(t => t.status === "active").length}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center">
//               <BarChart3 className="h-8 w-8 text-primary" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-muted-foreground">Test Completions</p>
//                 <p className="text-2xl font-bold">359</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center">
//               <Settings className="h-8 w-8 text-primary" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
//                 <p className="text-2xl font-bold">47</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="users" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="users">User Management</TabsTrigger>
//           <TabsTrigger value="tests">Test Management</TabsTrigger>
//           <TabsTrigger value="analytics">Analytics</TabsTrigger>
//         </TabsList>

//         <TabsContent value="users" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>User Management</CardTitle>
//               <CardDescription>Manage users and their access permissions</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-4 mb-6">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search users..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//                 <Select value={userFilter} onValueChange={setUserFilter}>
//                   <SelectTrigger className="w-48">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Roles</SelectItem>
//                     <SelectItem value="student">Students</SelectItem>
//                     <SelectItem value="professional">Professionals</SelectItem>
//                     <SelectItem value="counselor">Counselors</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>User</TableHead>
//                     <TableHead>Role</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Tests Completed</TableHead>
//                     <TableHead>Last Active</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredUsers.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>
//                         <div className="flex items-center">
//                           <Avatar className="h-8 w-8">
//                             <AvatarImage src={user.email} />
//                             <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//                           </Avatar>
//                           <div className="ml-3">
//                             <p className="font-medium">{user.name}</p>
//                             <p className="text-sm text-muted-foreground">{user.email}</p>
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{getRoleBadge(user.role)}</TableCell>
//                       <TableCell>{getStatusBadge(user.status)}</TableCell>
//                       <TableCell>{user.testsCompleted}</TableCell>
//                       <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button variant="ghost" size="sm">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="tests" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Test Management</CardTitle>
//               <CardDescription>Create, edit, and manage psychometric tests</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-4 mb-6">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search tests..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//                 <Select value={testFilter} onValueChange={setTestFilter}>
//                   <SelectTrigger className="w-48">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="draft">Draft</SelectItem>
//                     <SelectItem value="archived">Archived</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Test Name</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Questions</TableHead>
//                     <TableHead>Duration</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Completions</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredTests.map((test) => (
//                     <TableRow key={test.id}>
//                       <TableCell className="font-medium">{test.title}</TableCell>
//                       <TableCell>{test.category}</TableCell>
//                       <TableCell>{test.questions}</TableCell>
//                       <TableCell>{test.duration} min</TableCell>
//                       <TableCell>{getStatusBadge(test.status)}</TableCell>
//                       <TableCell>{test.completions}</TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button variant="ghost" size="sm">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm">
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="analytics" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>User Activity</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex justify-between">
//                     <span>Daily Active Users</span>
//                     <span className="font-bold">127</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Weekly Active Users</span>
//                     <span className="font-bold">543</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Monthly Active Users</span>
//                     <span className="font-bold">1,234</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Test Completion Rate</span>
//                     <span className="font-bold">87%</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Popular Tests</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {mockTests.map((test, index) => (
//                     <div key={test.id} className="flex justify-between items-center">
//                       <div>
//                         <p className="font-medium">{test.title}</p>
//                         <p className="text-sm text-muted-foreground">{test.category}</p>
//                       </div>
//                       <Badge variant="outline">{test.completions}</Badge>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };
// import React, { useState, useEffect, useCallback } from 'react';
// import { User, UserRole } from "@/types/auth";
// import { usersApi } from '../services/student-apis'; // Adjust path as necessary
// import { Search, Plus, Edit, Trash2 } from 'lucide-react'; // Example icons (assuming basic icons are needed)

// // --- Reusable Pagination Component (As provided by you) ---
// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   limit: number;
//   onLimitChange: (limit: number) => void;
// }
// const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, limit, onLimitChange }) => {
//   // A simplified component for demonstration
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//   const limits = [5,10, 25, 50];

//   return (
//     <div className="flex justify-between items-center p-4">
//       <div className="flex space-x-2">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         {pages.map(page => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             disabled={page === currentPage}
//             className={`px-3 py-1 border rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-black'}`}
//           >
//             {page}
//           </button>
//         ))}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 border rounded bg-gray-100 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//       <div className="flex items-center space-x-2">
//         <label htmlFor="limit-select" className="text-sm text-gray-600">Users per page:</label>
//         <select
//           id="limit-select"
//           value={limit}
//           onChange={(e) => onLimitChange(Number(e.target.value))}
//           className="border border-gray-300 rounded p-1 text-sm"
//         >
//           {limits.map(l => <option key={l} value={l}>{l}</option>)}
//         </select>
//       </div>
//     </div>
//   );
// };
// // --- End Pagination Component ---


// export const Manage: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);

//   // Filtering/Search State
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState<string>('all');

//   // Debounced search term for API call
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

//   // Available roles for the filter dropdown
//   const availableRoles: (UserRole | 'all')[] = ['all', 'student', 'professional', 'counselor', 'admin'];

//   // Debounce effect for search term
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//       // Reset page when search term changes
//       setCurrentPage(1);
//     }, 500); // 500ms delay

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchTerm]);

//   // Role filter change handler
//   const handleRoleFilterChange = (newFilter: string) => {
//     setRoleFilter(newFilter);
//     setCurrentPage(1); // Reset page on filter change
//   };

//   // Data Fetching Logic
//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // The API call uses the state variables (page, limit, debounced search, and filter)
//       const response = await usersApi.getUsers({
//         page: currentPage,
//         limit: limit,
//         search: debouncedSearchTerm,
//         filter: roleFilter !== 'all' ? roleFilter : undefined,
//       });

//       setUsers(response.data);
//       setTotalPages(response.totalPages);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError("Failed to fetch user data. Please try again.");
//       setUsers([]);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, limit, debouncedSearchTerm, roleFilter]);

//   // Effect to run the fetch when dependencies change (i.e., pagination, filter, or search changes)
//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);


//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     setCurrentPage(1); // Reset to first page when limit changes
//   };

//   const formatISODate = (date: Date): string => {
//     // Ensure date is treated as Date object (it comes from API mock as Date)
//     return date instanceof Date && !isNaN(date.getTime())
//       ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
//       : 'N/A';
//   };

//   // Helper function to render table content
//   const renderUserTable = () => {
//     if (loading) {
//       return <div className="p-4 text-center text-blue-500">Loading users...</div>;
//     }
//     if (error) {
//       return <div className="p-4 text-center text-red-500">{error}</div>;
//     }
//     if (users.length === 0) {
//       return <div className="p-4 text-center text-gray-500">No users found matching the criteria.</div>;
//     }

//     return (
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests Completed</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {users.map((user) => (
//             <tr key={user.id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'counselor' ? 'bg-indigo-100 text-indigo-800' : user.role === 'professional' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
//                   {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                   {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.testsCompleted}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatISODate(user.lastActive)}</td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <button className="text-blue-600 hover:text-blue-900 mr-3" title="Edit User">
//                   <Edit className="h-4 w-4 inline mr-1" /> Edit
//                 </button>
//                 <button className="text-red-600 hover:text-red-900" title="Delete User">
//                   <Trash2 className="h-4 w-4 inline mr-1" /> Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (


//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

//       {/* --- Filter and Search Bar --- */}
//       <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white shadow rounded-lg items-center">
//         <div className="relative flex-grow max-w-sm">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="p-2 pl-10 border border-gray-300 rounded-lg w-full"
//           />
//         </div>

//         <select
//           value={roleFilter}
//           onChange={(e) => handleRoleFilterChange(e.target.value)}
//           className="p-2 border border-gray-300 rounded-lg"
//         >
//           <option value="all">All Roles</option>
//           {availableRoles.filter(role => role !== 'all').map(role => (
//             <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
//           ))}
//         </select>

//         <button
//           className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-150 ml-auto flex items-center"
//         // Add onClick={handleOpenAddUserModal}
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           Add New User
//         </button>
//       </div>

//       <hr className="my-6" />

//       {/* --- User Table --- */}
//       <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
//         {renderUserTable()}
//       </div>

//       {/* --- Pagination Component --- */}
//       {!loading && totalPages > 1 && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//           limit={limit}
//           onLimitChange={handleLimitChange}
//         />
//       )}
//     </div>
//   );
// };
import React, { useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types/auth";
import { usersApi } from "../services/student-apis";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react";

// --- Reusable Pagination Component ---
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const limits = [5, 10, 25, 50];

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-600">Users per page:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-300 rounded p-1 text-sm"
        >
          {limits.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
// --- End Pagination Component ---

export const Manage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Filtering/Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Available roles
  const availableRoles: (UserRole | "all")[] = [
    "all",
    "student",
    "professional",
    "counselor",
    "admin",
  ];

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleRoleFilterChange = (newFilter: string) => {
    setRoleFilter(newFilter);
    setCurrentPage(1);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getUsers({
        page: currentPage,
        limit,
        search: debouncedSearchTerm,
        filter: roleFilter !== "all" ? roleFilter : undefined,
      });

      setUsers(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch user data. Please try again.");
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, debouncedSearchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const formatISODate = (date: Date): string => {
    return date instanceof Date && !isNaN(date.getTime())
      ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "N/A";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* --- Search & Filter --- */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {availableRoles
                  .filter((role) => role !== "all")
                  .map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* --- User Table --- */}
          {loading ? (
            <div className="p-4 text-center text-blue-500">
              Loading users...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users found matching the criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tests Completed</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${user.role === "admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "counselor"
                              ? "bg-indigo-100 text-indigo-800"
                              : user.role === "professional"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{user.testsCompleted}</TableCell>
                    <TableCell>{formatISODate(user.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" title="Edit User">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete User">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* --- Pagination --- */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
