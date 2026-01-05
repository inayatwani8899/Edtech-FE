import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useUserStore } from "../../../store/userStore";
import { Pagination } from "../../../components/ui/pagination";
import { Plus, Search, Edit, Trash2, Loader2, Eye, Users2, AlertCircle } from 'lucide-react';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const {
        users,
        loading,
        error, // You have error in destructuring but not using it
        currentPage,
        totalPages,
        limit,
        totalCount,
        searchTerm,
        setPage,
        setLimit,
        setSearchTerm,
        fetchUsers,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteUser,
    } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [currentPage, limit, searchTerm, fetchUsers]);

    // Add error display
    // if (error) {
    //     return (
    //         <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
    //             <Card className="max-w-md w-full">
    //                 <CardContent className="pt-6">
    //                     <div className="text-center text-red-500">
    //                         <AlertCircle className="h-12 w-12 mx-auto mb-4" />
    //                         <h3 className="text-lg font-semibold mb-2">Error Loading Users</h3>
    //                         <p className="mb-4">{error}</p>
    //                         <Button onClick={fetchUsers}>Try Again</Button>
    //                     </div>
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     );
    // }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>User Management</CardTitle>
                        <Button onClick={() => navigate("/users/add")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
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
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                            <span className="text-lg">Loading Users...</span>
                        </div>
                    ) : users?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold mb-2">No users found</h3>
                            {searchTerm && (
                                <p className="mb-4">No users match your search criteria.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users?.map((user) => (
                                        <TableRow key={user?.id}>
                                            <TableCell className="font-medium">
                                                {`${user?.firstName} ${user?.lastName}`}
                                            </TableCell>
                                            <TableCell>{user?.email}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                                        user?.role === "Admin"
                                                            ? "bg-red-100 text-red-800"
                                                            : user?.role === "Counselor"
                                                            ? "bg-indigo-100 text-indigo-800"
                                                            : user?.role === "Professional"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {user?.role?.charAt(0)?.toUpperCase() +
                                                        user?.role?.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View User"
                                                        onClick={() => navigate(`/users/view/${user.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit User"
                                                        onClick={() => navigate(`/users/edit/${user.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete User"
                                                        onClick={() => openDeleteDialog(user.id)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    limit={limit}
                                    onLimitChange={setLimit}
                                />

                                {/* Results count */}
                                <div className="text-sm text-muted-foreground text-center mt-4">
                                    Showing {((currentPage - 1) * limit) + 1} to{' '}
                                    {Math.min(currentPage * limit, totalCount)} of{' '}
                                    {totalCount} users
                                </div>
                            </div>
                        </>
                    )}

                    {/* Delete Dialog */}
                    <DeleteDialog
                        open={deleteOpen}
                        onOpenChange={closeDeleteDialog}
                        onConfirm={deleteUser}
                        title="Delete User"
                        description="Are you sure you want to delete this user? This cannot be undone."
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Users;