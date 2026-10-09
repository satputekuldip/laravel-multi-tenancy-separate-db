import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Languages', href: '/admin/languages' },
    { title: 'Create', href: '#' },
];

export default function LanguagesCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Language" />
            <div className="mx-auto flex h-full w-1/2 min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create Language</h1>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-6">
                    <Form
                        method="post"
                        action="/admin/languages"
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                name="code"
                                required
                                placeholder="e.g. en"
                                className="mt-1 max-w-xs"
                            />
                        </div>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="e.g. English"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="native_name">Native name</Label>
                            <Input
                                id="native_name"
                                name="native_name"
                                required
                                placeholder="e.g. English"
                                className="mt-1"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_default"
                                name="is_default"
                                value="1"
                            />
                            <Label htmlFor="is_default">Default language</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                name="is_active"
                                value="1"
                                defaultChecked
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <div>
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                min={0}
                                defaultValue={0}
                                className="mt-1 max-w-xs"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">Create</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/languages">Cancel</Link>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
