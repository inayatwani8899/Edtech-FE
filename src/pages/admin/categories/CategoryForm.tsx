// // // components/CategoryForm.tsx
// // import React, { useState, useEffect } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { useCategoryStore } from "@/store/categoryStore";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Save, X, FolderOpen } from "lucide-react";

// // type Message = { text: string; type: "success" | "error" | "info" } | null;

// // const defaultFormData = {
// //     categoryName: "",
// //     description: "",
// //     isActive: true,
// // };

// // export const CategoryForm: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
// //     const [formData, setFormData] = useState(defaultFormData);
// //     const [message, setMessage] = useState<Message>(null);
// //     const [isEditMode, setIsEditMode] = useState(false);

// //     const navigate = useNavigate();
// //     const { id: paramId } = useParams();
// //     const actualCategoryId = categoryId || paramId;

// //     const {
// //         loading,
// //         currentCategory,
// //         fetchCategoryById,
// //         createCategory,
// //         updateCategory,
// //         clearCurrentCategory,
// //     } = useCategoryStore();

// //     // Load category when editing
// //     useEffect(() => {
// //         if (actualCategoryId) {
// //             fetchCategoryById(actualCategoryId);
// //             setIsEditMode(true);
// //         } else {
// //             clearCurrentCategory();
// //             setIsEditMode(false);
// //             setFormData(defaultFormData);
// //         }
// //     }, [actualCategoryId]);

// //     // When store updates currentCategory, sync to local form
// //     useEffect(() => {
// //         if (currentCategory && isEditMode) {
// //             setFormData({
// //                 categoryName: currentCategory.categoryName,
// //                 description: currentCategory.description,
// //                 isActive: currentCategory.isActive,
// //             });
// //         }
// //     }, [currentCategory, isEditMode]);

// //     const showMessage = (text: string, type: "success" | "error" | "info") => {
// //         setMessage({ text, type });
// //         setTimeout(() => setMessage(null), 3000);
// //     };

// //     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //         const target = e.target as HTMLInputElement;
// //         const value =
// //             target.type === "checkbox"
// //                 ? target.checked
// //                 : target.value;

// //         setFormData((prev) => ({ ...prev, [target.name]: value }));
// //     };

// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault();

// //         // Validation
// //         if (!formData.categoryName.trim()) {
// //             showMessage("Category name is required.", "error");
// //             return;
// //         }

// //         if (!formData.description.trim()) {
// //             showMessage("Description is required.", "error");
// //             return;
// //         }

// //         if (formData.categoryName.trim().length < 2) {
// //             showMessage("Category name must be at least 2 characters long.", "error");
// //             return;
// //         }

// //         if (formData.description.trim().length < 10) {
// //             showMessage("Description must be at least 10 characters long.", "error");
// //             return;
// //         }

// //         try {
// //             if (isEditMode && actualCategoryId) {
// //                 await updateCategory(actualCategoryId, formData);
// //                 showMessage(`Category updated successfully!`, "success");
// //             } else {
// //                 await createCategory(formData);
// //                 showMessage(`Category created successfully!`, "success");
// //             }

// //             setTimeout(() => navigate("/manage/categories"), 1000);
// //         } catch (err: any) {
// //             showMessage(
// //                 err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} category. Please try again.`,
// //                 "error"
// //             );
// //         }
// //     };

// //     const messageClasses =
// //         message?.type === "success"
// //             ? "bg-green-50 text-green-800 border border-green-200 rounded-lg p-4"
// //             : message?.type === "error"
// //                 ? "bg-red-50 text-red-800 border border-red-200 rounded-lg p-4"
// //                 : "bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4";

// //     return (
// //         <div className="min-h-screen bg-gray-50 py-8">
// //             <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
// //                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
// //                     {/* Header */}
// //                     <div className="mb-8">
// //                         <div className="flex items-center gap-3 mb-2">
// //                             <h3 className="text-2xl font-semibold text-gray-900">
// //                                 {isEditMode ? "Edit Category" : "Create New Category"}
// //                             </h3>
// //                         </div>
// //                     </div>

