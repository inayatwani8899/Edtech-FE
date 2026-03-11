// ============================================================
// PageHeader — Consistent page header with breadcrumbs
// ============================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    tag: string;
    title: string;
    highlight?: string;
    subtitle?: string;
    breadcrumbs?: Crumb[];
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    tag,
    title,
    highlight,
    subtitle,
    breadcrumbs = [],
    actions,
}) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 mb-3 text-xs">
                    <button onClick={() => navigate('/rbac')} className="text-slate-400 hover:text-primary transition-colors">
                        <Home className="h-3.5 w-3.5" />
                    </button>
                    {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={i}>
                            <ChevronRight className="h-3 w-3 text-slate-300" />
                            {crumb.href ? (
                                <button onClick={() => navigate(crumb.href!)} className="font-semibold text-slate-400 hover:text-primary transition-colors">
                                    {crumb.label}
                                </button>
                            ) : (
                                <span className="font-semibold text-slate-700">{crumb.label}</span>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="h-px w-6 bg-primary/40" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">{tag}</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                        {title}{' '}
                        {highlight && (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{highlight}</span>
                        )}
                    </h1>
                    {subtitle && (
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">{subtitle}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </div>
    );
};
