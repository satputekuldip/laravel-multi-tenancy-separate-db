import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '#' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Create', href: '#' },
];

function groupPermissionsByModule(
    permissions: Permission[],
): Map<string, Permission[]> {
    const map = new Map<string, Permission[]>();
    for (const p of permissions) {
        const module = p.name.includes('.') ? p.name.split('.')[0] : 'other';
        const list = map.get(module) ?? [];
        list.push(p);
        map.set(module, list);
    }
    return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export default function RolesCreate({ permissions }: Props) {
    const groups = groupPermissionsByModule(permissions);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="mx-auto flex h-full w-1/2 min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create Role</h1>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-6">
                    <Form
                        method="post"
                        action="/admin/roles"
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                className="mt-1"
                                placeholder="e.g. editor"
                            />
                        </div>

                        <div>
                            <Label htmlFor="guard_name">Guard (optional)</Label>
                            <Input
                                id="guard_name"
                                name="guard_name"
                                defaultValue="web"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label>Permissions</Label>
                            <div className="mt-2 max-h-96 space-y-4 overflow-y-auto rounded border border-sidebar-border p-3">
                                {Array.from(groups.entries()).map(
                                    ([module, perms]) => (
                                        <div key={module}>
                                            <span className="mb-2 block text-sm font-medium text-muted-foreground capitalize">
                                                {module}
                                            </span>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                {perms.map((perm) => (
                                                    <div
                                                        key={perm.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={`perm-${perm.id}`}
                                                            name="permissions[]"
                                                            value={perm.name}
                                                        />
                                                        <Label
                                                            htmlFor={`perm-${perm.id}`}
                                                            className="font-mono text-sm font-normal"
                                                        >
                                                            {perm.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">Create Role</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/roles">Cancel</Link>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
