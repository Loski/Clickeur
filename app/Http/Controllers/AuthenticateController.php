<?php
namespace App\Http\Controllers;

use Adldap\Laravel\Facades\Adldap;
use App\Http\Requests\LoginRequest;
use App\Transformers\UserTransformer;
use App\User;
use Dingo\Api\Exception\ResourceException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * Authentication Controller
 *
 * @Resource("Authentication", uri="/api")
 */
class AuthenticateController extends Controller
{

    /**
     * Log out
     *
     * Invalidate the token, so user cannot use it anymore
     * They have to relogin to get a new token
     *
     * @Post("/logout")
     * @Versions({"v1"})
     *
     * @Parameters({
     * @Parameter("token", type="string", required=true, description="The token to invalidate")
     * })
     *
     * @Transaction({
     *      @Request({"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgsImlzcyI6Imh0dHA6XC9cL2FwaS5kZXZcL2FwaVwvYXV0aGVudGljYXRlIiwiaWF0IjoxNDg1ODEzNDY0LCJleHAiOjE0ODU4OTk4NjQsIm5iZiI6MTQ4NTgxMzQ2NCwianRpIjoiZGRmYmM4MTU3MjBhMzY3NzUzZjkxOWMwNTYxZWU0NjUifQ.MNOGIzBHINDjVbJi2yAmQMdBFmTQpiKK4jBsiKhMRHQ"}),
     *      @Response(204),
     *      @Response(422, body={"error": {"message": "Could not logout, the given data failed to pass validation.","errors": {"token": "The token field is required."},"status_code": 422}}),
     *      @Response(500, body={"error": {"message": "The token has been blacklisted","status_code": 500}})
     * })
     * @param Request $request
     * @param \Tymon\JWTAuth\JWTAuth $auth
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request, \Tymon\JWTAuth\JWTAuth $auth)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required'
        ]);

        if ($validator->fails()) {
            throw new ResourceException(
                'Could not logout, the given data failed to pass validation.',
                $validator->errors()
            );
        }

        $auth->invalidate($request->input('token'));
        return $this->response()->noContent();
    }

    /**
     * Returns the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticatedUser()
    {
        return $this->item(JWTAuth::parseToken()->authenticate(),new UserTransformer);
    }

    /**
     * Refresh the token
     *
     * @Get("/token")
     * @Versions({"v1"})
     * @Parameters({
     * @Parameter("token", type="string", required=true, description="Reset the token ttl or provide a new valid token if the given one expired")
     * })
     *
     * @Transaction({
     *      @Request({"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgsImlzcyI6Imh0dHA6XC9cL2FwaS5kZXZcL2FwaVwvYXV0aGVudGljYXRlIiwiaWF0IjoxNDg1ODEzNDY0LCJleHAiOjE0ODU4OTk4NjQsIm5iZiI6MTQ4NTgxMzQ2NCwianRpIjoiZGRmYmM4MTU3MjBhMzY3NzUzZjkxOWMwNTYxZWU0NjUifQ.MNOGIzBHINDjVbJi2yAmQMdBFmTQpiKK4jBsiKhMRHQ"}),
     *      @Response(200, body={"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgsImlzcyI6Imh0dHA6XC9cL2FwaS5kZXZcL2FwaVwvdG9rZW4iLCJpYXQiOjE0ODU4MTkxOTgsImV4cCI6MTQ4NTkwNzYzMCwibmJmIjoxNDg1ODIxMjMwLCJqdGkiOiI2NTMzZTVlYTA1MjUxMzllOTQ5N2IxNDBiM2Q5N2M0YyJ9.zD1Cs9PgQpe5YisB5dRlkDdGSxOLkgXExb62TlduRJk"}),
     *      @Response(401, body={"error": {"message": "Token not provided","status_code": 401}}),
     *      @Response(500, body={"error": {"message": "Not able to refresh Token","status_code": 500}})
     * })
     * return \Illuminate\Http\JsonResponse
     */
    public function getToken()
    {
        $token = JWTAuth::getToken();
        if (!$token) {
            return $this->response->errorUnauthorized('Token not provided');
        }
        try {
            $refreshedToken = JWTAuth::refresh($token);
        } catch (JWTException $e) {
            return $this->response->errorInternal('Not able to refresh Token');
        }
        return $this->response->withArray(['token' => $refreshedToken]);
    }

    /**
     * Login
     *
     * On success return JWT Auth token
     * Authenticate a user with a `username` and `password`
     *
     * @Post("/authenticate")
     * @Versions({"v1"})
     *
     * @Parameters({
     *      @Parameter("code", type="string", required=true, description="The user name"),
     *      @Parameter("password", type="string", required=true, description="The user's password")
     * })
     *
     * @Transaction({
     *      @Request({"code": "foo", "password": "bar"}),
     *      @Response(200, body={"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgsImlzcyI6Imh0dHA6XC9cL2FwaS5kZXZcL2FwaVwvYXV0aGVudGljYXRlIiwiaWF0IjoxNDg1ODEzNDY0LCJleHAiOjE0ODU4OTk4NjQsIm5iZiI6MTQ4NTgxMzQ2NCwianRpIjoiZGRmYmM4MTU3MjBhMzY3NzUzZjkxOWMwNTYxZWU0NjUifQ.MNOGIzBHINDjVbJi2yAmQMdBFmTQpiKK4jBsiKhMRHQ"}),
     *      @Response(401, body={"error": {"message": "invalide credentials","status_code": 401}}),
     *      @Response(500, body={"error": {"message": "could not create token","status_code": 500}})
     * })
     *
     * @param LoginRequest $request
     * @param \Tymon\JWTAuth\JWTAuth $auth
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticate(LoginRequest $request, \Tymon\JWTAuth\JWTAuth $auth)
    {
        // grab credentials from the request
        $credentials = $request->only('username', 'password');
        //dd($auth->attempt($credentials));
        try {
            // attempt to verify the credentials and create a token for the user
            if (!$token = $auth->attempt($credentials)) {
                if (Adldap::auth()->attempt($credentials['username'], $credentials['password'])) {

                    $ldapUser = Adldap::search()->whereEquals('uid', $credentials['username'])->firstOrFail();
                    User::createUserFromLDAP($ldapUser, $credentials);

                    if (!$token = $auth->attempt($credentials))
                        return $this->response()->errorUnauthorized('invalide credentials');
                } else {
                    return $this->response()->errorUnauthorized('invalide credentials');
                }
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return $this->response()->errorInternal('could not create token');
        }
        // all good so return the token
        return $this->response()->array(compact('token'));
    }
}