// //                     {message && (
// //                         <div className={`mb-6 ${messageClasses}`}>
// //                             <div className="flex items-center">
// //                                 <div className="flex-shrink-0">
// //                                     {message.type === "success" && (
// //                                         <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
// //                                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //                                         </svg>
// //                                     )}
// //                                     {message.type === "error" && (
// //                                         <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
// //                                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                                         </svg>
// //                                     )}
// //                                 </div>
// //                                 <div className="ml-3">
// //                                     <p className="text-sm font-medium">{message.text}</p>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     )}

// //                     <form onSubmit={handleSubmit} className="space-y-6">
// //                         {/* Category Name */}
// //                         <div>
// //                             <label className="block text-sm font-semibold text-gray-900 mb-2">
// //                                 Category Name *
// //                             </label>
// //                             <Input
// //                                 type="text"
// //                                 name="categoryName"
// //                                 value={formData.categoryName}
// //                                 onChange={handleChange}
// //                                 placeholder="Enter category name"
// //                                 className="w-full"
// //                                 disabled={loading}
// //                             />
// //                         </div>

// //                         {/* Description */}
// //                         <div>
// //                             <label className="block text-sm font-semibold text-gray-900 mb-2">
// //                                 Description *
// //                             </label>
// //                             <Textarea
// //                                 name="description"
// //                                 value={formData.description}
// //                                 onChange={handleChange}
// //                                 rows={4}
// //                                 placeholder="Enter detailed description for this category..."
// //                                 className="w-full"
// //                                 disabled={loading}
// //                             />
// //                         </div>

// //                         {/* Active Status */}
// //                         <div className="flex items-center space-x-3 p-4">
// //                             <input
// //                                 type="checkbox"
// //                                 name="isActive"
// //                                 checked={formData.isActive}
// //                                 onChange={handleChange}
// //                                 className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
// //                                 disabled={loading}
// //                             />
// //                             <div>
// //                                 <span className="text-gray-900 font-medium">Active Category</span>
// //                             </div>
// //                         </div>

// //                         {/* Submit Buttons */}
// //                         <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
// //                             <Button
// //                                 type="button"
// //                                 variant="outline"
// //                                 onClick={() => navigate("/manage/categories")}
// //                                 className="w-full sm:w-auto flex items-center gap-2"
// //                                 disabled={loading}
// //                             >
// //                                 {/* <X className="w-4 h-4" /> */}
// //                                 Cancel
// //                             </Button>
// //                             <Button
// //                                 type="submit"
// //                                 disabled={loading}
// //                                 className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
// //                             >
// //                                 {loading ? (
// //                                     <div className="flex items-center gap-2">
// //                                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                                         Saving...
// //                                     </div>
// //                                 ) : (
// //                                     <>
// //                                         {/* <Save className="w-4 h-4" /> */}
// //                                         {isEditMode ? "Update Category" : "Create Category"}
// //                                     </>
// //                                 )}
// //                             </Button>
// //                         </div>
// //                     </form>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// // components/CategoryForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoryStore } from "@/store/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, FolderOpen, AlertCircle } from "lucide-react";

type Message = { text: string; type: "success" | "error" | "info" } | null;

const defaultFormData = {
    categoryName: "",
    description: "",
    isActive: false,
};

