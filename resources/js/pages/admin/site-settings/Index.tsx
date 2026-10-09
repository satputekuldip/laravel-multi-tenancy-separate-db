import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

const DEFAULT_KEYS = ['site_name', 'site_tagline', 'support_email'] as const;

interface Props {
    settings: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Site Settings', href: '#' },
];

export default function SiteSettingsIndex({ settings }: Props) {
    const keys = Array.from(
        new Set([...DEFAULT_KEYS, ...Object.keys(settings)]),
    ).sort();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Site Settings</h1>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-6">
                    <Form
                        method="post"
                        action="/admin/site-settings"
                        className="space-y-4"
                    >
                        <input type="hidden" name="_method" value="PUT" />
                        {keys.map((key) => (
                            <div key={key}>
                                <Label htmlFor={`settings-${key}`}>
                                    {key.replace(/_/g, ' ')}
                                </Label>
                                <Input
                                    id={`settings-${key}`}
                                    name={`settings[${key}]`}
                                    defaultValue={settings[key] ?? ''}
                                    className="mt-1 max-w-md"
                                />
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <Button type="submit">Save settings</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
