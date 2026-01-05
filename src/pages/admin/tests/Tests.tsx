import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from '@/components/ui/pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Filter, Edit, Trash2, FileText, BarChart3, Copy, Loader2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTestStore } from '@/store/testStore';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeOff } from 'lucide-react';
const getStatusBadge = (status: string) => {
    switch (status) {
        case "active":
            return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
        case "draft":
            return <Badge variant="outline" className="text-gray-600 border-gray-400">Draft</Badge>;
        case "archived":
            return <Badge variant="destructive">Archived</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Aptitude', label: 'Aptitude' },
    { value: 'Personality', label: 'Personality' },
    { value: 'Professional', label: 'Professional' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
];

export const ManageTests: React.FC = () => {
    const navigate = useNavigate();

    // Directly use the store
    const {
        tests,
        loading,
        error,
        filters,
        currentPage,
        totalPages,
        limit,
        totalCount,
        setPage,
        setLimit,
        fetchTests,
        setFilters,
        deleteTest,
        duplicateTest,
        publishTest,
        unpublishTest,
        clearError,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
    } = useTestStore();

    const [searchInput, setSearchInput] = useState(filters.search);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters({ search: searchInput });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput, filters.search, setFilters]);

    // Fetch tests on mount
    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    const handlePageChange = (page: number) => {
        setFilters({ page });
    };

    const handleLimitChange = (limit: number) => {
        setFilters({ limit, page: 1 }); // Reset to page 1 when limit changes
    };

    const handleStatusFilter = (status: string) => {
        setFilters({ status });
    };

    const handleCategoryFilter = (category: string) => {
        setFilters({ category });
    };

    const handleDuplicate = async (testId: string) => {
        if (window.confirm('Are you sure you want to duplicate this test?')) {
            try {
                await duplicateTest(testId);
            } catch (error) {
                // Error handled by store
            }
        }
    };

    // const handleDelete = async (testId: string) => {
    //     if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
    //         try {
    //             await deleteTest();
    //         } catch (error) {
    //             // Error handled by store
    //         }
    //     }
    // };

    // const handlePublish = async (testId: string) => {
    //     try {
    //         await publishTest(testId);
    //     } catch (error) {
    //         // Error handled by store
    //     }
    // };
    const handlePublish = async (testId: string, newState: boolean) => {
        try {
            await publishTest(testId, newState);
        } catch (err) {
            console.error('Failed to toggle publish state:', err);
        }
    };

    const handleUnpublish = async (testId: string) => {
        try {
            await unpublishTest(testId);
        } catch (error) {
            // Error handled by store
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Test Management</CardTitle>
                        {/* <CardDescription>
                            Manage your tests, view analytics, and track completions
                        </CardDescription> */}
                    </div>
                    <Button onClick={() => navigate('/create-test')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Test
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {/* Error Alert */}
                {/* {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error}
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={clearError}
                            >
                                Dismiss
                            </Button>
                        </AlertDescription>
                    </Alert>
                )} */}

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tests by title..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={filters.status} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.category} onValueChange={handleCategoryFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categoryOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                        <span className="text-lg">Loading tests...</span>
                    </div>
                )}

                {/* Test Table */}
                {!loading && tests.length != 0 && (
                    <div className="space-y-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold">Test Name</TableHead>
                                        <TableHead className="font-semibold">Category</TableHead>
                                        {/* <TableHead className="font-semibold">Questions</TableHead> */}
                                        <TableHead className="font-semibold">Duration</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Completions</TableHead>
                                        <TableHead className="text-right font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests?.map((test) => (
                                        <TableRow key={test?.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">{test?.title}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize">
                                                    {test?.category}
                                                </Badge>
                                            </TableCell>
                                            {/* <TableCell>{test?.questions?.length}</TableCell> */}
                                            <TableCell>{test?.timeDuration} min</TableCell>
                                            <TableCell>{getStatusBadge(test.status)}</TableCell>
                                            <TableCell>
                                                <span className="font-medium">{test?.completions}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View Results"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <BarChart3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit Test"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => navigate(`/edit-test/${test.id}`)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {/* {test?.isPublished === true ? (
                                                        <Toggle
                                                            pressed={true}
                                                            onPressedChange={() => handleUnpublish(test.id)}
                                                            size="sm"
                                                            title="Unpublish Test"
                                                            className="h-8 w-8 p-0 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                                                        >
                                                            <ToggleRight className="h-4 w-4" />
                                                        </Toggle>
                                                    ) : (
                                                        <Toggle
                                                            pressed={false}
                                                            onPressedChange={() => handlePublish(test.id)}
                                                            size="sm"
                                                            title="Publish Test"
                                                            className="h-8 w-8 p-0 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                                                        >
                                                            <ToggleLeft className="h-4 w-4" />
                                                        </Toggle>
                                                    )} */}
                                                    <Toggle
                                                        pressed={test?.isPublished}
                                                        onPressedChange={(state) => handlePublish(test.id, state)}
                                                        size="sm"
                                                        title={test?.isPublished ? "Unpublish Test" : "Publish Test"}
                                                        className="h-8 w-8 p-0 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                                                    >
                                                        {test?.isPublished ? (
                                                            <ToggleRight className="h-4 w-4" />
                                                        ) : (
                                                            <ToggleLeft className="h-4 w-4" />
                                                        )}
                                                    </Toggle>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete User"
                                                        onClick={() => openDeleteDialog(test.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Empty State */}


                        {/* Pagination */}
                        {/* {tests?.length > 0 && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                                limit={pagination.limit}
                                onLimitChange={handleLimitChange}
                                className="mt-6"
                            />
                        )} */}
                        {!loading && tests?.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                limit={limit}
                                onLimitChange={setLimit}
                            />
                        )}
                        {/* Results Count */}
                        {tests?.length > 0 && (
                            // <div className="text-sm text-muted-foreground text-center">
                            //     Showing {((currentPage - 1) * limit) + 1} to{' '}
                            //     {Math.min(limit)} of{' '}
                            //     {totalCount} tests
                            // </div>
                            <div className="text-sm text-muted-foreground text-center mt-4">
                                Showing {((currentPage - 1) * limit) + 1} to{' '}
                                {Math.min(currentPage * limit, totalCount)} of{' '}
                                {totalCount} tests
                            </div>
                        )}
                    </div>
                )}
                {tests?.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">No tests found</h3>
                        {/* <p className="mb-4">No tests match your current search criteria.</p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchInput('');
                                setFilters({ search: '', status: 'all', category: 'all' });
                            }}
                        >
                            Clear Filters
                        </Button> */}
                    </div>
                )}
                <DeleteDialog
                    open={deleteOpen}
                    onOpenChange={closeDeleteDialog}
                    onConfirm={deleteTest}
                    title="Delete User"
                    description="Are you sure you want to delete this test? This cannot be undone."
                />
            </CardContent>
        </Card>
    );
};