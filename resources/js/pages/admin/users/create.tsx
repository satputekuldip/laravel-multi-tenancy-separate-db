import { PasswordInput } from '@/components/password-input';
import { RolesMultiSelect } from '@/components/roles-multi-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'Create',
        href: '#',
    },
];

export default function UsersCreate({ roles }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="mx-auto flex h-full w-1/2 min-w-0 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Create User</h1>

                <div className="rounded-lg border border-sidebar-border bg-sidebar p-6">
                    <Form
                        method="post"
                        action="/admin/users"
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                className="mt-1"
                            />
                        </div>

                        <RolesMultiSelect roles={roles} label="Roles" />

                        <div className="flex gap-2">
                            <Button type="submit">Create User</Button>
                            <Button type="button" variant="outline" asChild>
                                <a href="/admin/users">Cancel</a>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
