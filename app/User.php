<?php

namespace App;

use Hash;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Facades\JWTAuth;
use Zizaco\Entrust\Traits\EntrustUserTrait;

class User extends Authenticatable
{
    //use Notifiable;
    use EntrustUserTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['username', 'firstName', 'lastName'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['password'];


    /**
     * Automatically creates hash for the user password.
     *
     * @param  string $value
     * @return void
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    public function ues()
    {
        return $this->belongsToMany(Ue::class);
    }

    public static function createUserFromLDAP(\Adldap\Models\User $ldapUser, array $credentials): User
    {
        $name = explode(' ', $ldapUser->getCommonName());
        $user = new User();
        $user->username = $credentials['username'];
        $user->setPasswordAttribute($credentials['password']);
        $user->lastName = last($name);
        $user->firstName = head($name);
        $user->save();

        if (is_numeric($credentials['username']))
            $user->attachRole(Role::where('name', 'student')->firstOrFail());
        else
            $user->attachRole(Role::where('name', 'teacher')->firstOrFail());

        return $user;
    }

    /**
     * autheticated user
     *
     * @return User
     */
    public static function authenticated(){
        return JWTAuth::parseToken()->authenticate();
    }
}
