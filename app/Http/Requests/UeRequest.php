<?php

namespace App\Http\Requests;

use App\User;
use Dingo\Api\Exception\StoreResourceFailedException;
use Illuminate\Foundation\Http\FormRequest;

class UeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return User::authenticated()->hasRole('teacher');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'code_ue' => [
                'required',
                'regex:/^([1-5](I|i)[0-9]{3})$/'
            ]
        ];
    }
    /**
     * Get the proper failed validation response for the request.
     *
     * @param  array  $errors
     * @return void
     */
    public function response(array $errors){
            throw new StoreResourceFailedException(
                'Could not store the Ue, the given data failed to pass validation.',
                $errors
            );
    }
}
