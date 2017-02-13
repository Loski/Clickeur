<?php

namespace App\Http\Controllers;

use App\Http\Requests\UeRequest;
use App\Ue;
use App\User;
use Dingo\Api\Exception\StoreResourceFailedException;
use Dingo\Api\Http\Response;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;

class UeController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $myUes = User::authenticated()->ues()->get();
        $otherUes = Ue::whereNotIn('id', $myUes)->get();
        return $this->response->array(['my_ues' => $myUes, 'other_ues' => $otherUes]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     * @param UeRequest $request
     * @return Response
     */
    public function store(UeRequest $request)
    {
        $this->authorize('create', Ue::class);
        $params = $request->only(['code_ue', 'name']);
        try {
            $ue = Ue::create($params);
            User::authenticated()->ues()->attach($ue);
            return $this->response->array($ue);
        } catch (QueryException $exception) {
            $code = $params['code_ue'];
            throw new StoreResourceFailedException("$code : This ue already exists");
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        try {
            $ue = Ue::findOrFail($id);
            $ue->students = $ue->students()->select(['lastName', 'firstName'])->get();
            $ue->teachers = $ue->teachers()->select(['lastName', 'firstName'])->get();
            return $ue;
        } catch (ModelNotFoundException $exception) {
            abort(404, "Not found Ue with id $id");
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @param  UeRequest $request
     * @return Response
     */
    public function update($id, UeRequest $request)
    {
        try {
            $ue = Ue::findOrFail($id);
            $this->authorize('update', $ue);
            $params = $request->only(['code_ue', 'name']);
            $ue->update($params);
            return $ue;
        } catch (AuthorizationException $exception) {
            abort(403, "Access defined : you don't have ability to update the Ue with id $id");
        } catch (ModelNotFoundException $exception) {
            abort(404, "Not found Ue with id $id");
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        try {
            $ue = Ue::findOrFail($id);
            $this->authorize('delete', $ue);
            $ue->users()->detach(User::authenticated()->id);
            if ($ue->teachers()->count() == 0)
                $ue->delete();
        } catch (AuthorizationException $exception) {
            abort(403, "Access defined : you don't have ability to delete the Ue with id $id");
        } catch (ModelNotFoundException $exception) {
            abort(404, "Not found Ue with id $id");
        }
    }

}

?>