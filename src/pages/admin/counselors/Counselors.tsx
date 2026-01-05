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
import { Pagination } from "../../../components/ui/pagination";
import { Plus, Search, Edit, Trash2, Loader2, Eye, Users2, AlertCircle } from 'lucide-react';
import { useCounselorStore } from "@/store/counsellorStore";

const Counselors: React.FC = () => {
    const navigate = useNavigate();
    const {
        counselors,
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
        fetchCounselors,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteCounselor,
    } = useCounselorStore();

    useEffect(() => {
        fetchCounselors();
    }, [currentPage, limit, searchTerm, fetchCounselors]);
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Counselor Management</CardTitle>
                        <Button onClick={() => navigate("/counselors/add")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Counselor
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
                            <span className="text-lg">Loading Counselors...</span>
                        </div>
                    ) : counselors?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold mb-2">No Counselors found</h3>
                            {searchTerm && (
                                <p className="mb-4">No counselors match your search criteria.</p>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {counselors?.map((User) => (
                                        <TableRow key={User?.id}>
                                            <TableCell className="font-medium">
                                                {`${User?.firstName} ${User?.lastName}`}
                                            </TableCell>
                                            <TableCell>{User?.email}</TableCell>
                                            <TableCell>{User?.phoneNumber}</TableCell>
                                            {/* <TableCell>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                                        User?.role === "Admin"
                                                            ? "bg-red-100 text-red-800"
                                                            : User?.role === "Counselor"
                                                            ? "bg-indigo-100 text-indigo-800"
                                                            : User?.role === "Professional"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {User?.role?.charAt(0)?.toUpperCase() +
                                                        User?.role?.slice(1)}
                                                </span>
                                            </TableCell> */}
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View Counselor"
                                                        onClick={() => navigate(`/counselors/view/${User.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit Counselor"
                                                        onClick={() => navigate(`/counselors/edit/${User.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete Counselor"
                                                        onClick={() => openDeleteDialog(User.id)}
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
                                    {totalCount} Users
                                </div>
                            </div>
                        </>
                    )}

                    {/* Delete Dialog */}
                    <DeleteDialog
                        open={deleteOpen}
                        onOpenChange={closeDeleteDialog}
                        onConfirm={deleteCounselor}
                        title="Delete Counselor"
                        description="Are you sure you want to delete this counselor? This cannot be undone."
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Counselors;