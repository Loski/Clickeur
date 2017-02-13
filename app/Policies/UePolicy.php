<?php

namespace App\Policies;

use App\User;
use App\Ue;
use Illuminate\Auth\Access\HandlesAuthorization;

class UePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the ue.
     *
     * @param  \App\User  $user
     * @param  \App\Ue  $ue
     * @return mixed
     */
    public function view(User $user, Ue $ue)
    {
        return true;
    }

    /**
     * Determine whether the user can create ues.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->hasRole('teacher');
    }

    /**
     * Determine whether the user can update the ue.
     *
     * @param  \App\User  $user
     * @param  \App\Ue  $ue
     * @return mixed
     */
    public function update(User $user, Ue $ue)
    {
        return $ue->teachers()->get()->contains($user);
    }

    /**
     * Determine whether the user can delete the ue.
     *
     * @param  \App\User  $user
     * @param  \App\Ue  $ue
     * @return mixed
     */
    public function delete(User $user, Ue $ue)
    {
        return $ue->teachers()->get()->contains($user);
    }
}
