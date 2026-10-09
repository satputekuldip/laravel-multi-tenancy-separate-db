import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

interface Language {
    id: number;
    code: string;
    name: string;
    native_name: string;
    is_default: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    languages: Language[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Languages', href: '#' },
];

export default function LanguagesIndex({ languages }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Languages" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Languages</h1>
                    <Button asChild>
                        <Link href="/admin/languages/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Language
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-sidebar-border">
                                    <th className="px-4 py-2 text-left">
                                        Code
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Native
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Default
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Active
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {languages.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No languages yet. Add one to get
                                            started.
                                        </td>
                                    </tr>
                                ) : (
                                    languages.map((lang) => (
                                        <tr
                                            key={lang.id}
                                            className="border-b border-sidebar-border"
                                        >
                                            <td className="px-4 py-2 font-mono">
                                                {lang.code}
                                            </td>
                                            <td className="px-4 py-2">
                                                {lang.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {lang.native_name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {lang.is_default ? 'Yes' : ''}
                                            </td>
                                            <td className="px-4 py-2">
                                                {lang.is_active ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/languages/${lang.id}/translations`}
                                                    >
                                                        Translations
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/languages/${lang.id}/edit`}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
