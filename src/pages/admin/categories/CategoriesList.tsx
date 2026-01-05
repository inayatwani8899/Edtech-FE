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
import { Pagination } from "@/components/ui/pagination";
import { Plus, Search, Edit, Trash2, Loader2, Eye, FolderOpen, AlertCircle } from 'lucide-react';
import { useCategoryStore } from "@/store/categoryStore";

export const CategoriesList: React.FC = () => {
    const navigate = useNavigate();
    const {
        categories,
        loading,
        error,
        currentPage,
        totalPages,
        limit,
        totalCategoriesCount,
        totalCategoryPages,
        searchTerm,
        setPage,
        setLimit,
        setSearchTerm,
        fetchCategories,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteCategory,
    } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [currentPage, limit, searchTerm, fetchCategories]);

    // if (error) {
    //     return (
    //         <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
    //             <Card className="max-w-md w-full">
    //                 <CardContent className="pt-6">
    //                     <div className="text-center text-red-500">
    //                         <AlertCircle className="h-12 w-12 mx-auto mb-4" />
    //                         <h3 className="text-lg font-semibold mb-2">Error Loading Categories</h3>
    //                         <p className="mb-4">{error}</p>
    //                         <Button onClick={fetchCategories}>Try Again</Button>
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
                        <CardTitle className="flex items-center gap-2">
                            Categories
                        </CardTitle>
                        <Button onClick={() => navigate("/manage/categories/add")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by category name or description..."
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
                            <span className="text-lg">Loading Categories...</span>
                        </div>
                    ) : categories?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold mb-2">No categories found</h3>

                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories?.map((category) => (
                                        <TableRow key={category?.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    {category?.categoryName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs truncate" title={category?.description}>
                                                    {category?.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${category?.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {category?.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View Category"
                                                        onClick={() => navigate(`/manage/categories/view/${category.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit Category"
                                                        onClick={() => navigate(`/manage/categories/edit/${category.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete Category"
                                                        onClick={() => openDeleteDialog(category.id)}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
                                    totalPages={totalCategoryPages || totalPages}
                                    onPageChange={setPage}
                                    limit={limit}
                                    onLimitChange={setLimit}
                                />

                                {/* Results count */}
                                <div className="text-sm text-muted-foreground text-center mt-4">
                                    Showing {((currentPage - 1) * limit) + 1} to{' '}
                                    {Math.min(currentPage * limit, totalCategoriesCount || 0)} of{' '}
                                    {totalCategoriesCount || 0} categories
                                </div>
                            </div>
                        </>
                    )}

                    {/* Delete Dialog */}
                    <DeleteDialog
                        open={deleteOpen}
                        onOpenChange={closeDeleteDialog}
                        onConfirm={deleteCategory}
                        title="Delete Category"
                        description="Are you sure you want to delete this category? This action cannot be undone and may affect associated content."
                    />
                </CardContent>
            </Card>
        </div>
    );
};