<?php
/**
 * Created by PhpStorm.
 * User=> Yassine
 * Date=> 04/02/2017
 * Time=> 00=>05
 */

namespace App\Transformers;


use App\User;
use League\Fractal\TransformerAbstract;

class UserTransformer extends TransformerAbstract
{
    public function transform(User $user)
    {
        $role = $user->roles()->first();
        return [
            'id' => $user->id,
            'username' => $user->username,
            'lastName' => $user->lastName,
            'firstName' => $user->firstName,
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
            ]
        ];
    }
}