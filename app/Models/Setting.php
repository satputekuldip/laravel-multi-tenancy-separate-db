<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'scope',
        'scope_id',
    ];

    public function scopeSite(Builder $query): Builder
    {
        return $query->where('scope', 'site')->whereNull('scope_id');
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('scope', 'user')->where('scope_id', $userId);
    }

    public function scopeForGroup(Builder $query, int $groupId): Builder
    {
        return $query->where('scope', 'group')->where('scope_id', $groupId);
    }
}
