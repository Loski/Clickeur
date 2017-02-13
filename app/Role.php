<?php

namespace App;


use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole
{
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
