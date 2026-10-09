import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Translation {
    id: number;
    language_id: number;
    group: string;
    key: string;
    value: string;
}

interface Language {
    id: number;
    code: string;
    name: string;
}

interface Props {
    language: Language;
    translations: Translation[];
}

const breadcrumbs = (language: Language): BreadcrumbItem[] => [
    { title: 'Admin', href: '#' },
    { title: 'Languages', href: '/admin/languages' },
    { title: `${language.name} – Translations`, href: '#' },
];

export default function LanguagesTranslations({
    language,
    translations,
}: Props) {
    const list =
        translations.length > 0
            ? translations
            : [
                  {
                      id: 0,
                      language_id: language.id,
                      group: '',
                      key: '',
                      value: '',
                  },
              ];

    return (
        <AppLayout breadcrumbs={breadcrumbs(language)}>
            <Head title={`Translations – ${language.name}`} />
            <div className="mx-auto flex h-full w-1/2 min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Translations – {language.name}
                    </h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/languages">Back to Languages</Link>
                    </Button>
                </div>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-6">
                    {translations.length === 0 ? (
                        <p className="mb-4 text-sm text-muted-foreground">
                            No translations yet. Add at least one row below and
                            save.
                        </p>
                    ) : null}
                    <Form
                        method="post"
                        action={`/admin/languages/${language.id}/translations`}
                        className="space-y-4"
                    >
                        <input type="hidden" name="_method" value="PUT" />
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-sidebar-border">
                                        <th className="px-2 py-2 text-left">
                                            Group
                                        </th>
                                        <th className="px-2 py-2 text-left">
                                            Key
                                        </th>
                                        <th className="px-2 py-2 text-left">
                                            Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((t, index) => (
                                        <tr
                                            key={t.id || index}
                                            className="border-b border-sidebar-border"
                                        >
                                            <td className="px-2 py-2">
                                                <Input
                                                    name={`translations[${index}][group]`}
                                                    defaultValue={t.group}
                                                    placeholder="e.g. messages"
                                                    className="min-w-[120px]"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <Input
                                                    name={`translations[${index}][key]`}
                                                    defaultValue={t.key}
                                                    placeholder="e.g. welcome"
                                                    className="min-w-[120px]"
                                                />
                                            </td>
                                            <td className="px-2 py-2">
                                                <Input
                                                    name={`translations[${index}][value]`}
                                                    defaultValue={t.value}
                                                    placeholder="Translation value"
                                                    className="min-w-[200px]"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">Save translations</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
