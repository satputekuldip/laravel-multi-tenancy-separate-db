<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcommerceDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('ecommerce.dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_ecommerce_dashboard(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->get(route('ecommerce.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('ecommerce/dashboard')
            ->has('stats')
            ->has('revenueChart')
            ->has('recentOrders')
            ->has('topProducts')
        );
    }
}
