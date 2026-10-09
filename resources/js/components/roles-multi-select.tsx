import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface RolesMultiSelectProps {
    roles: Role[];
    defaultValue?: string[];
    label?: string;
    id?: string;
}

export function RolesMultiSelect({
    roles,
    defaultValue = [],
    label = 'Roles',
    id = 'roles-multi-select',
}: RolesMultiSelectProps) {
    const [selected, setSelected] = useState<string[]>(defaultValue);

    function toggle(name: string) {
        setSelected((prev) =>
            prev.includes(name)
                ? prev.filter((r) => r !== name)
                : [...prev, name],
        );
    }

    const labelText =
        selected.length === 0
            ? 'Select roles...'
            : selected.length === 1
              ? selected[0]
              : `${selected.length} roles selected`;

    return (
        <div className="space-y-2">
            <Label id={id}>{label}</Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between font-normal"
                        aria-haspopup="listbox"
                    >
                        <span className="truncate">{labelText}</span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    align="start"
                >
                    {roles.map((role) => (
                        <DropdownMenuCheckboxItem
                            key={role.id}
                            checked={selected.includes(role.name)}
                            onCheckedChange={() => toggle(role.name)}
                            onSelect={(e) => e.preventDefault()}
                        >
                            {role.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {selected.map((name) => (
                <input
                    key={name}
                    type="hidden"
                    name="roles[]"
                    value={name}
                    readOnly
                />
            ))}
        </div>
    );
}
