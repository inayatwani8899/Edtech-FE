import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Message = { text: string; type: "success" | "error" | "info" } | null;

const defaultFormData = {
    title: "",
    description: "",
    timeDuration: 0,
    // price: 0,
    // totalQuestionsPerPage: 5,
    isPublished: false,
};

export const ConfigurableTestForm: React.FC<{ testId?: string }> = ({ testId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [message, setMessage] = useState<Message>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualTestId = testId || paramId;

    const {
        createConfigurableTest,
        fetchTestById,
        updateTest,
        currentTest,
        loading,
        clearCurrentTest,
    } = useTestStore();

    //Load test when editing
    useEffect(() => {
        if (actualTestId) {
            fetchTestById(actualTestId);
            setIsEditMode(true);
        } else {
            clearCurrentTest();
            setIsEditMode(false);
            setFormData(defaultFormData);
        }
    }, [actualTestId]);

    // When store updates currentTest, sync to local form
    useEffect(() => {
        if (currentTest && isEditMode) {
            setFormData({
                title: currentTest.title,
                description: currentTest.description,
                timeDuration: currentTest.timeDuration,
                // price: currentTest.price,
                // totalQuestionsPerPage: currentTest.totalQuestionsPerPage,
                isPublished: currentTest.isPublished,
            });
        }
    }, [currentTest]);

    const showMessage = (text: string, type: "success" | "error" | "info") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const value =
            target.type === "checkbox"
                ? target.checked
                : target.type === "number"
                    ? parseFloat(target.value)
                    : target.value;

        setFormData((prev) => ({ ...prev, [target.name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            showMessage("Title and Description are required.", "error");
            return;
        }

        if (formData.timeDuration <= 0) {
            showMessage("Duration must be greater than 0.", "error");
            return;
        }

        try {
            if (isEditMode && actualTestId) {
                await updateTest(actualTestId, formData);
                // showMessage(`Test "${formData.title}" updated successfully!`, "success");
            } else {
                await createConfigurableTest(formData);
                // showMessage(`Test "${formData.title}" created successfully!`, "success");
            }

            setTimeout(() => navigate("/manage/tests"), 1000);
        } catch (err) {
            showMessage(
                `Failed to ${isEditMode ? "update" : "create"} test. Please try again.`,
                "error"
            );
        }
    };

    const messageClasses =
        message?.type === "success"
            ? "bg-green-100 text-green-800 border-green-400"
            : message?.type === "error"
                ? "bg-red-100 text-red-800 border-red-400"
                : "bg-blue-100 text-blue-800 border-blue-400";

    return (
        <div className="bg-white  rounded-xl p-3 sm:p-8 max-w-4xl mx-auto my-4 border border-gray-100">
            <h2 className="text-2xl font-semibold leading-none tracking-tight mb-3">
                {isEditMode ? "Edit Test" : "Create New Test"}
            </h2>

            {message && (
                <div
                    className={`p-3 mb-4 text-center border-l-4 rounded font-medium transition duration-300 ${messageClasses}`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-gray-700">Title</label>
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter test title"
                        />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Time Duration (mins)</label>
                        <Input
                            type="number"
                            name="timeDuration"
                            value={formData.timeDuration}
                            onChange={handleChange}
                            min={1}
                        />
                    </div>

                </div>
                <div className="grid grid-cols-2 gap-4">

                    {/* <div>
                        <label className="font-semibold text-gray-700">Price</label>
                        <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min={0}
                        />
                    </div> */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* <div>
                        <label className="font-semibold text-gray-700">Questions per page</label>
                        <Input
                            type="number"
                            name="totalQuestionsPerPage"
                            value={formData.totalQuestionsPerPage}
                            onChange={handleChange}
                            min={1}
                        />
                    </div> */}
                    <div>
                        <label className="font-semibold text-gray-700">Description</label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter test description"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label className="text-gray-700 font-medium">Published</label>
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => navigate("/manage/tests")}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : isEditMode ? "Update Test" : "Create Test"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
