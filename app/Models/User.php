<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'subscription_ends_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_ends_at' => 'datetime',
        ];
    }


    public function roles()
    {
        return $this->belongsToMany(Roles::class, 'role_user', 'user_id', 'roles_id');
    }
    public function authorizeRoles($roles){
        if (is_array($roles)) {
            return $this->hasAnyRole($roles) || abort(401, 'This action is unauthorized.');
        }
        return $this->hasRole($roles) || abort(401, 'This action is unauthorized.');
    }

    public function authorizeRolesWithId($roles){

        if (is_array($roles)) {
            return $this->hasAnyRoleWithId($roles) || abort(401, 'This action is unauthorized.');
        }
        return $this->hasRoleWithId($roles) || abort(401, 'This action is unauthorized.');
    }

    /*** Check multiple roles* @param array $roles*/
    public function hasAnyRoleWithId($roles){

        return null !== $this->roles()->whereIn('roles.id', $roles)->first();
    }

    /*** Check multiple roles* @param array $roles*/
    public function hasAnyRole($roles){
        return null !== $this->roles()->whereIn('name', $roles)->first();
    }

     /**
     * Interact with the user's subscription end date.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function subscriptionEndsAt(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? Carbon::parse($value) : null,
            set: fn ($value) => $value,
        );
    }

    /**
     * Check if the user's subscription is active.
     *
     * @return bool
     */
    public function isSubscriptionActive()
    {
        return $this->subscription_ends_at && $this->subscription_ends_at->isFuture();
    }
}
