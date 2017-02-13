<?php

namespace App\Http\Requests;

use Config;
use Dingo\Api\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function rules()
    {
        return [
            'username' => 'required',
            'password' => 'required'
        ];
    }

    public function authorize()
    {
        return true;
    }
}
