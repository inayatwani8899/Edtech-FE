// ============================================================
// ConfirmDialog — Reusable confirmation modal
// ============================================================
import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmText = 'Confirm',
    variant = 'danger',
}) => {
    const colors = {
        danger: { bg: 'bg-rose-500/10', icon: 'text-rose-500', btn: 'bg-rose-600 hover:bg-rose-700 text-white' },
        warning: { bg: 'bg-amber-500/10', icon: 'text-amber-500', btn: 'bg-amber-600 hover:bg-amber-700 text-white' },
        info: { bg: 'bg-blue-500/10', icon: 'text-blue-500', btn: 'bg-blue-600 hover:bg-blue-700 text-white' },
    }[variant];

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-2xl border-slate-200 shadow-2xl max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                            <AlertTriangle className={`h-5 w-5 ${colors.icon}`} />
                        </div>
                        <AlertDialogTitle className="text-lg font-black text-slate-900">{title}</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-slate-500 leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 mt-2">
                    <AlertDialogCancel className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={`rounded-xl font-bold text-xs uppercase tracking-wider ${colors.btn}`}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
