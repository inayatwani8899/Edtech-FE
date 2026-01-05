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
import { useTestStore } from "../../../store/testStore";
import { Pagination } from "../../../components/ui/pagination";
import { Plus, Search, Edit, Trash2, Loader2, Eye, Settings, AlertCircle } from 'lucide-react';
import { useUserStore } from "@/store/userStore";
import { useTestConfigurationStore } from "@/store/testConfigurationStore";

export const TestConfigurationsList: React.FC = () => {
    const navigate = useNavigate();
    const {
        tests,
        fetchTests,
    } = useTestStore();
    const {
        configurations,
        loading,
        error,
        currentPage,
        totalPages,
        limit,
        totalConfigurationsCount,
        totalConfigurationPages,
        searchTerm,
        setPage,
        setLimit,
        setSearchTerm,
        fetchConfigurations,
        deleteOpen,
        openDeleteDialog,
        closeDeleteDialog,
        deleteConfiguration,
    } = useTestConfigurationStore();
    const { roles, fetchRoles } = useUserStore();
    useEffect(() => {
        fetchConfigurations();
        if (tests.length === 0) fetchTests();
    }, [currentPage, limit, searchTerm, fetchConfigurations, fetchTests, tests.length]);

    // Helper function to get role name by ID
    const getRoleName = (roleId: string) => {
        const role = roles.find(r => r.id === parseInt(roleId));
        return role?.name || "Unknown Role";
    };

    // Helper function to get test name by ID
    // const getTestName = (testId: string) => {
    //     debugger
    //     const test = tests.find(t => t.id === testId);
    //     return test?.title || "Unknown Test";
    // };
    const getTestName = (testId: string) => {
        const test = tests.find(t => t.id.toString() === testId.toString());
        return test?.title || "Unknown Test";
    };
    // if (error) {
    //     return (
    //         <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
    //             <Card className="max-w-md w-full">
    //                 <CardContent className="pt-6">
    //                     <div className="text-center text-red-500">
    //                         <AlertCircle className="h-12 w-12 mx-auto mb-4" />
    //                         <h3 className="text-lg font-semibold mb-2">Error Loading Configurations</h3>
    //                         <p className="mb-4">{error}</p>
    //                         <Button onClick={fetchConfigurations}>Try Again</Button>
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
                        <CardTitle>Test Configurations</CardTitle>
                        <Button onClick={() => navigate("/manage/configurations/add")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Configuration
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by role or test..."
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
                            <span className="text-lg">Loading Configurations...</span>
                        </div>
                    ) : configurations?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold mb-2">No configurations found</h3>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {/* <TableHead>Role</TableHead> */}
                                        <TableHead>Test</TableHead>
                                        {/* <TableHead>Duration</TableHead> */}
                                        <TableHead>Questions/Page</TableHead>
                                        <TableHead>Submit Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {configurations?.map((config) => (
                                        <TableRow key={config?.id}>
                                            {/* <TableCell className="font-medium">
                                                {getRoleName(config?.rolePrices?.[0]?.roleId)}
                                            </TableCell> */}
                                            <TableCell>{getTestName(config?.testId)}</TableCell>
                                            {/* <TableCell>{config?.durationMinutes} mins</TableCell> */}
                                            <TableCell>{config?.questionsPerPage}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${config?.submitType === "OneGo"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                                    }`}>
                                                    {config?.submitType === "OneGo" ? "One Go" : "PerPage"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {/* <span className={`px-2 py-1 text-xs rounded-full font-semibold ${config?.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {config?.isActive ? "Active" : "Inactive"}
                                                </span> */}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View Configuration"
                                                        onClick={() => navigate(`/manage/configurations/view/${config.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit Configuration"
                                                        onClick={() => navigate(`/manage/configurations/edit/${config.id}`)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete Configuration"
                                                        onClick={() => openDeleteDialog(config.id)}
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
                                    totalPages={totalConfigurationPages}
                                    onPageChange={setPage}
                                    limit={limit}
                                    onLimitChange={setLimit}
                                />

                                {/* Results count */}
                                <div className="text-sm text-muted-foreground text-center mt-4">
                                    Showing {((currentPage - 1) * limit) + 1} to{' '}
                                    {Math.min(currentPage * limit, totalConfigurationsCount)} of{' '}
                                    {totalConfigurationsCount} configurations
                                </div>
                            </div>
                        </>
                    )}

                    {/* Delete Dialog */}
                    <DeleteDialog
                        open={deleteOpen}
                        onOpenChange={closeDeleteDialog}
                        onConfirm={deleteConfiguration}
                        title="Delete Configuration"
                        description="Are you sure you want to delete this configuration? This cannot be undone."
                    />
                </CardContent>
            </Card>
        </div>
    );
};