export const CategoryForm: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState<{ categoryName?: string; description?: string }>({});
    const [message, setMessage] = useState<Message>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [touched, setTouched] = useState<{ categoryName?: boolean; description?: boolean }>({});

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualCategoryId = categoryId || paramId;

    const {
        loading,
        currentCategory,
        fetchCategoryById,
        createCategory,
        updateCategory,
        clearCurrentCategory,
    } = useCategoryStore();

    // Validation function
    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'categoryName':
                if (!value.trim()) {
                    newErrors.categoryName = "Category name is required.";
                } else if (value.trim().length < 2) {
                    newErrors.categoryName = "Category name must be at least 2 characters long.";
                } else {
                    delete newErrors.categoryName;
                }
                break;

            case 'description':
                if (!value.trim()) {
                    newErrors.description = "Description is required.";
                } else if (value.trim().length < 10) {
                    newErrors.description = "Description must be at least 10 characters long.";
                } else {
                    delete newErrors.description;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate form
    const validateForm = () => {
        const newErrors: { categoryName?: string; description?: string } = {};

        if (!formData.categoryName.trim()) {
            newErrors.categoryName = "Category name is required.";
        } else if (formData.categoryName.trim().length < 2) {
            newErrors.categoryName = "Category name must be at least 2 characters long.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters long.";
        }

        setErrors(newErrors);
        setTouched({ categoryName: true, description: true });
        return Object.keys(newErrors).length === 0;
    };

    // Load category when editing
    useEffect(() => {
        if (actualCategoryId) {
            fetchCategoryById(actualCategoryId);
            setIsEditMode(true);
        } else {
            clearCurrentCategory();
            setIsEditMode(false);
            setFormData(defaultFormData);
            setErrors({});
            setTouched({});
        }
    }, [actualCategoryId]);

    // When store updates currentCategory, sync to local form
    useEffect(() => {
        if (currentCategory && isEditMode) {
            setFormData({
                categoryName: currentCategory.categoryName,
                description: currentCategory.description,
                isActive: currentCategory.isActive,
            });
        }
    }, [currentCategory, isEditMode]);

    const showMessage = (text: string, type: "success" | "error" | "info") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === "checkbox" ? target.checked : target.value;

        setFormData((prev) => ({ ...prev, [target.name]: value }));

        // Validate field on change if it's been touched
        if (touched[target.name as keyof typeof touched]) {
            validateField(target.name, value.toString());
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (isEditMode && actualCategoryId) {
                await updateCategory(actualCategoryId, formData);
                showMessage(`Category updated successfully!`, "success");
            } else {
                await createCategory(formData);
                showMessage(`Category created successfully!`, "success");
            }

            setTimeout(() => navigate("/manage/categories"), 1000);
        } catch (err: any) {
            showMessage(
                err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} category. Please try again.`,
                "error"
            );
        }
    };

    const messageClasses =
        message?.type === "success"
            ? "bg-green-50 text-green-800 border border-green-200 rounded-lg p-4"
            : message?.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200 rounded-lg p-4"
                : "bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4";

    const inputClasses = (hasError: boolean) => 
        `w-full transition-colors duration-200 ${
            hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
        } focus:ring-2 focus:ring-opacity-50`;

    return (
        <div className="min-h-screen bg-gray-50 py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-semibold text-gray-900">
                                {isEditMode ? "Edit Category" : "Create New Category"}
                            </h3>
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 ${messageClasses}`}>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    {message.type === "success" && (
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {message.type === "error" && (
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Category Name *
                            </label>
                            <Input
                                type="text"
                                name="categoryName"
                                value={formData.categoryName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Enter category name"
                                className={inputClasses(!!errors.categoryName)}
                                disabled={loading}
                            />
                            {errors.categoryName && (
                                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.categoryName}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Description *
                            </label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                                placeholder="Enter detailed description for this category..."
                                className={inputClasses(!!errors.description)}
                                disabled={loading}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.description}</span>
                                </div>
                            )}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center space-x-3 p-4">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                disabled={loading}
                            />
                            <div>
                                <span className="text-gray-900 font-medium">Active Category</span>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/manage/categories")}
                                className="w-full sm:w-auto flex items-center gap-2"
                                disabled={loading}
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || Object.keys(errors).length > 0}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {isEditMode ? "Update Category" : "Create Category"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
